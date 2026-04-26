/**
 * @name Hotel Room Booking System
 * @description Premium Services Component - Merged from new UI design
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const experiences = [
  {
    id: '01',
    title: 'Coastal Dining',
    info: 'Savor Michelin-starred flavors with locally sourced seafood, seated at the edge of the lapping waves as the sun sets over the horizon.',
    image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: '02',
    title: 'Private Charters',
    info: 'Set sail on our exclusive private yacht to explore hidden coves, pristine reefs, and untouched sandbars tailored to your desires.',
    image: 'https://images.unsplash.com/photo-1534008897995-27a23e859048?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: '03',
    title: 'Oceanfront Spa',
    info: 'Holistic healing rituals synchronized with the ocean breeze, utilizing ancient techniques and marine-rich elements for ultimate rejuvenation.',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: '04',
    title: 'Sunset Cabanas',
    info: 'Reserved luxury lounging with dedicated butler service, vintage champagne, and unobstructed serene views of the coastal twilight.',
    image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
  }
];

function Services() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id='services' className='services-premium'>
      <div className='services-premium-inner'>

        {/* Section Header */}
        <div className='services-header'>
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className='services-eyebrow'
            >
              Curated Experiences
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className='services-heading'
            >
              Beyond The Suite
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className='services-divider'
          />
        </div>

        {/* Accordion Showcase */}
        <div className='services-accordion'>
          {experiences.map((exp, index) => {
            const isActive = activeIndex === index;
            return (
              <motion.div
                key={exp.id}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
                initial={false}
                animate={{
                  flex: isActive ? 3.5 : 1
                }}
                transition={{ duration: 1.5, ease: [0.33, 1, 0.68, 1] }}
                className='services-panel'
              >
                {/* Background Image */}
                <motion.div
                  className='services-panel-bg'
                  style={{ backgroundImage: `url(${exp.image})` }}
                  animate={{
                    scale: isActive ? 1.05 : 1.15,
                    filter: isActive ? 'brightness(0.8)' : 'brightness(0.3)'
                  }}
                  transition={{ duration: 1.5, ease: [0.33, 1, 0.68, 1] }}
                />

                {/* Vertical Lines for passive states */}
                {!isActive && (
                  <div className='services-panel-line-container'>
                    <span className='services-panel-line' />
                  </div>
                )}

                {/* Gradient Overlay */}
                <div className={`services-panel-overlay ${isActive ? 'active' : ''}`} />

                {/* Content */}
                <div className='services-panel-content'>
                  <div className='services-panel-id-row'>
                    <span className={`services-panel-id ${isActive ? 'active' : ''}`}>
                      {exp.id}
                    </span>
                    <span className={`services-panel-id-line ${isActive ? 'active' : ''}`} />
                  </div>

                  <h3 className={`services-panel-title ${isActive ? 'active' : ''}`}>
                    {exp.title}
                  </h3>

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, y: 10 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: 10 }}
                        transition={{
                          duration: 1.0,
                          ease: [0.33, 1, 0.68, 1],
                          opacity: { duration: 0.8, delay: 0.3 }
                        }}
                      >
                        <p className='services-panel-info'>{exp.info}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Services;
