/**
 * @name Hotel Room Booking System
 * @description FloatingElements Component - Premium 3D scroll-driven floating photo cards
 * Adapted from new UI design using framer-motion
 */

import { motion, useScroll, useTransform } from 'framer-motion';
import React from 'react';

function FloatingElements() {
  const { scrollYProgress } = useScroll();

  return (
    <div className='floating-elements' style={{ perspective: '1500px' }}>
      {/* Cocktail */}
      <motion.div
        className='floating-card floating-card-right'
        style={{
          y: useTransform(scrollYProgress, [0, 1], ['30vh', '-100vh']),
          rotate: useTransform(scrollYProgress, [0, 1], [15, -25]),
          rotateX: useTransform(scrollYProgress, [0, 1], [30, -50]),
          rotateY: useTransform(scrollYProgress, [0, 1], [-20, 60]),
          z: useTransform(scrollYProgress, [0, 1], [100, -400]),
          opacity: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 0.7, 0.7, 0]),
          transformStyle: 'preserve-3d'
        }}
      >
        <img
          src='https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=600&q=80'
          alt='Tropical Cocktail'
          className='floating-card-img'
        />
        <div className='floating-card-label-bottom'>Aperitif</div>
      </motion.div>

      {/* Beach Bed */}
      <motion.div
        className='floating-card floating-card-left floating-card-wide'
        style={{
          y: useTransform(scrollYProgress, [0, 1], ['40vh', '-120vh']),
          rotate: useTransform(scrollYProgress, [0, 1], [-10, 30]),
          rotateX: useTransform(scrollYProgress, [0, 1], [-20, 50]),
          rotateY: useTransform(scrollYProgress, [0, 1], [15, -45]),
          z: useTransform(scrollYProgress, [0, 1], [-100, 300]),
          opacity: useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0, 0.8, 0.8, 0]),
          transformStyle: 'preserve-3d'
        }}
      >
        <img
          src='https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=600&q=80'
          alt='Beach Lounger'
          className='floating-card-img'
        />
        <div className='floating-card-label-side'>Lounge</div>
      </motion.div>

      {/* Ocean Shell */}
      <motion.div
        className='floating-card floating-card-right-2'
        style={{
          y: useTransform(scrollYProgress, [0, 1], ['50vh', '-140vh']),
          rotate: useTransform(scrollYProgress, [0, 1], [-20, 20]),
          rotateX: useTransform(scrollYProgress, [0, 1], [40, -10]),
          rotateY: useTransform(scrollYProgress, [0, 1], [30, -30]),
          z: useTransform(scrollYProgress, [0, 1], [50, -200]),
          opacity: useTransform(scrollYProgress, [0.2, 0.4, 0.8, 1], [0, 0.75, 0.75, 0.3]),
          transformStyle: 'preserve-3d'
        }}
      >
        <img
          src='https://st4.depositphotos.com/1760977/20070/i/1600/depositphotos_200705110-stock-photo-starfish-seashell-summer-beach-sea.jpg'
          alt='Shell'
          className='floating-card-img'
        />
        <div className='floating-card-label-bottom'>Discover</div>
      </motion.div>

      {/* Palms */}
      <motion.div
        className='floating-card floating-card-left-2 floating-card-tall'
        style={{
          y: useTransform(scrollYProgress, [0, 1], ['60vh', '-160vh']),
          rotate: useTransform(scrollYProgress, [0, 1], [10, -10]),
          rotateX: useTransform(scrollYProgress, [0, 1], [-10, 30]),
          rotateY: useTransform(scrollYProgress, [0, 1], [-30, 20]),
          z: useTransform(scrollYProgress, [0, 1], [-50, 150]),
          opacity: useTransform(scrollYProgress, [0.4, 0.6, 0.9, 1], [0, 0.8, 0.8, 0.6]),
          transformStyle: 'preserve-3d'
        }}
      >
        <img
          src='https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=600&q=80'
          alt='Palm Trees'
          className='floating-card-img'
        />
        <div className='floating-card-label-side-left'>Breeze</div>
      </motion.div>
    </div>
  );
}

export default FloatingElements;
