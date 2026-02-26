import React from 'react';
import './CardSkeleton.css';

const CardSkeleton: React.FC = () => {
    return (
        <div className="card-skeleton">
            <div className="skeleton-shine" />
            <div className="skeleton-btn" />
            <div className="skeleton-text" />
        </div>
    );
};

export default CardSkeleton;
