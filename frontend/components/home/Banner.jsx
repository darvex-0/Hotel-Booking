/**
 * @name Hotel Room Booking System
 * @description Premium Banner Component - Merged from new UI design
 */

import React from 'react';
import { motion } from 'framer-motion';
import { v4 as uniqueId } from 'uuid';

function Banner({ children, title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className='banner-premium'
    >
      <p className='banner-subtitle'>{subtitle}</p>
      <h1 className='banner-title'>
        {title.split(' ').map((word) => (
          <span key={uniqueId()} className='banner-word'>{word}</span>
        ))}
      </h1>
      <div className='banner-children'>{children}</div>
    </motion.div>
  );
}

export default Banner;
