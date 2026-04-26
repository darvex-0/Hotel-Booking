/**
 * @name Hotel Room Booking System
 * @description Premium Footer Component - Merged from new UI design
 */

import React from 'react';
import Link from 'next/link';
import { Waves } from 'lucide-react';

function Footers() {
  return (
    <footer className='footer-premium'>
      <div className='footer-inner'>

        <div className='footer-grid'>
          {/* Left Column - Brand & Links */}
          <div className='footer-brand-col'>
            <div className="footer-logo-wrap">
              <div className='footer-logo-brand'>
                <Waves className='footer-logo-icon' size={32} strokeWidth={1.5} />
                <span className="footer-logo-text">
                  <span className='logo-bold'>BEACH</span>
                  <span className='logo-thin'>RESORT</span>
                </span>
              </div>
            </div>
              <div className='footer-links'>
                <Link href='/' className='footer-link'>Terms of Service</Link>
                <Link href='/' className='footer-link'>Privacy Policy</Link>
                <Link href='/' className='footer-link'>Contact Us</Link>
              </div>
          </div>

          {/* Middle Column */}
          <div className='footer-middle-col' />

          {/* Right Column - Map */}
          <div className='footer-map-col'>
            <div className='footer-map-label'>
              <h3 className='footer-map-title'>Headquarters</h3>
            </div>

            <div className='footer-map-wrap group'>
              <img
                src='https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2000&auto=format&fit=crop'
                alt='World Map'
                className='footer-map-img'
              />

              {/* Pin */}
              <div className='footer-map-pin'>
                <div className='footer-map-pin-icon'>
                  <svg
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='#d4af37'
                    stroke='#000'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z' />
                    <circle cx='12' cy='10' r='3' fill='black' />
                  </svg>
                </div>
                <div className='footer-map-pin-label'>Beach Resort</div>
              </div>

              {/* Hover Anchor */}
              <div className='footer-map-hover'>
                <a
                  href='https://maps.google.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='footer-map-btn'
                >
                  Open Maps
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='footer-bottom'>
          <p className='footer-copy'>
            &copy;
            {new Date().getFullYear()}
            BEACH RESORT. ALL RIGHTS RESERVED.
          </p>
          <div className='footer-social'>
            <Link href='/' className='footer-social-link'>Instagram</Link>
            <Link href='/' className='footer-social-link'>Journal</Link>
            <Link href='/' className='footer-social-link'>Concierge</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footers;
