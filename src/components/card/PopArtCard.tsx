import React from 'react';
import './PopArtCard.css';

interface PopArtCardProps {
  backgroundImage?: string;
  buttonText?: string;
  footerText?: string;
  backgroundColor?: string;
  onClick?: () => void;
  onButtonClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
  className?: string;
  animationDelay?: string;
}

const PopArtCard: React.FC<PopArtCardProps> = ({
  backgroundImage,
  buttonText = "REGISTER",
  footerText,
  backgroundColor = "#f0f0f0",
  onClick,
  onButtonClick,
  style,
  className = "",
  animationDelay
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    if (onButtonClick) {
      e.stopPropagation(); // Prevent triggering the card's onClick
      onButtonClick(e);
    }
  };

  return (
    <div 
      className={`pop-art-card ${className}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={footerText || buttonText}
      style={{ 
        backgroundColor: backgroundImage ? 'transparent' : backgroundColor,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        animationDelay,
        ...style 
      }}
    >
      <div className="pop-art-button" onClick={handleButtonClick}>
        {buttonText}
      </div>

      {footerText && (
        <div className="pop-art-footer-text">
          {footerText}
        </div>
      )}
    </div>
  );
};

export default PopArtCard;
