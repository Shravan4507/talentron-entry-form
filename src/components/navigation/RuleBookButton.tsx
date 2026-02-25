import React from 'react';
import { assetPath } from '../../utils/assetPath';
import './RuleBookButton.css';

const RuleBookButton: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <a 
            href={assetPath('/rule-book-talentron.pdf')} 
            download="rule-book-talentron.pdf"
            className={`rule-book-btn ${className || ''}`}
        >
            <span className="btn-icon">📄</span>
            DOWNLOAD RULE BOOK
        </a>
    );
};

export default RuleBookButton;
