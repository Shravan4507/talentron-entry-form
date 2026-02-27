import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../../lib/firebase';
import OutlinedTitle from '../../components/heading/OutlinedTitle';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import './Admin.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [isExporting, setIsExporting] = useState(false);
    const [exportProgress, setExportProgress] = useState(0);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate('/admin-login');
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/admin-login');
    };

    const fetchAllRegistrations = async () => {
        const q = query(collection(db, "registrations"), orderBy("submittedAt", "desc"));
        const snap = await getDocs(q);
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    };

    const formatDataForExport = (data: Record<string, any>[]) => {
        const order = [
            'submittedAt', 'firstName', 'lastName', 'dob', 'sex', 
            'cellPhone', 'whatsappNumber', 'email', 'collegeName', 
            'genre', 'teamType', 'groupSize', 'totalActualAmount', 
            'transactionId', 'screenshotURL', 'status'
        ];

        return data.map(item => {
            const formatted: Record<string, any> = {};
            
            // 1. Add fields in specified order
            order.forEach(field => {
                let value = item[field];
                
                // Special handling for the timestamp
                if (field === 'submittedAt') {
                    if (value && typeof value.toDate === 'function') {
                        value = value.toDate().toLocaleString();
                    } else if (value && value.seconds) {
                        value = new Date(value.seconds * 1000).toLocaleString();
                    }
                }
                
                formatted[field] = value !== undefined ? value : '';
            });

            // 2. Add any remaining fields that weren't in the list
            Object.keys(item).forEach(key => {
                if (!order.includes(key)) {
                    formatted[key] = item[key];
                }
            });

            return formatted;
        });
    };

    const exportToExcel = async () => {
        setIsExporting(true);
        try {
            const data = await fetchAllRegistrations();
            const formattedData = formatDataForExport(data);
            const worksheet = XLSX.utils.json_to_sheet(formattedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
            
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const finalData = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(finalData, `Talentron_Registrations_${new Date().toISOString().split('T')[0]}.xlsx`);
        } catch (error) {
            console.error("Excel export error:", error);
            alert("Export failed. Check console.");
        } finally {
            setIsExporting(false);
        }
    };

    const exportToCSV = async () => {
        setIsExporting(true);
        try {
            const data = await fetchAllRegistrations();
            const formattedData = formatDataForExport(data);
            const worksheet = XLSX.utils.json_to_sheet(formattedData);
            const csvData = XLSX.utils.sheet_to_csv(worksheet);
            const finalData = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
            saveAs(finalData, `Talentron_Registrations_${new Date().toISOString().split('T')[0]}.csv`);
        } catch (error) {
            console.error("CSV export error:", error);
            alert("Export failed.");
        } finally {
            setIsExporting(false);
        }
    };

    const exportStorageFolder = async () => {
        setIsExporting(true);
        setExportProgress(0);
        try {
            const paymentsRef = ref(storage, 'payments');
            const result = await listAll(paymentsRef);
            
            const zip = new JSZip();
            const totalFiles = result.items.length;
            
            if (totalFiles === 0) {
                alert("No payments found in storage.");
                setIsExporting(false);
                return;
            }

            const downloadPromises = result.items.map(async (item, index) => {
                const url = await getDownloadURL(item);
                const response = await fetch(url);
                const blob = await response.blob();
                zip.file(item.name, blob);
                setExportProgress(Math.round(((index + 1) / totalFiles) * 100));
            });

            await Promise.all(downloadPromises);
            
            const content = await zip.generateAsync({ type: "blob" });
            saveAs(content, `Talentron_Payment_Screenshots_${new Date().toISOString().split('T')[0]}.zip`);
        } catch (error) {
            console.error("Storage export error:", error);
            alert("Storage export failed. This might be due to CORS settings on Firebase Storage.");
        } finally {
            setIsExporting(false);
            setExportProgress(0);
        }
    };

    return (
        <div className="admin-dashboard-page">
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <OutlinedTitle 
                        text="ADMIN PANEL" 
                        fillColor="linear-gradient(180deg, #00ff88 0%, #00a1ff 100%)" 
                        outlineColor="#000" 
                        shadowColor="#000"
                        className="small"
                    />
                    <button className="logout-btn" onClick={handleLogout}>LOGOUT</button>
                </div>

                <div className="stats-grid">
                    <div className="admin-card">
                        <h3>DATABASE EXPORT</h3>
                        <p>Export all registration documents from Firestore.</p>
                        <div className="btn-group">
                            <button className="action-btn excel" onClick={exportToExcel} disabled={isExporting}>
                                EXPORT AS XLSX
                            </button>
                            <button className="action-btn csv" onClick={exportToCSV} disabled={isExporting}>
                                EXPORT AS CSV
                            </button>
                        </div>
                    </div>

                    <div className="admin-card">
                        <h3>STORAGE EXPORT</h3>
                        <p>Download all payment screenshots as a ZIP file.</p>
                        <button className="action-btn storage" onClick={exportStorageFolder} disabled={isExporting}>
                            {isExporting && exportProgress > 0 ? `ZIPPING: ${exportProgress}%` : "DOWNLOAD ALL SCREENSHOTS"}
                        </button>
                    </div>
                </div>

                {isExporting && (
                    <div className="export-loader">
                        <div className="spinner"></div>
                        <p>Processing Export...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
