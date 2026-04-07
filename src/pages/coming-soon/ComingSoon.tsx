import React from 'react';
import { motion } from 'framer-motion';
import './ComingSoon.css';

const ComingSoon: React.FC = () => {
    return (
        <div className="coming-soon-container">
            <motion.div 
                className="coming-soon-content"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <motion.div 
                    className="logo-container"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    <img 
                        src="/assets/logos/Logo_Talentron_1.webp" 
                        alt="Talentron Logo" 
                        className="coming-soon-logo"
                    />
                </motion.div>

                
                <motion.h1 
                    className="title"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                >
                    The Event is Over
                </motion.h1>
                
                <motion.div 
                    className="message-box"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                >
                    <p className="thank-you-msg">
                        Thank you for being part of this incredible journey! 
                        Your participation made Talentron a huge success.
                    </p>
                    <p className="announcement">
                        A newer version of this portal with some 
                        <span className="highlight"> immersive experiences </span> 
                        will be arriving next year. Stay tuned!
                    </p>
                </motion.div>

                <motion.div 
                    className="footer-link"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 1 }}
                >
                    <p>Relive the moments @zeal_talentron</p>
                </motion.div>
            </motion.div>

            {/* Decorative Elements */}
            <div className="blob-1"></div>
            <div className="blob-2"></div>
        </div>
    );
};

export default ComingSoon;
