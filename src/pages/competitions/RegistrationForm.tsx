import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OutlinedTitle from '../../components/heading/OutlinedTitle';
import SEO from '../../components/navigation/SEO';
import SearchableDropdown from '../../components/searchable-dropdown/SearchableDropdown';
import DatePicker from '../../components/date-picker/DatePicker';
import collegesData from '../../data/colleges.json';
import './RegistrationForm.css';

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    cellPhone: string;
    whatsappNumber: string;
    dob: string;
    collegeName: string;
    teamType: string;
    genre: string;
    trackFile: File | null;
    paymentScreenshot: File | null;
    transactionId: string;
}

const UPI_ID = import.meta.env.VITE_UPI_ID || "shravan45x@pingpay";
const SCRIPT_URL = import.meta.env.VITE_SCRIPT_URL || "";

const PRICING: { [key: string]: { solo: number, group: number } } = {
    'Music': { solo: 150, group: 600 },
    'Dance': { solo: 150, group: 700 },
    'Drama': { solo: 0, group: 900 },
    'Band': { solo: 0, group: 1200 },
    'Street Play': { solo: 0, group: 800 }
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
        collegeName: '',
        teamType: '',
        genre: '',
        trackFile: null,
        paymentScreenshot: null,
        transactionId: ''
    });

    const [age, setAge] = useState<number | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [submissionProgress, setSubmissionProgress] = useState(0);
    const [submissionStage, setSubmissionStage] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const fileInputRef = useRef<HTMLInputElement>(null);
    const screenshotInputRef = useRef<HTMLInputElement>(null);

    const fixedGroupCategories = ['Drama', 'Band', 'Street Play'];

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
                teamType: fixedGroupCategories.includes(category) ? 'Group' : prev.teamType 
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, trackFile: e.target.files![0] }));
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFormData(prev => ({ ...prev, trackFile: e.dataTransfer.files[0] }));
        }
    };

    const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, paymentScreenshot: e.target.files![0] }));
        }
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
        const priceObj = PRICING[category];
        if (!priceObj) return 0;
        return formData.teamType === 'Solo' ? priceObj.solo : priceObj.group;
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

            // Phone numbers
            const phoneDigits = formData.cellPhone.replace('+91 ', '');
            if (phoneDigits.length !== 10) {
                newErrors.cellPhone = "Please enter a valid 10-digit mobile number.";
            }

            const whatsappDigits = formData.whatsappNumber.replace('+91 ', '');
            if (whatsappDigits.length !== 10) {
                newErrors.whatsappNumber = "Please enter a valid 10-digit WhatsApp number.";
            }

            // DOB and Age
            if (!formData.dob || formData.dob.length < 10) {
                newErrors.dob = "Please enter a valid Date of Birth.";
            } else if (age !== null && (age < 16 || age > 35)) {
                newErrors.dob = "Participant age must be between 16 and 35.";
            }

            // College
            if (!formData.collegeName) {
                newErrors.collegeName = "Please select or enter your college name.";
            }

            // Team Type
            if (!formData.teamType) {
                newErrors.teamType = "Please select a team type.";
            }
        }

        if (step === 2) {
            if (formData.trackFile) {
                const maxSize = 50 * 1024 * 1024; // 50MB
                if (formData.trackFile.size > maxSize) {
                    newErrors.trackFile = "File size exceeds 50MB limit.";
                }
            }
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

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64String = (reader.result as string).split(',')[1];
                resolve(base64String);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: { [key: string]: string } = {};

        if (amount > 0 && !formData.paymentScreenshot) {
            newErrors.paymentScreenshot = "Please upload payment screenshot.";
            alert('Please upload a screenshot of your payment for verification.');
        } else if (formData.paymentScreenshot) {
            if (formData.paymentScreenshot.size > 5 * 1024 * 1024) { // 5MB
                newErrors.paymentScreenshot = "Screenshot must be less than 5MB.";
            }
        }

        if (!formData.transactionId || formData.transactionId.length !== 12) {
            newErrors.transactionId = "Transaction ID must be exactly 12 digits.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);
        
        if (!SCRIPT_URL) {
            console.error('CRITICAL: VITE_SCRIPT_URL is not defined in environment variables.');
            alert('Configuration Error: Backend URL (VITE_SCRIPT_URL) is missing in Vercel. Please add it and redeploy.');
            setIsSubmitting(false);
            return;
        }

        setSubmissionProgress(10);
        setSubmissionStage('Preparing data...');
        setErrors({});

        try {

            const payload: any = { ...formData };
            
            if (formData.trackFile) {
                setSubmissionStage('Encoding performance track...');
                setSubmissionProgress(30);
                payload.trackFile = {
                    base64: await fileToBase64(formData.trackFile),
                    type: formData.trackFile.type,
                    name: formData.trackFile.name
                };
            }

            if (formData.paymentScreenshot) {
                setSubmissionStage('Encoding payment details...');
                setSubmissionProgress(50);
                payload.paymentScreenshot = {
                    base64: await fileToBase64(formData.paymentScreenshot),
                    type: formData.paymentScreenshot.type,
                    name: formData.paymentScreenshot.name
                };
            }

            setSubmissionStage('Uploading to server...');
            setSubmissionProgress(70);

            // Simulate smooth progress while waiting for fetch
            const progressInterval = setInterval(() => {
                setSubmissionProgress(prev => (prev < 90 ? prev + 1 : prev));
            }, 500);

            await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify(payload),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            clearInterval(progressInterval);
            setSubmissionProgress(100);
            setSubmissionStage('Registration Complete!');

            setTimeout(() => {
                setIsSubmitting(false);
                setIsSuccess(true);
            }, 800);
        } catch (error) {
            console.error('Submission error:', error);
            alert('There was an error submitting your registration. Please try again.');
            setIsSubmitting(false);
        } finally {
            setSubmissionProgress(0);
            setSubmissionStage('');
        }
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
                                <input 
                                    type="email" 
                                    name="email" 
                                    value={formData.email} 
                                    onChange={handleChange} 
                                    required 
                                    placeholder="Enter your Email Address"
                                />
                                {errors.email && <span className="field-error">{errors.email}</span>}
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
                                    options={['Solo', 'Group']}
                                    value={formData.teamType}
                                    onChange={(val) => setFormData(prev => ({ ...prev, teamType: val }))}
                                    placeholder="Select Team Type"
                                    required
                                    readOnly={category ? fixedGroupCategories.includes(category) : false}
                                    allowManual={false}
                                />
                                {errors.teamType && <span className="field-error">{errors.teamType}</span>}
                                {formData.teamType === 'Group' && (
                                    <p className="group-note">
                                        <strong>Note:</strong> You will be required to provide full details for all team members at the time of the audition.
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="form-footer">
                            <button type="button" className="submit-btn" onClick={nextStep}>CONTINUE TO NEXT STEP</button>
                            <button type="button" className="back-btn" onClick={() => navigate('/competitions')}>← BACK TO COMPETITIONS</button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="form-step">
                        <div className="upload-section">
                            <h2 className="step-title">Upload your Track (Optional)</h2>
                            <p className="step-desc">If you have a backing track or any audio/video material for your performance, please upload it here.</p>
                            
                            <div 
                                className={`dropzone ${formData.trackFile ? 'has-file' : ''}`}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    style={{ display: 'none' }} 
                                    onChange={handleFileChange}
                                    accept="audio/*,video/*"
                                />
                                <div className="dropzone-content">
                                    <div className="upload-icon">
                                        {formData.trackFile ? '✓' : '↑'}
                                    </div>
                                    <h3>{formData.trackFile ? formData.trackFile.name : 'Drag & Drop File Here'}</h3>
                                    <p>{formData.trackFile ? `${(formData.trackFile.size / (1024 * 1024)).toFixed(2)} MB` : 'or Click to Browse'}</p>
                                </div>
                            </div>
                            <p className="file-formats">Supported formats: MP3, WAV, MP4, MOV, etc.</p>
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
                                <span>Registration Amount:</span>
                                <span className="amount-value">₹{amount}</span>
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
                                    <p className="upi-id-copy">UPI ID: <strong>{UPI_ID}</strong></p>
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
                                    {errors.paymentScreenshot && <span className="field-error">{errors.paymentScreenshot}</span>}
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
                                    {errors.transactionId && <span className="field-error">{errors.transactionId}</span>}
                                    <p className="input-hint">Enter the 12-digit Ref No. / Transaction ID from your payment app.</p>
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

            {isSubmitting && (
                <div className="submission-overlay">
                    <div className="overlay-content">
                        <div className="progress-value">{submissionProgress}%</div>
                        <div className="progress-bar-container">
                            <div 
                                className="progress-bar-fill" 
                                style={{ width: `${submissionProgress}%` }}
                            ></div>
                        </div>
                        <p className="progress-stage">{submissionStage}</p>
                        <p className="progress-disclaim">Please do not close or refresh this page.</p>
                    </div>
                </div>
            )}

            {isSuccess && (
                <div className="success-overlay">
                    <div className="success-card">
                        <div className="success-icon">🎉</div>
                        <h2>REGISTRATION SUCCESSFUL!</h2>
                        <p className="success-name">Thanks, {formData.firstName}!</p>
                        <p className="success-msg">
                            Your application for <strong>{formData.genre}</strong> has been received. 
                            Our team will verify your payment (Transaction: {formData.transactionId}) 
                            and you will receive an update soon.
                        </p>
                        <button className="home-btn" onClick={() => navigate('/')}>
                            BACK TO HOME
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RegistrationForm;
