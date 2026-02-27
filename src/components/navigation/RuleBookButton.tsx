import React from 'react';
import { assetPath } from '../../utils/assetPath';
import './RuleBookButton.css';

const RuleBookButton: React.FC<{ className?: string }> = ({ className }) => {
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = '/Rulebook.pdf';
        link.download = 'Talentron_Rulebook_2026.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className={`rule-book-wrapper ${className || ''}`}>
            <button 
                onClick={handleDownload}
                className="rule-book-btn"
                type="button"
            >
                <span className="btn-icon">
                    <img src={assetPath('/assets/icons/downloads.png')} alt="icon" />
                </span>
                DOWNLOAD RULE BOOK
            </button>
        </div>
    );
};

export default RuleBookButton;
