/**
 * @name Hotel Room Booking System
 * @description Premium Hero Component - Merged from new UI design
 */

import { motion, useScroll, useTransform } from 'framer-motion';
import React, { useRef } from 'react';

function Hero({ children }) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  });

  // Parallax effects
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '80%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div
      ref={ref}
      id='home'
      className='hero-premium'
    >
      {/* Animated Parallax Background */}
      <motion.div
        className='hero-bg'
        style={{
          backgroundImage: 'url("/images/jpeg/defaultBcg2.jpg")',
          y: backgroundY,
          scale: 1.05
        }}
        initial={{ scale: 1.1, filter: 'blur(10px)' }}
        animate={{ scale: 1.05, filter: 'blur(0px)' }}
        transition={{ duration: 2, ease: 'easeOut' }}
      />

      {/* Gradient Overlay */}
      <div className='hero-overlay' />

      {/* Decorative vertical lines */}
      <div className='hero-lines'>
        <div className='hero-line' />
        <div className='hero-line' />
      </div>

      {/* Animated Text wrapper */}
      <motion.div
        className='hero-content'
        style={{ y: textY, opacity }}
      >
        {children}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className='hero-scroll-indicator'
      >
        <span className='hero-scroll-text'>Scroll</span>
        <div className='hero-scroll-line'>
          <motion.div
            animate={{ y: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            className='hero-scroll-dot'
          />
        </div>
      </motion.div>
    </div>
  );
}

export default Hero;
