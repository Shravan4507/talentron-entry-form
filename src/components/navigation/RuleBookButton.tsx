import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { assetPath } from '../../utils/assetPath';
import './RuleBookButton.css';

const RuleBookButton: React.FC<{ className?: string }> = ({ className }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 2000);
    };

    return (
        <div className={`rule-book-wrapper ${className || ''}`}>
            <button 
                onClick={handleClick}
                className="rule-book-btn"
                type="button"
            >
                <span className="btn-icon">
                    <img src={assetPath('/assets/icons/send.png')} alt="icon" />
                </span>
                DOWNLOAD RULE BOOK
            </button>
            
            <AnimatePresence>
                {showTooltip && (
                    <motion.div 
                        className="coming-soon-tooltip"
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.9 }}
                    >
                        Rule Book Coming Soon...
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RuleBookButton;
