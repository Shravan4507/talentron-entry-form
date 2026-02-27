import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useBlocker, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import OutlinedTitle from '../../components/heading/OutlinedTitle';
import SEO from '../../components/navigation/SEO';
import { assetPath } from '../../utils/assetPath';
import SearchableDropdown from '../../components/searchable-dropdown/SearchableDropdown';
import DatePicker from '../../components/date-picker/DatePicker';
import collegesData from '../../data/colleges.json';
import { db, storage, auth, googleProvider } from '../../lib/firebase';
import { collection, doc, setDoc, getDoc, updateDoc, serverTimestamp, query, where, getDocs, limit, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { getWelcomeEmailHtml } from '../../templates/welcomeEmail';
import './RegistrationForm.css';

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    cellPhone: string;
    whatsappNumber: string;
    dob: string;
    sex: string;
    collegeName: string;
    teamType: string;
    genre: string;
    paymentScreenshot: File | null;
    transactionId: string;
    groupSize: string;
    paymentType: 'Full';
    agreedToRules: boolean;
}

const UPI_ID = import.meta.env.VITE_UPI_ID || "your-upi-id@bank";



// Precise mapping based on user request
const getPerPersonPrice = (category: string, teamType: string): number => {
    if (category === 'Music') {
        if (teamType === 'Solo') return 200;
        if (teamType === 'Duet') return 150;
    }
    if (category === 'Dance') {
        if (teamType === 'Solo') return 200;
        if (teamType === 'Group') return 150;
    }
    if (category === 'Drama') return 100;
    if (category === 'Band') return 200;
    if (category === 'Street Play') return 100;
    return 0;
};

const RegistrationForm: React.FC = () => {
    const { category } = useParams<{ category: string }>();
    const navigate = useNavigate();
    
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        email: '',
        cellPhone: '+91 ',
        whatsappNumber: '+91 ',
        dob: '',
        sex: '',
        collegeName: '',
        teamType: '',
        genre: '',
        paymentScreenshot: null,
        transactionId: '',
        groupSize: '',
        paymentType: 'Full',
        agreedToRules: false
    });

    const [age, setAge] = useState<number | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [submissionProgress, setSubmissionProgress] = useState(0);
    const [submissionStage, setSubmissionStage] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const screenshotInputRef = useRef<HTMLInputElement>(null);

    // Navigation Guard (Dirty Form)
    const isDirty = formData.firstName !== '' || 
                    formData.lastName !== '' || 
                    formData.email !== '' || 
                    formData.cellPhone !== '+91 ' || 
                    formData.whatsappNumber !== '+91 ' || 
                    formData.collegeName !== '' || 
                    formData.transactionId !== '';

    useBlocker(({ nextLocation }) => {
        if (isDirty && !isSuccess && !isSubmitting && nextLocation.pathname !== location.pathname) {
            return !window.confirm("You have unsaved form data. Are you sure you want to leave this page?");
        }
        return false;
    });

    // Also handle browser-level refresh/back
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty && !isSuccess && !isSubmitting) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty, isSuccess, isSubmitting]);

    // Auth state observer
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            if (user && formData.email === '') {
                const [firstName, ...lastNameParts] = (user.displayName || '').split(' ');
                setFormData(prev => ({
                    ...prev,
                    firstName: firstName || '',
                    lastName: lastNameParts.join(' ') || '',
                    email: user.email || ''
                }));
            }
        });
        return () => unsubscribe();
    }, [formData.email]);

    const handleGoogleSignIn = async () => {
        setIsGoogleLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // 1. Preemptive Check: Is this email already in our database?
            setSubmissionStage('Verifying eligibility...');
            const q = query(collection(db, "registrations"), where("email", "==", user.email), limit(1));
            const snap = await getDocs(q);

            if (!snap.empty) {
                const data = snap.docs[0].data();
                const isSame = data.genre === category;
                
                // Immediately sign out to keep session clean
                await auth.signOut();
                
                if (isSame) {
                    alert(`This competition is already registered by you.`);
                } else {
                    alert(`LIMIT REACHED: You are already registered for "${data.genre}". According to Talentron Rules, a participant can only enter ONE competition.`);
                }
                
                // Reset form email to block progress
                setFormData(prev => ({ ...prev, email: '' }));
                setIsGoogleLoading(false);
                return;
            }

            // 2. Clear to proceed
            const [firstName, ...lastNameParts] = (user.displayName || '').split(' ');
            setFormData(prev => ({
                ...prev,
                firstName: firstName || '',
                lastName: lastNameParts.join(' ') || '',
                email: user.email || ''
            }));
            
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.email;
                return newErrors;
            });
        } catch (error) {
            console.error("Google Sign In Error:", error);
            alert("Failed to sign in with Google. Please try again.");
        } finally {
            setIsGoogleLoading(false);
        }
    };


    useEffect(() => {
        const checkMobile = () => {
            const ua = navigator.userAgent;
            setIsMobile(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua));
        };
        checkMobile();
    }, []);

    useEffect(() => {
        if (category) {
            setFormData(prev => ({ 
                ...prev, 
                genre: category,
                teamType: ['Drama', 'Band', 'Street Play'].includes(category) ? 'Group' : prev.teamType 
            }));
        }
    }, [category]);

    useEffect(() => {
        if (formData.dob && formData.dob.length === 10) {
            const [day, month, year] = formData.dob.split('/').map(Number);
            const birthDate = new Date(year, month - 1, day);
            const today = new Date();
            
            if (!isNaN(birthDate.getTime())) {
                let calculatedAge = today.getFullYear() - birthDate.getFullYear();
                const m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                    calculatedAge--;
                }
                setAge(calculatedAge >= 0 ? calculatedAge : null);
            }
        } else {
            setAge(null);
        }
    }, [formData.dob]);
    
    // Lock body scroll when overlay is active
    useEffect(() => {
        if (isSubmitting || isSuccess) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isSubmitting, isSuccess]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        // 1. Get ONLY the digits from the input
        let digits = value.replace(/\D/g, ''); 
        
        // 2. If it starts with '91', it's coming from the prefix or a paste
        // We strip it once to get the actual 10-digit number
        if (digits.startsWith('91')) {
            digits = digits.slice(2);
        } else if (digits.startsWith('0')) {
            // Also handle users who type a leading 0
            digits = digits.slice(1);
        }
        
        // 3. Limit to 10 digits max
        if (digits.length > 10) {
            digits = digits.slice(0, 10);
        }
        
        // 4. Always re-apply the uniform +91 format
        const formattedValue = '+91 ' + digits;
        setFormData(prev => ({ ...prev, [name]: formattedValue }));
    };


    const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, paymentScreenshot: e.target.files![0] }));
        }
    };

    const handleComposeEmail = () => {
        const recipient = "support@talentron.in";
        const subject = `Round 1 Video - ${formData.firstName} ${formData.lastName} - ${category}`;
        const body = `Hi Talentron Team,
 
 I am registering for the ${category} category (${formData.teamType}).
 
 I will be sending my Round 1 video/track for the online round.

Name: ${formData.firstName} ${formData.lastName}
Category: ${category}
Team Type: ${formData.teamType}

[Please attach your video or paste Drive link here]`;

        // Primary: Gmail Web Compose (Highly reliable for Chrome/Android users)
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // Secondary: Standard mailto (Fallback for other clients)
        const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body).replace(/\n/g, '%0D%0A')}`;

        // Attempt to open Gmail first in a new tab
        window.open(gmailUrl, '_blank');
        
        // Also trigger mailto as a fallback for those not logged into Gmail
        setTimeout(() => {
            window.location.href = mailtoUrl;
        }, 500);
    };

    const handleScreenshotDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFormData(prev => ({ ...prev, paymentScreenshot: e.dataTransfer.files[0] }));
        }
    };

    const validateEmail = (email: string) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const getRegistrationAmount = () => {
        if (!category) return 0;
        const perPerson = getPerPersonPrice(category, formData.teamType);
        
        let multiplier = 1;
        if (formData.teamType === 'Duet') multiplier = 2;
        if (formData.teamType === 'Group') multiplier = parseInt(formData.groupSize) || 0;
        
        return perPerson * multiplier;
    };

    const nextStep = () => {
        const newErrors: { [key: string]: string } = {};

        if (step === 1) {
            // Name validation
            if (!formData.firstName.trim() || formData.firstName.length < 2) {
                newErrors.firstName = "First name must be at least 2 characters.";
            } else if (!/^[A-Za-z\s]+$/.test(formData.firstName)) {
                newErrors.firstName = "First name should only contain letters.";
            }

            if (!formData.lastName.trim() || formData.lastName.length < 2) {
                newErrors.lastName = "Last name must be at least 2 characters.";
            } else if (!/^[A-Za-z\s]+$/.test(formData.lastName)) {
                newErrors.lastName = "Last name should only contain letters.";
            }

            // Email
            if (!validateEmail(formData.email)) {
                newErrors.email = "Please enter a valid email address.";
            }

            // Phone numbers - Robust digit extraction
            const phoneDigits = (formData.cellPhone.split('+91')[1] || '').replace(/\D/g, '');
            if (phoneDigits.length !== 10) {
                newErrors.cellPhone = "Please enter a valid 10-digit mobile number.";
            }

            const whatsappDigits = (formData.whatsappNumber.split('+91')[1] || '').replace(/\D/g, '');
            if (whatsappDigits.length !== 10) {
                newErrors.whatsappNumber = "Please enter a valid 10-digit WhatsApp number.";
            }

            // DOB and Age
            if (!formData.dob || formData.dob.length < 10) {
                newErrors.dob = "Please enter a valid Date of Birth.";
            } else if (age !== null && (age < 16 || age > 30)) {
                newErrors.dob = "Participant age must be between 16 and 30.";
            }

            // Sex
            if (!formData.sex) {
                newErrors.sex = "Please select your gender.";
            }

            // College
            if (!formData.collegeName) {
                newErrors.collegeName = "Please select or enter your college name.";
            }

            // Team Type & Group Size
            if (!formData.teamType) {
                newErrors.teamType = "Please select a team type.";
            } else if (formData.teamType === 'Group') {
                const limits = category === 'Dance' ? { min: 3, max: 14 } : (category === 'Street Play' ? { min: 8, max: 20 } : { min: 3, max: 20 });
                const size = parseInt(formData.groupSize);
                if (!formData.groupSize) {
                    newErrors.groupSize = "Please enter the number of members in your group.";
                } else if (isNaN(size) || size < limits.min || size > limits.max) {
                    newErrors.groupSize = `Total members for ${category === 'Street Play' ? 'Nukkad Natak' : category} must be between ${limits.min} and ${limits.max}.`;
                }
            }
        }

        if (step === 2) {
            // No blocking validation for email submission
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setStep(prev => prev + 1);
        window.scrollTo(0, 0);
    };

    const prevStep = () => {
        setStep(prev => prev - 1);
        window.scrollTo(0, 0);
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: { [key: string]: string } = {};

        if (amount > 0 && !formData.paymentScreenshot) {
            newErrors.paymentScreenshot = "Please upload payment screenshot.";
            alert('Please upload a screenshot of your payment for verification.');
        } else if (formData.paymentScreenshot) {
            if (formData.paymentScreenshot.size > 1024 * 1024) { // 1MB
                newErrors.paymentScreenshot = "Screenshot must be less than 1MB. Please compress your image.";
            }
        }

        if (!formData.transactionId || formData.transactionId.length !== 12) {
            newErrors.transactionId = "Transaction ID must be exactly 12 digits.";
        }

        if (!formData.agreedToRules) {
            newErrors.agreedToRules = "Mandatory: Please accept the rules and privacy policy.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);
        setSubmissionProgress(10);
        setSubmissionStage('Preparing secure upload...');
        setErrors({});

        const sessionId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        try {
            // 0. Pre-submission checks (Duplicates & Malpractice)
            setSubmissionStage('Verifying registration uniqueness...');
            
            // Comprehensive Email Check (Only 1 registration allowed total)
            const emailRef = collection(db, "registrations");
            const emailAnyQ = query(emailRef, where("email", "==", formData.email), limit(1));
            const emailSnap = await getDocs(emailAnyQ);
            
            if (!emailSnap.empty) {
                const existingDoc = emailSnap.docs[0].data();
                const isSameGenre = existingDoc.genre === formData.genre;
                
                setIsSubmitting(false);
                setSubmissionStage('');
                setSubmissionProgress(0);
                
                if (isSameGenre) {
                    alert(`MALPRACTICE DETECTED: This competition ("${formData.genre}") is already registered by you. If you believe this is an error, please contact our management team.`);
                    setErrors({ email: `Already registered for ${formData.genre}.` });
                } else {
                    alert(`LIMIT EXCEEDED: You can only participate in one competition at Talentron '26. You are already registered for "${existingDoc.genre}". If you wish to switch, please contact our management team.`);
                    setErrors({ email: `Already registered for ${existingDoc.genre}. (Only 1 entry allowed)` });
                }
                return;
            }

            // 0a. Check for recent submission (Spam Protection)
            const lastSub = sessionStorage.getItem('last_submission_time');
            if (lastSub && Date.now() - parseInt(lastSub) < 60000) { // 1 minute cooldown
                setIsSubmitting(false);
                alert("Please wait 1 minute before submitting again.");
                return;
            }

            // 0a. Duplicate Check (One email per Genre)
            setSubmissionStage('Verifying previous entries...');
            const qDup = query(
                collection(db, "registrations"), 
                where("email", "==", formData.email),
                where("genre", "==", formData.genre),
                limit(1)
            );
            const dupSnap = await getDocs(qDup);
            if (!dupSnap.empty) {
                const existing = dupSnap.docs[0].data();
                if (existing.status !== 'rejected') { 
                    setIsSubmitting(false);
                    alert(`You are already registered for ${formData.genre}! Please check your email for the confirmation.`);
                    return;
                }
            }

            // 0b. ATOMIC LOCK for Transaction ID (Race Condition Fix)
            setSubmissionStage('Securing transaction lock...');
            const lockRef = doc(db, "transaction_locks", formData.transactionId);
            const lockSnap = await getDoc(lockRef);
            
            if (lockSnap.exists()) {
                setIsSubmitting(false);
                setSubmissionStage('');
                setSubmissionProgress(0);
                alert("MALPRACTICE DETECTED: This Transaction ID has already been used. If you believe this is an error, please contact our management team.");
                setErrors({ transactionId: "This Transaction ID is already registered." });
                return;
            }

            // Create the lock record immediately
            try {
                await setDoc(lockRef, { 
                    email: formData.email, 
                    lockedAt: serverTimestamp() 
                });
            } catch (err) {
                // If this fails, someone else just created it between our check and write
                setIsSubmitting(false);
                alert("Transaction ID already in use. Please check and try again.");
                return;
            }

            // 1. Save INITIAL Registration Data to Firestore (Draft State)
            // We save this first so if the screenshot upload fails, we still have their info.
            setSubmissionStage('Recording registration data...');
            setSubmissionProgress(40);

            const regDocRef = doc(db, "registrations", sessionId);
            const registrationData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                cellPhone: formData.cellPhone,
                whatsappNumber: formData.whatsappNumber,
                dob: formData.dob,
                sex: formData.sex,
                collegeName: formData.collegeName,
                teamType: formData.teamType,
                genre: formData.genre,
                groupSize: formData.teamType === 'Group' ? formData.groupSize : (formData.teamType === 'Duet' ? '2' : '1'),
                transactionId: formData.transactionId,
                totalActualAmount: getRegistrationAmount(),
                sessionId: sessionId,
                status: 'payment_upload_pending', // Intermediate status
                submittedAt: serverTimestamp()
            };

            await setDoc(regDocRef, registrationData);

            let screenshotURL = "";

            // 2. Upload Screenshot to Firebase Storage
            if (formData.paymentScreenshot) {
                setSubmissionStage('Uploading payment receipt...');
                setSubmissionProgress(60);
                
                const fileExtension = formData.paymentScreenshot.name.split('.').pop();
                const fileName = `payments/${formData.transactionId}_${Date.now()}.${fileExtension}`;
                const storageRef = ref(storage, fileName);
                
                try {
                    const uploadResult = await uploadBytes(storageRef, formData.paymentScreenshot);
                    screenshotURL = await getDownloadURL(uploadResult.ref);
                } catch (uploadErr) {
                    console.error("Screenshot upload failed:", uploadErr);
                    setSubmissionStage('Upload failed! Retrying...');
                    // We don't crash here yet, we keep the doc in 'payment_upload_pending'
                    throw new Error("Screenshot upload failed. Your data is saved, but please contact admin to provide proof.");
                }
            }

            // 3. Finalize Registration Status
            setSubmissionStage('Finalizing entry...');
            setSubmissionProgress(90);

            await updateDoc(regDocRef, {
                screenshotURL: screenshotURL,
                screenshotFileName: formData.paymentScreenshot ? formData.paymentScreenshot.name : '',
                status: 'pending' // Final status for admin review
            });

            // 4. Trigger Confirmation Email via Extension (Local HTML approach)
            try {
                const emailHtml = getWelcomeEmailHtml(
                    formData.firstName,
                    formData.genre,
                    formData.teamType,
                    formData.transactionId,
                    amount
                );

                await addDoc(collection(db, "mail"), {
                    to: formData.email,
                    message: {
                        subject: `Registration Received - ${formData.firstName} | Talentron '26`,
                        html: emailHtml
                    }
                });
            } catch (mailErr) {
                console.error("Mail trigger failed:", mailErr);
                // We don't block the UI for email failures, registration is still valid
            }
            
            sessionStorage.setItem('last_submission_time', Date.now().toString());
            setSubmissionProgress(100);
            setSubmissionStage('Registration Complete!');

            setTimeout(() => {
                setIsSubmitting(false);
                setIsSuccess(true);
                window.scrollTo(0, 0);
                // Clear the rest of the form but KEEP the firstName and genre for the success card
                setFormData(prev => ({
                    ...prev,
                    email: '',
                    cellPhone: '+91 ',
                    whatsappNumber: '+91 ',
                    dob: '',
                    collegeName: '',
                    transactionId: '',
                    paymentScreenshot: null,
                    agreedToRules: false
                }));
                // We don't reset the step to 1 here, we let the Success Overlay handle the view
            }, 800);
        } catch (error) {
            console.error('Firebase Submission error:', error);
            alert('There was an error connecting to our database. Please check your internet and try again.');
            setIsSubmitting(false);
        } finally {
            setSubmissionProgress(0);
            setSubmissionStage('');
        }
    };

    const handleSuccessClose = async () => {
        // 1. Clear all cookies
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        }

        // 2. Clear local auth state/session
        try {
            await auth.signOut();
        } catch (err) {
            console.error("Sign out error:", err);
        }

        setIsSuccess(false);
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            cellPhone: '+91 ',
            whatsappNumber: '+91 ',
            dob: '',
            sex: '',
            collegeName: '',
            teamType: category === 'Music' ? 'Solo' : (['Drama', 'Band', 'Street Play'].includes(category || '') ? 'Group' : 'Solo'),
            genre: category || '',
            paymentScreenshot: null,
            transactionId: '',
            groupSize: category === 'Dance' ? '3' : (category === 'Street Play' ? '8' : '3'),
            paymentType: 'Full',
            agreedToRules: false
        });
        setStep(1);
        navigate('/');
    };

    const amount = getRegistrationAmount();
    const upiLink = `upi://pay?pa=${UPI_ID}&pn=Talentron&am=${amount}&cu=INR&tn=Reg_${category}_${formData.firstName}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiLink)}`;

    return (
        <div className="registration-page">
            <SEO 
                title={`Register for ${category} - Step ${step}`}
                description={`Step ${step} of the official entry form for ${category} at Talentron '26.`}
            />

            <div className="form-header">
                <OutlinedTitle 
                    text="REGISTRATION" 
                    fillColor="linear-gradient(180deg, #00d1ff 0%, #0047ff 100%)" 
                    outlineColor="#000000" 
                    shadowColor="#000000"
                    className="small"
                />
                <div className="stepper">
                    <div className={`step-dot ${step >= 1 ? 'active' : ''}`}>1</div>
                    <div className="step-line"></div>
                    <div className={`step-dot ${step >= 2 ? 'active' : ''}`}>2</div>
                    <div className="step-line"></div>
                    <div className={`step-dot ${step >= 3 ? 'active' : ''}`}>3</div>
                </div>
                <p className="category-label">Category: {category} | Step {step} of 3</p>
            </div>

            <div className="registration-container">
                {step === 1 && (
                    <div className="form-step">
                        <div className="form-grid">
                            <div className="form-group">
                                <label>First Name*</label>
                                <input 
                                    type="text" 
                                    name="firstName" 
                                    value={formData.firstName} 
                                    onChange={handleChange} 
                                    required 
                                    placeholder="Enter your First Name"
                                />
                                {errors.firstName && <span className="field-error">{errors.firstName}</span>}
                            </div>
                            <div className="form-group">
                                <label>Last Name*</label>
                                <input 
                                    type="text" 
                                    name="lastName" 
                                    value={formData.lastName} 
                                    onChange={handleChange} 
                                    required 
                                    placeholder="Enter your Last Name"
                                />
                                {errors.lastName && <span className="field-error">{errors.lastName}</span>}
                            </div>
                            <div className="form-group full-width">
                                <label>Email Address*</label>
                                <div className={`email-input-wrapper ${currentUser ? 'authenticated' : ''}`}>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        value={formData.email} 
                                        onChange={handleChange} 
                                        required 
                                        placeholder="Click 'G' to verify Email"
                                        readOnly
                                        onClick={() => !currentUser && handleGoogleSignIn()}
                                    />
                                    {!currentUser && (
                                        <button 
                                            type="button" 
                                            className="google-auth-btn" 
                                            onClick={handleGoogleSignIn}
                                            disabled={isGoogleLoading}
                                            title="Sign in with Google"
                                        >
                                            {isGoogleLoading ? (
                                                <div className="mini-spinner"></div>
                                            ) : (
                                                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="google-icon" />
                                            )}
                                        </button>
                                    )}
                                </div>
                                {errors.email && (
                                    <div className="malpractice-error">
                                        <span className="field-error">{errors.email}</span>
                                        <p className="contact-hint">If this is a genuine registration, <Link to="/contact">contact management</Link>.</p>
                                    </div>
                                )}
                                {currentUser && <p className="input-hint success-text">Verified via Google</p>}
                            </div>
                            <div className="form-group">
                                <label>Cell Phone*</label>
                                <input 
                                    type="tel" 
                                    name="cellPhone" 
                                    value={formData.cellPhone} 
                                    onChange={handlePhoneChange} 
                                    required 
                                />
                                {errors.cellPhone && <span className="field-error">{errors.cellPhone}</span>}
                            </div>
                            <div className="form-group">
                                <label>WhatsApp Number*</label>
                                <input 
                                    type="tel" 
                                    name="whatsappNumber" 
                                    value={formData.whatsappNumber} 
                                    onChange={handlePhoneChange} 
                                    required 
                                    placeholder="Enter your WhatsApp Number"
                                />
                                {errors.whatsappNumber && <span className="field-error">{errors.whatsappNumber}</span>}
                            </div>
                            <div className="form-group">
                                <DatePicker 
                                    label={`Date of Birth* ${age !== null ? `(Age: ${age})` : ''}`}
                                    value={formData.dob}
                                    onChange={(val) => setFormData(prev => ({ ...prev, dob: val }))}
                                    required
                                />
                                {errors.dob && <span className="field-error">{errors.dob}</span>}
                            </div>
                            <div className="form-group">
                                <SearchableDropdown 
                                    label="Sex*"
                                    options={['Male', 'Female', 'Other']}
                                    value={formData.sex}
                                    onChange={(val) => setFormData(prev => ({ ...prev, sex: val }))}
                                    placeholder="Select Gender"
                                    required
                                    allowManual={false}
                                />
                                {errors.sex && <span className="field-error">{errors.sex}</span>}
                            </div>
                            <div className="form-group full-width">
                                <SearchableDropdown 
                                    label="College Name*"
                                    options={collegesData}
                                    value={formData.collegeName}
                                    onChange={(val) => setFormData(prev => ({ ...prev, collegeName: val }))}
                                    placeholder="Search or enter your college"
                                    required
                                />
                                {errors.collegeName && <span className="field-error">{errors.collegeName}</span>}
                            </div>
                            <div className="form-group full-width">
                                <SearchableDropdown 
                                    label="Team*"
                                    options={category === 'Music' ? ['Solo', 'Duet'] : ['Solo', 'Group']}
                                    value={formData.teamType}
                                    onChange={(val) => setFormData(prev => ({ ...prev, teamType: val }))}
                                    placeholder="Select Team Type"
                                    required
                                    readOnly={category ? ['Drama', 'Band', 'Street Play'].includes(category) : false}
                                    allowManual={false}
                                />
                                {errors.teamType && <span className="field-error">{errors.teamType}</span>}
                                {formData.teamType !== 'Solo' && (
                                    <p className="group-note">
                                        <strong>Note:</strong> You will be required to provide full details for all your teammates ({formData.teamType === 'Duet' ? '1 partner' : 'all members'}) at the time of Round 1.
                                    </p>
                                )}
                            </div>

                            {formData.teamType === 'Group' && (
                                <div className="form-group full-width">
                                    <label>Total Team Members (Including Leader)*</label>
                                    <input 
                                        type="number" 
                                        name="groupSize"
                                        value={formData.groupSize}
                                        onChange={handleChange}
                                        placeholder="Enter total number of participants"
                                        min={category === 'Dance' ? "3" : (category === 'Street Play' ? "8" : "3")}
                                        max={category === 'Dance' ? "14" : (category === 'Street Play' ? "20" : "20")}
                                        required
                                    />
                                    {errors.groupSize && <span className="field-error">{errors.groupSize}</span>}
                                    <p className="input-hint">
                                        {category === 'Dance' ? "Team size: 3 to 14 " : (category === 'Street Play' ? "Team size: 8 to 20 " : "Specify the exact count of ")}
                                        members in your group (including leader).
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="form-footer">
                            <button type="button" className="submit-btn" onClick={nextStep}>CONTINUE TO NEXT STEP</button>
                            <button type="button" className="back-btn" onClick={() => navigate('/competitions')}>← BACK TO COMPETITIONS</button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="form-step">
                        <div className="email-submission-section">
                            <h2 className="step-title">Step 2: {['Street Play', 'Band'].includes(category || '') ? 'Round 1' : 'Performance Track'} Submission</h2>
                            <div className="email-card">
                                <div className="email-icon">
                                    <img src={assetPath('/assets/icons/send.png')} alt="Send" />
                                </div>
                                <h3>Send your {['Street Play', 'Band'].includes(category || '') ? 'Round 1' : 'Performance Track'} via Email</h3>
                                
                                <div className="email-instructions">
                                    <ul>
                                        <li><strong>Format:</strong> Drive Link or Attachment</li>
                                        <li><strong>Email:</strong> support@talentron.in</li>
                                    </ul>
                                </div>

                                <button 
                                    type="button"
                                    onClick={handleComposeEmail}
                                    className="compose-email-btn"
                                >
                                    COMPOSE {['Street Play', 'Band'].includes(category || '') ? 'ROUND 1' : 'TRACK'} EMAIL
                                </button>
                                
                                <p className="email-note">
                                    Click the button above to auto-draft your submission email. You can also do this after completing the registration.
                                </p>
                            </div>
                        </div>
                        <div className="form-footer">
                            <button type="button" className="submit-btn" onClick={nextStep}>CONTINUE TO PAYMENT</button>
                            <button type="button" className="back-btn" onClick={prevStep}>GO BACK</button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="form-step">
                        <div className="payment-section">
                            <h2 className="step-title">Final Step: Payment</h2>
                            


                            <div className="amount-card">
                                <span>Total Amount:</span>
                                <span className="amount-value">₹{getRegistrationAmount()}</span>
                            </div>

                            <div className="payment-methods">
                                <div className="qr-container">
                                    <img src={qrUrl} alt="Payment QR Code" className="payment-qr" />
                                    <p className="qr-hint">Scan this QR to pay directly</p>
                                </div>

                                <div className="payment-cta">
                                    {isMobile ? (
                                        <a href={upiLink} className="pay-now-btn">PAY NOW VIA UPI APP</a>
                                    ) : (
                                        <div className="pay-now-disabled">
                                            PAY NOW (Only available on Phones)
                                        </div>
                                    )}
                                    <p className="upi-id-copy">Secure Payment via UPI</p>
                                </div>
                            </div>

                            <div className="transaction-form">
                                <div className="form-group full-width">
                                    <label>Payment Screenshot*</label>
                                    <div 
                                        className={`dropzone mini ${formData.paymentScreenshot ? 'has-file' : ''}`}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={handleScreenshotDrop}
                                        onClick={() => screenshotInputRef.current?.click()}
                                    >
                                        <input 
                                            type="file" 
                                            ref={screenshotInputRef} 
                                            style={{ display: 'none' }} 
                                            onChange={handleScreenshotChange}
                                            accept="image/*"
                                        />
                                        <div className="dropzone-content">
                                            <span>{formData.paymentScreenshot ? `✓ ${formData.paymentScreenshot.name}` : 'Upload Screenshot / Receipt'}</span>
                                        </div>
                                    </div>
                                    {errors.paymentScreenshot && (
                                        <div className="malpractice-error center">
                                            <span className="field-error">{errors.paymentScreenshot}</span>
                                            <p className="contact-hint">If this is a genuine proof, <Link to="/contact">contact management</Link>.</p>
                                        </div>
                                    )}
                                </div>

                                <div className="form-group full-width">
                                    <label>12 Digit UPI Transaction ID*</label>
                                    <input 
                                        type="text" 
                                        maxLength={12} 
                                        name="transactionId"
                                        value={formData.transactionId}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '');
                                            setFormData(prev => ({ ...prev, transactionId: val }));
                                        }}
                                        placeholder="e.g. 123456789012"
                                        className="transaction-input"
                                        required
                                    />
                                    {errors.transactionId && (
                                        <div className="malpractice-error">
                                            <span className="field-error">{errors.transactionId}</span>
                                            <p className="contact-hint">If this is a genuine payment, <Link to="/contact">contact management</Link>.</p>
                                        </div>
                                    )}
                                    <p className="input-hint">Enter the 12-digit Ref No. / Transaction ID from your payment app.</p>

                                    <div className="rules-agreement-checkbox">
                                        <label className="checkbox-container">
                                            <input 
                                                type="checkbox" 
                                                checked={formData.agreedToRules}
                                                onChange={(e) => setFormData(prev => ({ ...prev, agreedToRules: e.target.checked }))}
                                            />
                                            <span className="checkbox-text">
                                                I have read and agree to all the <a href="/rules" target="_blank" rel="noopener noreferrer">General Rules</a>, <a href={`/competitions/${category}`} target="_blank" rel="noopener noreferrer">Competition-specific Rules</a>, and <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> & <a href="/terms-of-service" target="_blank" rel="noopener noreferrer">Terms & Conditions</a>.*
                                            </span>
                                        </label>
                                        {errors.agreedToRules && <span className="field-error">{errors.agreedToRules}</span>}
                                    </div>
                                    <div className="verification-warning">
                                        <strong>⚠️ VERIFICATION NOTICE:</strong> Every Transaction ID is manually verified against our bank statement. Entry of a false or reused ID will lead to <strong>immediate disqualification</strong> and blacklisting from all future Talentron events.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="form-footer">
                            <button 
                                type="button" 
                                className="submit-btn" 
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'SUBMITTING...' : 'COMPLETE REGISTRATION'}
                            </button>
                            <button type="button" className="back-btn" onClick={prevStep} disabled={isSubmitting}>GO BACK</button>
                        </div>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {isSubmitting && (
                    <motion.div 
                        className="submission-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="overlay-content">
                            <div className="minimal-loader">
                                <svg viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5"/>
                                    <motion.circle 
                                        cx="50" cy="50" r="45" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: submissionProgress / 100 }}
                                        transition={{ duration: 0.5, ease: "easeInOut" }}
                                    />
                                </svg>
                                <div className="loader-text">{submissionProgress}%</div>
                            </div>
                            <motion.p 
                                key={submissionStage}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="progress-stage"
                            >
                                {submissionStage}
                            </motion.p>
                            <p className="progress-disclaim">Securing your entry...</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isSuccess && (
                    <motion.div 
                        className="success-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div 
                            className="minimal-success-card"
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        >
                            <div className="success-badge">
                                <svg viewBox="0 0 52 52">
                                    <motion.circle 
                                        cx="26" cy="26" r="25" fill="none" stroke="#00ff88" strokeWidth="2"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 0.6 }}
                                    />
                                    <motion.path 
                                        fill="none" stroke="#00ff88" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" 
                                        d="M14.1 27.2l7.1 7.2 16.7-16.8"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 0.4, delay: 0.5 }}
                                    />
                                </svg>
                            </div>
                            <h2 className="minimal-success-title">Success, {formData.firstName}!</h2>
                            <p className="minimal-success-desc">
                                We've received your registration for <strong>{formData.genre}</strong>. 
                                A confirmation will be sent after payment verification.
                            </p>
                            <div className="success-footer">
                                <button className="minimal-home-btn" onClick={handleSuccessClose}>
                                    CONTINUE
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RegistrationForm;
