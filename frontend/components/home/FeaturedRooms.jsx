/**
 * @name Hotel Room Booking System
 * @description Premium FeaturedRooms Component - Merged from new UI design
 * Keeps real API data from backend, wraps with new premium card styling
 */

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { v4 as uniqueId } from 'uuid';

function RoomCard({ room, index }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%']);
  const isReverse = index % 2 !== 0;

  const imageUrl = room?.room_images?.[0]?.url || '/images/jpeg/room-1.jpeg';
  const roomName = room?.room_name || 'Luxury Suite';
  const roomPrice = room?.room_price || '—';
  const roomSlug = room?.room_slug || '#';
  const roomSize = room?.room_size ? `${room.room_size} sqft` : '';
  const roomDesc = room?.room_description || 'An exquisite escape with premium amenities and breathtaking views designed for the discerning traveler.';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: '-100px' }}
      className='room-card-premium'
    >
      {/* Parallax Background Image */}
      <div className='room-card-img-wrap'>
        <motion.div
          className='room-card-img-inner'
          style={{ y }}
        >
          <div className='room-card-img-overlay' />
          <img
            src={imageUrl}
            alt={roomName}
            className='room-card-img'
          />
        </motion.div>
      </div>

      {/* Gradient + Content Overlay */}
      <div className={`room-card-content-wrap ${isReverse ? 'reverse' : ''}`}>
        <div className={`room-card-content ${isReverse ? 'reverse' : ''}`}>
          {roomSize && (
            <div className='room-card-meta'>
              <span className='room-card-size'>{roomSize}</span>
              <span className='room-card-meta-line' />
            </div>
          )}

          <h3 className='room-card-name'>{roomName}</h3>
          <p className='room-card-desc'>{roomDesc}</p>

          <div className='room-card-footer'>
            <span className='room-card-price'>
              $
              {roomPrice}
              <span className='room-card-per-night'>/ night</span>
            </span>

            <Link href={`/rooms/${roomSlug}`} className='room-card-link group-card'>
              <span className='room-card-link-text'>Discover</span>
              <span className='room-card-link-arrow'>→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Animated Border Effect */}
      <div className='room-card-border-wrap'>
        <div className='room-card-border-base' />
        <div className='room-card-glow-border'>
          <motion.div
            className='room-card-glow-top'
            initial={{ left: '-100%' }}
            animate={{ left: '100%' }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className='room-card-glow-right'
            initial={{ top: '-100%' }}
            animate={{ top: '100%' }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
              delay: 0.375
            }}
          />
          <motion.div
            className='room-card-glow-bottom'
            initial={{ left: '100%' }}
            animate={{ left: '-100%' }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
              delay: 0.75
            }}
          />
          <motion.div
            className='room-card-glow-left'
            initial={{ top: '100%' }}
            animate={{ top: '-100%' }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
              delay: 1.125
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

function FeaturedRooms({ featuredRoom }) {
  return (
    <section id='rooms' className='featured-rooms-premium'>
      <div className='featured-rooms-inner'>
        <div className='featured-rooms-header'>
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className='featured-rooms-eyebrow'
            >
              Accommodations
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className='featured-rooms-heading'
            >
              Featured Suites
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Link href='/rooms' className='featured-rooms-view-all'>
              <span>View All</span>
              <span className='featured-rooms-view-all-line' />
            </Link>
          </motion.div>
        </div>

        <div className='featured-rooms-grid'>
          {featuredRoom?.map((room, index) => (
            <RoomCard key={uniqueId()} room={room} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedRooms;
