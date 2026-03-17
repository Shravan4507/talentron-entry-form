import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, orderBy, query, doc, onSnapshot, runTransaction } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from '../../lib/firebase';
import { getParticipationConfirmedEmailHtml } from '../../templates/participationConfirmedEmail';
import { getRegistrationRejectedEmailHtml } from '../../templates/rejectionEmail';
import { getInvoiceEmailHtml } from '../../templates/invoiceTemplate';
import { compressImage } from '../../utils/imageCompression';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import AdminManualEntry from './AdminManualEntry';
import './Admin.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [registrations, setRegistrations] = useState<any[]>([]);
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [stalls, setStalls] = useState<any[]>([]);
    const [auditLogs, setAuditLogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dashboardView, setDashboardView] = useState<'registrations' | 'inquiries' | 'stalls' | 'history'>('registrations');
    const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
    const [searchQuery, setSearchQuery] = useState('');
    const [showManualEntry, setShowManualEntry] = useState(false);
    const screenshotInputRef = useRef<HTMLInputElement>(null);
    const [pendingApprovalReg, setPendingApprovalReg] = useState<any>(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (!user) navigate('/admin-login');
        });

        const q = query(collection(db, "registrations"), orderBy("submittedAt", "desc"));
        const unsubscribeRegs = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setRegistrations(data);
            setIsLoading(false);
        });

        const qMsg = query(collection(db, "contact_messages"), orderBy("submittedAt", "desc"));
        const unsubscribeMsgs = onSnapshot(qMsg, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setInquiries(data);
        });

        const qStall = query(collection(db, "stall_inquiries"), orderBy("submittedAt", "desc"));
        const unsubscribeStalls = onSnapshot(qStall, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setStalls(data);
        });

        const qAudit = query(collection(db, "audit_logs"), orderBy("timestamp", "desc"));
        const unsubscribeAudit = onSnapshot(qAudit, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAuditLogs(data);
        });

        return () => {
            unsubscribeAuth();
            unsubscribeRegs();
            unsubscribeMsgs();
            unsubscribeStalls();
            unsubscribeAudit();
        };
    }, [navigate]);

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/admin-login');
    };

    const stats = useMemo(() => {
        const total = registrations.length;
        const pending = registrations.filter(r => r.status === 'pending' || r.status === 'payment_upload_pending').length;
        const approved = registrations.filter(r => r.status === 'approved').length;
        const rejected = registrations.filter(r => r.status === 'rejected').length;
        const revenue = registrations
            .filter(r => r.status === 'approved')
            .reduce((sum, r) => sum + (Number(r.totalActualAmount) || 0), 0);
        
        return { total, pending, approved, rejected, revenue };
    }, [registrations]);

    const filteredData = useMemo(() => {
        let base = registrations;
        if (activeTab === 'pending') {
            base = base.filter(r => r.status === 'pending' || r.status === 'payment_upload_pending');
        } else if (activeTab !== 'all') {
            base = base.filter(r => r.status === activeTab);
        }

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            base = base.filter(r => 
                `${r.firstName} ${r.lastName}`.toLowerCase().includes(q) ||
                r.genre?.toLowerCase().includes(q) ||
                r.transactionId?.toLowerCase().includes(q)
            );
        }
        return base;
    }, [registrations, activeTab, searchQuery]);

    const filteredMessages = useMemo(() => {
        if (!searchQuery) return inquiries;
        const q = searchQuery.toLowerCase();
        return inquiries.filter(m => 
            m.name?.toLowerCase().includes(q) || 
            m.email?.toLowerCase().includes(q) || 
            m.message?.toLowerCase().includes(q)
        );
    }, [inquiries, searchQuery]);

    const filteredStalls = useMemo(() => {
        if (!searchQuery) return stalls;
        const q = searchQuery.toLowerCase();
        return stalls.filter(s => 
            s.fullName?.toLowerCase().includes(q) || 
            s.businessName?.toLowerCase().includes(q) || 
            s.stallType?.toLowerCase().includes(q) ||
            s.message?.toLowerCase().includes(q)
        );
    }, [stalls, searchQuery]);

    const handleApprove = async (reg: any) => {
        if (reg.status === 'payment_upload_pending' && !reg.screenshotURL) {
            if (!window.confirm("This registration is missing a payment screenshot. You will be prompted to upload one to proceed with approval. Click OK to select file.")) return;
            setPendingApprovalReg(reg);
            screenshotInputRef.current?.click();
            return;
        }

        if (!window.confirm(`Confirm participation for ${reg.firstName}? This will generate a sequential invoice.`)) return;
        proceedWithApproval(reg);
    };

    const handleAdminScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !pendingApprovalReg) return;

        try {
            setIsUploading(true);
            const compressed = await compressImage(file);
            const fileExtension = file.name.split('.').pop();
            const fileName = `payments/${pendingApprovalReg.transactionId}_admin_${Date.now()}.${fileExtension}`;
            const storageRef = ref(storage, fileName);
            
            const uploadResult = await uploadBytes(storageRef, compressed);
            const screenshotURL = await getDownloadURL(uploadResult.ref);

            // Directly proceed with approval using this URL
            await proceedWithApproval(pendingApprovalReg, screenshotURL);
            
            setPendingApprovalReg(null);
            if (screenshotInputRef.current) screenshotInputRef.current.value = '';
        } catch (error) {
            console.error("Manual screenshot upload failed:", error);
            alert("Failed to upload screenshot. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const proceedWithApproval = async (reg: any, manualScreenshotURL?: string) => {
        try {
            await runTransaction(db, async (transaction) => {
                const regRef = doc(db, "registrations", reg.id);
                const counterRef = doc(db, "metadata", "counters");
                const auditRef = doc(collection(db, "audit_logs"));
                
                const regSnap = await transaction.get(regRef);
                const counterSnap = await transaction.get(counterRef);

                // Check for concurrency - has someone else approved it already?
                if (regSnap.data()?.status !== 'pending' && regSnap.data()?.status !== 'payment_upload_pending') {
                    throw new Error("Registration is no longer pending.");
                }
                
                let nextNum = 1001;
                if (counterSnap.exists()) {
                    nextNum = (counterSnap.data().invoiceCounter || 1000) + 1;
                }
                
                const invoiceNumber = `INV/25-26/TLRN/${nextNum}`;
                const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });

                // 1. Update counter
                transaction.set(counterRef, { invoiceCounter: nextNum }, { merge: true });

                // 2. Update registration with Audit Trail
                const updateData: any = { 
                    status: 'approved',
                    invoiceNumber: invoiceNumber,
                    approvedAt: new Date(),
                    processedBy: auth.currentUser?.email || 'unknown',
                    processedAt: new Date()
                };

                if (manualScreenshotURL) {
                    updateData.screenshotURL = manualScreenshotURL;
                }

                transaction.update(regRef, updateData);

                // 3. Create Audit Log
                transaction.set(auditRef, {
                    type: 'APPROVAL',
                    regId: reg.id,
                    participantName: `${reg.firstName} ${reg.lastName}`,
                    invoiceNumber: invoiceNumber,
                    adminEmail: auth.currentUser?.email || 'unknown',
                    timestamp: new Date()
                });

                // 4. Prepare & Trigger Emails (SEPARATE EMAILS for reliability)
                const confirmationHtml = getParticipationConfirmedEmailHtml(
                    reg.firstName, reg.genre, reg.teamType, reg.transactionId, reg.totalActualAmount || 0
                );
                const invoiceHtml = getInvoiceEmailHtml({
                    firstName: reg.firstName, lastName: reg.lastName, email: reg.email,
                    genre: reg.genre, teamType: reg.teamType, transactionId: reg.transactionId,
                    amount: reg.totalActualAmount || 0, date: today, invoiceNumber: invoiceNumber
                });

                const mailCol = collection(db, "mail");
                
                // Email 1: Confirmation
                transaction.set(doc(mailCol), {
                    to: reg.email,
                    message: { 
                        subject: `Confirmed: Participation in ${reg.genre} | Talentron '26`, 
                        html: confirmationHtml 
                    }
                });

                // Email 2: Official Invoice
                transaction.set(doc(mailCol), {
                    to: reg.email,
                    message: { 
                        subject: `Tax Invoice: ${invoiceNumber} | Talentron '26`, 
                        html: invoiceHtml 
                    }
                });
            });

            alert("Approved & Emails Sent!");
        } catch (error: any) {
            console.error("Approval error:", error);
            alert(error.message === "Registration is no longer pending." 
                ? "This registration was already processed by another admin." 
                : "Error in approval transaction.");
        }
    };

    const handleReject = async (reg: any) => {
        const reason = window.prompt(`Enter rejection reason for ${reg.firstName} (optional):`, "Payment verification failed.");
        if (reason === null) return;

        if (!window.confirm(`Reject registration for ${reg.firstName}? This will send a rejection email.`)) return;

        try {
            await runTransaction(db, async (transaction) => {
                const regRef = doc(db, "registrations", reg.id);
                const auditRef = doc(collection(db, "audit_logs"));
                const regSnap = await transaction.get(regRef);

                if (regSnap.data()?.status !== 'pending' && regSnap.data()?.status !== 'payment_upload_pending') {
                    throw new Error("Registration is no longer pending.");
                }

                transaction.update(regRef, { 
                    status: 'rejected',
                    rejectionReason: reason,
                    processedBy: auth.currentUser?.email || 'unknown',
                    processedAt: new Date()
                });

                transaction.set(auditRef, {
                    type: 'REJECTION',
                    regId: reg.id,
                    participantName: `${reg.firstName} ${reg.lastName}`,
                    reason: reason,
                    adminEmail: auth.currentUser?.email || 'unknown',
                    timestamp: new Date()
                });

                const emailHtml = getRegistrationRejectedEmailHtml(reg.firstName, reg.genre, reason);
                const mailCol = collection(db, "mail");
                transaction.set(doc(mailCol), {
                    to: reg.email,
                    message: { 
                        subject: `Update on your registration - ${reg.firstName} | Talentron '26`, 
                        html: emailHtml 
                    }
                });
            });

            alert("Rejected & Logged.");
        } catch (error: any) {
            console.error(error);
            alert(error.message === "Registration is no longer pending." 
                ? "This registration was already processed." 
                : "Error in rejection.");
        }
    };

    const exportToExcel = () => {
        const order = [
            'submittedAt', 
            'invoiceNumber',
            'status',
            'firstName', 
            'lastName', 
            'email', 
            'cellPhone', 
            'whatsappNumber', 
            'dob', 
            'sex', 
            'collegeName', 
            'genre', 
            'teamType', 
            'groupSize', 
            'totalActualAmount', 
            'paymentMethod',
            'transactionId', 
            'approvedAt',
            'processedBy',
            'manualEntry',
            'addedByAdmin',
            'screenshotURL',
            'rejectionReason'
        ];

        const data = registrations.map(item => {
            const obj: any = {};
            order.forEach(field => {
                let val = item[field];
                // Handle Firebase Timestamps
                if ((field === 'submittedAt' || field === 'approvedAt' || field === 'processedAt') && val?.toDate) {
                    val = val.toDate().toLocaleString('en-IN');
                }
                // Handle booleans
                if (typeof val === 'boolean') val = val ? 'Yes' : 'No';
                
                obj[field] = val || '';
            });
            return obj;
        });

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Registrations");
        const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([buf]), `Talentron_Registrations_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    return (
        <div className="admin-dashboard-page">
            <div className="admin-container">
                <header className="admin-header">
                    <div className="admin-header-main">
                        <h1>Operations Hub</h1>
                        <div className="dashboard-switcher">
                            <button 
                                className={dashboardView === 'registrations' ? 'active' : ''} 
                                onClick={() => setDashboardView('registrations')}
                            >
                                Registrations
                            </button>
                            <button 
                                className={dashboardView === 'inquiries' ? 'active' : ''} 
                                onClick={() => setDashboardView('inquiries')}
                            >
                                Inquiries {inquiries.filter(m => m.status === 'unread').length > 0 && <span className="unread-dot"></span>}
                            </button>
                            <button 
                                className={dashboardView === 'stalls' ? 'active' : ''} 
                                onClick={() => setDashboardView('stalls')}
                            >
                                Stalls {stalls.filter(s => s.status === 'unread').length > 0 && <span className="unread-dot"></span>}
                            </button>
                            <button 
                                className={dashboardView === 'history' ? 'active' : ''} 
                                onClick={() => setDashboardView('history')}
                            >
                                History
                            </button>
                        </div>
                    </div>
                    <button className="admin-logout" onClick={handleLogout}>Log Out</button>
                </header>

                <div className="admin-stats-summary">
                    <div className="stat-box">
                        <div className="stat-label">Total Volume</div>
                        <div className="stat-value">{stats.total}</div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-label">Pending Review</div>
                        <div className="stat-value" style={{color: 'var(--accent-yellow)'}}>{stats.pending}</div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-label">Approved</div>
                        <div className="stat-value" style={{color: 'var(--accent-green)'}}>{stats.approved}</div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-label">Revenue Collected</div>
                        <div className="stat-value">₹{stats.revenue}</div>
                    </div>
                </div>

                <div className="admin-controls">
                    <input 
                        type="text" 
                        className="admin-search" 
                        placeholder={
                            dashboardView === 'registrations' ? "Search registrations..." : 
                            dashboardView === 'inquiries' ? "Search messages..." :
                            dashboardView === 'stalls' ? "Search stall inquiries..." :
                            "Search audit logs..."
                        } 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {dashboardView === 'registrations' && (
                        <div className="admin-tabs">
                            <button className={activeTab === 'pending' ? 'active' : ''} onClick={() => setActiveTab('pending')}>Pending ({stats.pending})</button>
                            <button className={activeTab === 'approved' ? 'active' : ''} onClick={() => setActiveTab('approved')}>Approved</button>
                            <button className={activeTab === 'rejected' ? 'active' : ''} onClick={() => setActiveTab('rejected')}>Rejected</button>
                            <button className={activeTab === 'all' ? 'active' : ''} onClick={() => setActiveTab('all')}>All</button>
                        </div>
                    )}
                    <div className="admin-action-btns">
                        {dashboardView === 'registrations' && (
                            <button 
                                className="manual-entry-btn" 
                                onClick={() => setShowManualEntry(true)}
                                style={{
                                    background: 'var(--accent-blue)',
                                    color: '#000',
                                    padding: '0.8rem 1.5rem',
                                    fontFamily: 'Goride',
                                    border: '2px solid #000',
                                    borderRadius: '2rem',
                                    boxShadow: '4px 4px 0px #fff',
                                    cursor: 'pointer',
                                    marginRight: '1rem'
                                }}
                            >
                                + MANUAL ENTRY
                            </button>
                        )}
                        {dashboardView === 'registrations' && <button className="export-btn" onClick={exportToExcel}>Export .XLSX</button>}
                    </div>
                </div>

                <div className="admin-table-wrapper">
                    {dashboardView === 'registrations' ? (
                        <table className="minimal-table">
                            <thead>
                                <tr>
                                    <th>Participant</th>
                                    <th>Category</th>
                                    <th>Tx Check</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr><td colSpan={5} style={{textAlign: 'center', padding: '2rem'}}>Loading...</td></tr>
                                ) : filteredData.length === 0 ? (
                                    <tr><td colSpan={5} style={{textAlign: 'center', padding: '2rem'}}>No records found.</td></tr>
                                ) : (
                                    filteredData.map(reg => (
                                        <tr key={reg.id}>
                                            <td>
                                                <div style={{fontWeight: 600}}>{reg.firstName} {reg.lastName}</div>
                                                <div style={{fontSize: '0.75rem', color: 'var(--text-dim)'}}>{reg.cellPhone}</div>
                                            </td>
                                            <td>
                                                <div>{reg.genre}</div>
                                                <div style={{fontSize: '0.75rem', color: 'var(--text-dim)'}}>{reg.teamType}</div>
                                            </td>
                                            <td>
                                                <div style={{fontWeight: 600}}>₹{reg.totalActualAmount}</div>
                                                <div style={{fontSize: '0.75rem', borderBottom: '1px solid #333', display: 'inline-block'}}>
                                                    {reg.paymentMethod === 'cash' ? <span style={{color: 'var(--accent-green)'}}>💵 CASH</span> : (reg.transactionId || '---')}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`status-pill ${reg.status}`}>{reg.status}</span>
                                            </td>
                                            <td className="row-actions">
                                                {reg.screenshotURL && (
                                                    <a href={reg.screenshotURL} target="_blank" rel="noreferrer" className="action-link">Proof</a>
                                                )}
                                                {reg.status === 'pending' || reg.status === 'payment_upload_pending' ? (
                                                    <>
                                                        <button className="action-confirm" onClick={() => handleApprove(reg)} disabled={isUploading}>
                                                            {isUploading && pendingApprovalReg?.id === reg.id ? 'Uploading...' : 'Approve'}
                                                        </button>
                                                        <button className="action-confirm" style={{color: 'var(--accent-red)'}} onClick={() => handleReject(reg)} disabled={isUploading}>Reject</button>
                                                    </>
                                                ) : null}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    ) : dashboardView === 'inquiries' ? (
                        <table className="minimal-table">
                            <thead>
                                <tr>
                                    <th>Sender</th>
                                    <th>Message</th>
                                    <th>Received</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMessages.length === 0 ? (
                                    <tr><td colSpan={4} style={{textAlign: 'center', padding: '2rem'}}>No messages yet.</td></tr>
                                ) : (
                                    filteredMessages.map(msg => (
                                        <tr key={msg.id}>
                                            <td>
                                                <div style={{fontWeight: 600}}>{msg.name}</div>
                                                <div style={{fontSize: '0.75rem', color: 'var(--accent-blue)'}}>{msg.email}</div>
                                            </td>
                                            <td style={{maxWidth: '400px'}}>
                                                <div style={{fontSize: '0.9rem', lineHeight: '1.4'}}>{msg.message}</div>
                                            </td>
                                            <td style={{fontSize: '0.75rem', color: 'var(--text-dim)'}}>
                                                {msg.submittedAt?.toDate?.() ? msg.submittedAt.toDate().toLocaleString('en-IN') : 'Just now'}
                                            </td>
                                            <td>
                                                <span className={`status-pill ${msg.status || 'unread'}`}>{msg.status || 'unread'}</span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    ) : dashboardView === 'history' ? (
                        <table className="minimal-table">
                            <thead>
                                <tr>
                                    <th>Admin</th>
                                    <th>Action</th>
                                    <th>Participant / Target</th>
                                    <th>Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {auditLogs.length === 0 ? (
                                    <tr><td colSpan={4} style={{textAlign: 'center', padding: '2rem'}}>No logs yet.</td></tr>
                                ) : (
                                    auditLogs.filter(log => {
                                        if (!searchQuery) return true;
                                        const q = searchQuery.toLowerCase();
                                        return (
                                            log.adminEmail?.toLowerCase().includes(q) || 
                                            log.type?.toLowerCase().includes(q) || 
                                            log.participantName?.toLowerCase().includes(q) ||
                                            log.invoiceNumber?.toLowerCase().includes(q)
                                        );
                                    }).map(log => (
                                        <tr key={log.id}>
                                            <td>
                                                <div style={{fontWeight: 600, fontSize: '0.8rem'}}>{log.adminEmail}</div>
                                            </td>
                                            <td>
                                                <span className={`status-pill ${log.type?.toLowerCase()}`} style={{background: log.type === 'APPROVAL' ? '#003c20' : '#3c1010', color: log.type === 'APPROVAL' ? '#00ff88' : '#ff5555'}}>
                                                    {log.type}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{fontWeight: 600}}>{log.participantName}</div>
                                                {log.invoiceNumber && <div style={{fontSize: '0.7rem', color: 'var(--text-dim)'}}>{log.invoiceNumber}</div>}
                                                {log.reason && <div style={{fontSize: '0.8rem', color: 'var(--accent-red)'}}>{log.reason}</div>}
                                            </td>
                                            <td style={{fontSize: '0.75rem', color: 'var(--text-dim)'}}>
                                                {log.timestamp?.toDate?.() ? log.timestamp.toDate().toLocaleString('en-IN') : 'Just now'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    ) : (
                        <table className="minimal-table">
                            <thead>
                                <tr>
                                    <th>Business / Contact</th>
                                    <th>Stall Details</th>
                                    <th>Requirements</th>
                                    <th>Received</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStalls.length === 0 ? (
                                    <tr><td colSpan={5} style={{textAlign: 'center', padding: '2rem'}}>No stall inquiries yet.</td></tr>
                                ) : (
                                    filteredStalls.map(stall => (
                                        <tr key={stall.id}>
                                            <td>
                                                <div style={{fontWeight: 600}}>{stall.businessName}</div>
                                                <div style={{fontSize: '0.8rem'}}>{stall.fullName}</div>
                                                <div style={{fontSize: '0.75rem', color: 'var(--accent-blue)'}}>{stall.phoneNumber}</div>
                                            </td>
                                            <td>
                                                <span className={`status-pill ${stall.stallType}`} style={{background: '#333'}}>{stall.stallType}</span>
                                            </td>
                                            <td style={{maxWidth: '300px'}}>
                                                <div style={{fontSize: '0.85rem', lineHeight: '1.4'}}>{stall.message}</div>
                                            </td>
                                            <td style={{fontSize: '0.75rem', color: 'var(--text-dim)'}}>
                                                {stall.submittedAt?.toDate?.() ? stall.submittedAt.toDate().toLocaleString('en-IN') : 'Just now'}
                                            </td>
                                            <td>
                                                <span className={`status-pill ${stall.status || 'unread'}`}>{stall.status || 'unread'}</span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {showManualEntry && (
                <AdminManualEntry onSuccess={() => {
                    setShowManualEntry(false);
                    // Refresh is automatic due to onSnapshot
                }} />
            )}

            <input 
                type="file" 
                ref={screenshotInputRef} 
                className="hidden-file-input"
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleAdminScreenshotUpload}
            />
        </div>
    );
};

export default AdminDashboard;
