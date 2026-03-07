import React, { useState, useEffect, useRef } from 'react';
import { collection, addDoc, serverTimestamp, doc, getDoc, setDoc, query, where, getDocs, limit } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from '../../lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import SearchableDropdown from '../../components/searchable-dropdown/SearchableDropdown';
import DatePicker from '../../components/date-picker/DatePicker';
import collegesData from '../../data/colleges.json';
import { compressImage } from '../../utils/imageCompression';
import './AdminManualEntry.css';

interface ManualEntryProps {
    onSuccess: () => void;
}

const UPI_ID = import.meta.env.VITE_UPI_ID || "talentron@icici";

const AdminManualEntry: React.FC<ManualEntryProps> = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        cellPhone: '+91 ',
        whatsappNumber: '+91 ',
        dob: '',
        sex: '',
        collegeName: '',
        genre: '',
        teamType: '',
        groupSize: '1',
        paymentMethod: 'online', // 'online' or 'cash'
        transactionId: '',
        paymentScreenshot: null as File | null,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const screenshotInputRef = useRef<HTMLInputElement>(null);

    const genres = ["Music", "Dance", "Drama", "Band", "Street Play"];
    const teamTypes = ["Solo", "Duet", "Group"];

    useEffect(() => {
        setIsMobile(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let digits = value.replace(/\D/g, '');
        if (digits.startsWith('91')) digits = digits.slice(2);
        if (digits.length > 10) digits = digits.slice(0, 10);
        setFormData(prev => ({ ...prev, [name]: '+91 ' + digits }));
    };

    const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, paymentScreenshot: e.target.files![0] }));
        }
    };

    const calculateAmount = (genre: string, type: string, size: string) => {
        let perPerson = 0;
        if (genre === 'Music') perPerson = type === 'Solo' ? 200 : 150;
        else if (genre === 'Dance') perPerson = type === 'Solo' ? 200 : 150;
        else if (genre === 'Drama') perPerson = 100;
        else if (genre === 'Band') perPerson = 200;
        else if (genre === 'Street Play') perPerson = 100;

        const multiplier = type === 'Solo' ? 1 : (type === 'Duet' ? 2 : parseInt(size) || 0);
        return perPerson * multiplier;
    };

    const validate = () => {
        const newErrors: any = {};
        if (!formData.firstName) newErrors.firstName = "First Name Required";
        if (!formData.lastName) newErrors.lastName = "Last Name Required";
        if (!formData.email) newErrors.email = "Email Required";
        if (!formData.genre) newErrors.genre = "Category Required";
        if (!formData.teamType) newErrors.teamType = "Team Type Required";
        
        if (formData.paymentMethod === 'online') {
            if (!formData.transactionId || formData.transactionId.length !== 12) {
                newErrors.transactionId = "Exact 12-Digit Transaction ID Required";
            }
            if (!formData.paymentScreenshot) {
                newErrors.paymentScreenshot = "Screenshot Required for Online Payment";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            // 1. Check for duplicates
            const q = query(
                collection(db, "registrations"), 
                where("email", "==", formData.email), 
                where("genre", "==", formData.genre), 
                limit(1)
            );
            const snap = await getDocs(q);
            if (!snap.empty) {
                alert("Participant already registered for this category.");
                setIsSubmitting(false);
                return;
            }

            let screenshotURL = "";

            // 2. Handle Online Specifics
            if (formData.paymentMethod === 'online') {
                // Check Transaction ID lock
                const lockRef = doc(db, "transaction_locks", formData.transactionId);
                const lockSnap = await getDoc(lockRef);
                if (lockSnap.exists()) {
                    alert("This Transaction ID has already been recorded in another registration.");
                    setIsSubmitting(false);
                    return;
                }

                // Upload screenshot
                if (formData.paymentScreenshot) {
                    const compressed = await compressImage(formData.paymentScreenshot);
                    const fileExt = formData.paymentScreenshot.name.split('.').pop();
                    const fileName = `payments/manual_${formData.transactionId}_${Date.now()}.${fileExt}`;
                    const storageRef = ref(storage, fileName);
                    const uploadResult = await uploadBytes(storageRef, compressed);
                    screenshotURL = await getDownloadURL(uploadResult.ref);
                }

                // Lock transaction ID
                await setDoc(lockRef, { 
                    email: formData.email, 
                    lockedAt: serverTimestamp(), 
                    type: 'manual_admin' 
                });
            }

            // 3. Submit Registration to the standard 'registrations' collection
            await addDoc(collection(db, "registrations"), {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                cellPhone: formData.cellPhone,
                whatsappNumber: formData.whatsappNumber,
                dob: formData.dob,
                sex: formData.sex,
                collegeName: formData.collegeName,
                genre: formData.genre,
                teamType: formData.teamType,
                groupSize: formData.teamType === 'Group' ? formData.groupSize : (formData.teamType === 'Duet' ? '2' : '1'),
                paymentMethod: formData.paymentMethod,
                transactionId: formData.transactionId,
                status: 'pending',
                submittedAt: serverTimestamp(),
                addedByAdmin: auth.currentUser?.email || 'admin',
                manualEntry: true,
                screenshotURL: screenshotURL,
                totalActualAmount: calculateAmount(formData.genre, formData.teamType, formData.groupSize)
            });

            alert("Manual Entry Recorded Successfully!");
            onSuccess();
        } catch (err) {
            console.error(err);
            alert("Unexpected error recording entry. Check console.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const amount = calculateAmount(formData.genre, formData.teamType, formData.groupSize);
    const upiLink = `upi://pay?pa=${UPI_ID}&pn=Talentron&am=${amount}&cu=INR&tn=Reg_${formData.genre}_${formData.firstName}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiLink)}`;

    return (
        <div className="manual-entry-overlay">
            <motion.div 
                className="manual-entry-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <div className="manual-entry-header">
                    <h2>Admin Manual Registration</h2>
                    <p>Bypasses Google verification. Use for on-site or direct payments.</p>
                </div>

                <form onSubmit={handleSubmit} className="manual-form">
                    <div className="form-section">
                        <h3>1. Participant Info</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>First Name</label>
                                <input name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="Legal Name" />
                                {errors.firstName && <span className="error">{errors.firstName}</span>}
                            </div>
                            <div className="form-group">
                                <label>Last Name</label>
                                <input name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Surname" />
                                {errors.lastName && <span className="error">{errors.lastName}</span>}
                            </div>
                            <div className="form-group full-width">
                                <label>Email (Direct Entry)</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="verified-user@example.com" />
                                {errors.email && <span className="error">{errors.email}</span>}
                            </div>
                            <div className="form-group">
                                <label>Cell Phone</label>
                                <input name="cellPhone" value={formData.cellPhone} onChange={handlePhoneChange} required />
                            </div>
                            <div className="form-group">
                                <label>WhatsApp Number</label>
                                <input name="whatsappNumber" value={formData.whatsappNumber} onChange={handlePhoneChange} required />
                            </div>
                            <div className="form-group">
                                <DatePicker 
                                    label="Date of Birth"
                                    value={formData.dob}
                                    onChange={(val) => setFormData(prev => ({ ...prev, dob: val }))}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Gender</label>
                                <select name="sex" value={formData.sex} onChange={handleChange} required>
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                    </div>


                    <div className="form-section">
                        <h3>2. Event Preference</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Competition Category</label>
                                <select name="genre" value={formData.genre} onChange={handleChange} required>
                                    <option value="">Select Category</option>
                                    {genres.map(g => <option key={g} value={g}>{g}</option>)}
                                </select>
                                {errors.genre && <span className="error">{errors.genre}</span>}
                            </div>
                            <div className="form-group">
                                <label>Participation Type</label>
                                <select name="teamType" value={formData.teamType} onChange={handleChange} required>
                                    <option value="">Select Type</option>
                                    {teamTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                                {errors.teamType && <span className="error">{errors.teamType}</span>}
                            </div>
                            {formData.teamType === 'Group' && (
                                <div className="form-group">
                                    <label>Estimated Group Size</label>
                                    <input type="number" name="groupSize" value={formData.groupSize} onChange={handleChange} />
                                </div>
                            )}
                            <div className="form-group full-width">
                                <SearchableDropdown 
                                    label="College / Institution"
                                    options={collegesData}
                                    value={formData.collegeName}
                                    onChange={(val) => setFormData(prev => ({ ...prev, collegeName: val }))}
                                    placeholder="Search college data..."
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>3. Managed Payment Workflow</h3>
                        <div className="payment-toggle">
                            <button 
                                type="button" 
                                className={formData.paymentMethod === 'online' ? 'active' : ''}
                                onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'online' }))}
                            >
                                UPI Payment Flow
                            </button>
                            <button 
                                type="button" 
                                className={formData.paymentMethod === 'cash' ? 'active' : ''}
                                onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'cash' }))}
                            >
                                Cash Settlement
                            </button>
                        </div>
                        
                        <AnimatePresence mode="wait">
                            {formData.paymentMethod === 'online' ? (
                                <motion.div 
                                    key="online"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="payment-layout"
                                >
                                    <div className="payment-visuals">
                                        <div className="amount-card">
                                            <span>Payable:</span>
                                            <span className="amount-value">₹{amount}</span>
                                        </div>
                                        <div className="qr-container">
                                            <img src={qrUrl} alt="UPI QR" className="payment-qr" />
                                            <p className="qr-hint">Show this to Participant</p>
                                        </div>
                                        {isMobile && (
                                            <a href={upiLink} className="pay-now-btn">OPEN UPI APP</a>
                                        )}
                                    </div>

                                    <div className="payment-inputs">
                                        <div className="form-group">
                                            <label>12-Digit UPI Ref No.*</label>
                                            <input 
                                                name="transactionId" 
                                                value={formData.transactionId} 
                                                onChange={handleChange} 
                                                placeholder="Enter UTR / Ref ID"
                                                maxLength={12}
                                            />
                                            {errors.transactionId && <span className="error">{errors.transactionId}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label>Receipt Screenshot*</label>
                                            <div 
                                                className={`screenshot-upload ${formData.paymentScreenshot ? 'has-file' : ''}`}
                                                onClick={() => screenshotInputRef.current?.click()}
                                            >
                                                <input 
                                                    type="file" 
                                                    ref={screenshotInputRef} 
                                                    onChange={handleScreenshotChange} 
                                                    style={{ display: 'none' }}
                                                    accept="image/*"
                                                />
                                                {formData.paymentScreenshot ? `✓ ${formData.paymentScreenshot.name}` : 'Upload Verification Proof'}
                                            </div>
                                            {errors.paymentScreenshot && <span className="error">{errors.paymentScreenshot}</span>}
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="cash"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="cash-hint"
                                >
                                    <p>🛡️ Bypassing proof verification for Cash settlement.</p>
                                    <p>Recording as: <strong>₹{amount} Collective Cash</strong></p>
                                    <p style={{ opacity: 0.6, fontSize: '0.8rem' }}>Admin Witness: {auth.currentUser?.email}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="manual-form-actions">
                        <button type="button" className="cancel-btn" onClick={onSuccess}>CLOSE FORM</button>
                        <button type="submit" className="submit-btn" disabled={isSubmitting}>
                            {isSubmitting ? 'PROCESSING...' : 'SAVE REGISTRATION'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminManualEntry;
