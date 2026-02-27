import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, orderBy, query, doc, onSnapshot, runTransaction } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { getParticipationConfirmedEmailHtml } from '../../templates/participationConfirmedEmail';
import { getRegistrationRejectedEmailHtml } from '../../templates/rejectionEmail';
import { getInvoiceEmailHtml } from '../../templates/invoiceTemplate';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import './Admin.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [registrations, setRegistrations] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
    const [searchQuery, setSearchQuery] = useState('');

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

        return () => {
            unsubscribeAuth();
            unsubscribeRegs();
        };
    }, [navigate]);

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/admin-login');
    };

    const stats = useMemo(() => {
        const total = registrations.length;
        const pending = registrations.filter(r => r.status === 'pending').length;
        const approved = registrations.filter(r => r.status === 'approved').length;
        const rejected = registrations.filter(r => r.status === 'rejected').length;
        const revenue = registrations
            .filter(r => r.status === 'approved')
            .reduce((sum, r) => sum + (Number(r.totalActualAmount) || 0), 0);
        
        return { total, pending, approved, rejected, revenue };
    }, [registrations]);

    const filteredData = useMemo(() => {
        let base = registrations;
        if (activeTab !== 'all') base = base.filter(r => r.status === activeTab);

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

    const handleApprove = async (reg: any) => {
        if (!window.confirm(`Confirm participation for ${reg.firstName}? This will generate a sequential invoice.`)) return;

        try {
            await runTransaction(db, async (transaction) => {
                const regRef = doc(db, "registrations", reg.id);
                const counterRef = doc(db, "metadata", "counters");
                const auditRef = doc(collection(db, "audit_logs"));
                
                const regSnap = await transaction.get(regRef);
                const counterSnap = await transaction.get(counterRef);

                // Check for concurrency - has someone else approved it already?
                if (regSnap.data()?.status !== 'pending') {
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
                transaction.update(regRef, { 
                    status: 'approved',
                    invoiceNumber: invoiceNumber,
                    approvedAt: new Date(),
                    processedBy: auth.currentUser?.email || 'unknown',
                    processedAt: new Date()
                });

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

                if (regSnap.data()?.status !== 'pending') {
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
        const order = ['submittedAt', 'firstName', 'lastName', 'genre', 'teamType', 'totalActualAmount', 'transactionId', 'email', 'status'];
        const data = registrations.map(item => {
            const obj: any = {};
            order.forEach(field => {
                let val = item[field];
                if (field === 'submittedAt' && val?.toDate) val = val.toDate().toLocaleString();
                obj[field] = val || '';
            });
            return obj;
        });

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Registrations");
        const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([buf]), "Talentron_Registrations.xlsx");
    };

    return (
        <div className="admin-dashboard-page">
            <div className="admin-container">
                <header className="admin-header">
                    <h1>Talentron '26 Operations</h1>
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
                        placeholder="Search records..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="admin-tabs">
                        <button className={activeTab === 'pending' ? 'active' : ''} onClick={() => setActiveTab('pending')}>Pending ({stats.pending})</button>
                        <button className={activeTab === 'approved' ? 'active' : ''} onClick={() => setActiveTab('approved')}>Approved</button>
                        <button className={activeTab === 'rejected' ? 'active' : ''} onClick={() => setActiveTab('rejected')}>Rejected</button>
                        <button className={activeTab === 'all' ? 'active' : ''} onClick={() => setActiveTab('all')}>All</button>
                    </div>
                    <button className="export-btn" onClick={exportToExcel}>Export .XLSX</button>
                </div>

                <div className="admin-table-wrapper">
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
                                            <div style={{fontSize: '0.75rem', borderBottom: '1px solid #333', display: 'inline-block'}}>{reg.transactionId}</div>
                                        </td>
                                        <td>
                                            <span className={`status-pill ${reg.status}`}>{reg.status}</span>
                                        </td>
                                        <td className="row-actions">
                                            {reg.screenshotURL && (
                                                <a href={reg.screenshotURL} target="_blank" rel="noreferrer" className="action-link">Proof</a>
                                            )}
                                            {reg.status === 'pending' && (
                                                <>
                                                    <button className="action-confirm" onClick={() => handleApprove(reg)}>Approve</button>
                                                    <button className="action-confirm" style={{color: 'var(--accent-red)'}} onClick={() => handleReject(reg)}>Reject</button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
