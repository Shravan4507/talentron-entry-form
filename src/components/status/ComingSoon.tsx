import React from 'react';
import { motion } from 'framer-motion';
import { assetPath } from '../../utils/assetPath';
import './ComingSoon.css';

interface ComingSoonProps {
  title?: string;
  subtitle?: string;
  image?: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ 
  title = "COMING SOON", 
  subtitle = "The stage is being set. Stay tuned for updates!",
  image = "/assets/logos/the_stage_is_yours.webp"
}) => {
  return (
    <div className="coming-soon-container">
      <motion.div 
        className="coming-soon-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="coming-soon-badge">
          <motion.span 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            ✦ NEW ✦
          </motion.span>
        </div>

        <div className="coming-soon-visual">
          <img src={assetPath(image)} alt="Coming Soon" className="cs-image" />
          <div className="cs-glow-orb"></div>
        </div>

        <h2 className="cs-title">{title}</h2>
        <p className="cs-subtitle">{subtitle}</p>

        <div className="cs-ticker-container">
          <div className="cs-ticker">
            <span>STAY TUNED • STAY TUNED • STAY TUNED • STAY TUNED • STAY TUNED • STAY TUNED • STAY TUNED • STAY TUNED • STAY TUNED • </span>
            <span>STAY TUNED • STAY TUNED • STAY TUNED • STAY TUNED • STAY TUNED • STAY TUNED • STAY TUNED • STAY TUNED • STAY TUNED • </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ComingSoon;
