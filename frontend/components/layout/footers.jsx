import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Waves, X } from 'lucide-react';

function Footers() {
  const [activeModal, setActiveModal] = useState(null); // 'terms' | 'privacy' | null

  // Lock body scroll when modal is active
  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeModal]);

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
              <button onClick={() => setActiveModal('terms')} className='footer-link-btn'>Terms of Service</button>
              <button onClick={() => setActiveModal('privacy')} className='footer-link-btn'>Privacy Policy</button>
              <Link href="mailto:rakeshpallamgod@gmail.com?subject=Inquiry&body=Hello, I need more information." target='_blank' className='footer-link'>Contact Us</Link>
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
            <Link href='https://www.instagram.com' target='_blank' className='footer-social-link'>Instagram</Link>
            <Link href='https://github.com/darvex-0' target='_blank' className='footer-social-link'>GITHUB</Link>
            <Link href='https://x.com/Moneyman4444444' target='_blank' className='footer-social-link'>X</Link>
          </div>
        </div>
      </div>

      {/* Modal Popup overlay */}
      {activeModal && (
        <div className='modal-overlay' onClick={() => setActiveModal(null)}>
          <div className='modal-container' onClick={(e) => e.stopPropagation()}>
            <div className='modal-header'>
              <div className='modal-title-wrap'>
                <Waves className='modal-title-icon' size={28} strokeWidth={1.5} />
                <h2 className='modal-title'>
                  {activeModal === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
                </h2>
              </div>
              <button className='modal-close-btn' onClick={() => setActiveModal(null)} aria-label="Close modal">
                <X size={20} />
              </button>
            </div>

            <div className='modal-body'>
              {activeModal === 'terms' ? (
                <>
                  <h3>1. Acceptance of Terms</h3>
                  <p>
                    Welcome to Beach Resort. By using our website, booking rooms, or accessing our guest services, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                  </p>

                  <h3>2. Reservation and Booking Policy</h3>
                  <p>
                    All reservations are subject to availability and written confirmation. A valid credit card and verified email address are required to guarantee a room booking. Rates are dynamic and quoted in local currency; they exclude local taxes and tourism levies unless explicitly stated otherwise.
                  </p>

                  <h3>3. Cancellation & No-Show Policies</h3>
                  <p>
                    Cancellations must be processed at least 48 hours prior to the scheduled 3:00 PM check-in time to avoid a penalty equivalent to one night's room charge plus tax. Specialized promotional rates, advance purchase packages, and holiday peak reservations are non-refundable and cannot be modified.
                  </p>

                  <h3>4. Check-in and Guest Requirements</h3>
                  <p>
                    Guests must be at least 18 years of age and present a valid government-issued photo ID at check-in. A credit card pre-authorization is required upon check-in to cover incidental charges. Standard check-in starts at 3:00 PM, and check-out is at 11:00 AM.
                  </p>

                  <h3>5. Resort Rules and Conduct</h3>
                  <p>
                    We maintain a strict smoke-free environment across all indoor rooms and balconies. Any violation of our non-smoking policy will result in a restoration fee. Guests are expected to maintain respectable conduct. Any damage to resort property, illegal activities, or severe disruption of other guests will lead to immediate eviction without refund.
                  </p>

                  <h3>6. Limitation of Liability</h3>
                  <p>
                    Beach Resort shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our booking system, accommodation facilities, or amenities, except to the extent prohibited by applicable consumer protection laws.
                  </p>
                </>
              ) : (
                <>
                  <h3>1. Information We Collect</h3>
                  <p>
                    We collect personal information that you provide to us directly when making room reservations, creating an account, or subscribing to our newsletters. This information may include your full name, email address, phone number, physical mailing address, billing details, and specific stay preferences.
                  </p>

                  <h3>2. How We Use Your Information</h3>
                  <p>
                    Your information is utilized to process reservations, verify accounts (including secure email verification for booking validation), personalize guest experiences, process payments, send check-in reminders, and communicate exclusive promotional offers if you have opted in.
                  </p>

                  <h3>3. Data Protection and Security</h3>
                  <p>
                    We prioritize your security. All online transactions and personal detail transfers are encrypted using industry-standard Secure Socket Layer (SSL/TLS) technology. Payment details are processed securely in compliance with PCI-DSS standards, and we do not store sensitive credit card information on our servers.
                  </p>

                  <h3>4. Cookies & Tracking Technologies</h3>
                  <p>
                    We use cookies and web beacons to enhance your navigation experience, analyze traffic patterns, remember user choices, and deliver personalized promotions. You can customize your cookie permissions through your web browser configuration, though some parts of the booking portal may not function fully without them.
                  </p>

                  <h3>5. Sharing of Personal Data</h3>
                  <p>
                    Beach Resort does not sell, lease, or rent guest information to third parties. We share data only with trusted service partners (such as secure payment gateways, email verification handlers, and booking engines) necessary to fulfill your requested transactions.
                  </p>

                  <h3>6. Guest Rights & Choices</h3>
                  <p>
                    You have the right to request access to the personal data we hold about you, request corrections to inaccurate records, or ask for your information to be removed from our databases. To exercise these rights, please contact our Guest Relations desk.
                  </p>
                </>
              )}
            </div>

            <div className='modal-footer'>
              <button className='modal-footer-btn' onClick={() => setActiveModal(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}

export default Footers;
