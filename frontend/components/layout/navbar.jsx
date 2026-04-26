/**
 * @name Hotel Room Booking System
 * @description Premium Navbar Component - Merged from new UI design
 * Keeps: Login button, UserPopover, existing routing (Next.js Link/useRouter)
 */

import { Button } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform
} from 'framer-motion';
import { Waves } from 'lucide-react';
import { getSessionToken, getSessionUser } from '../../utils/authentication';
import UserPopover from './popover';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  const user = getSessionUser();
  const token = getSessionToken();
  const router = useRouter();

  const { scrollY } = useScroll();
  const isHomePage = router.pathname === '/';
  const bgOpacity = useTransform(scrollY, [0, 150], [isHomePage ? 0 : 1, 1]);
  const py = useTransform(scrollY, [0, 150], ['1rem', '0.5rem']);

  useEffect(() => {
    const isHomePage = router.pathname === '/';
    let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(!isHomePage || currentScrollY > 75);

      if (currentScrollY > 150 && currentScrollY > lastScrollY && !isOpen) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      lastScrollY = currentScrollY;
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  return (
    <motion.header
      style={{ paddingTop: py, paddingBottom: py }}
      className={`navbar-premium ${hidden ? 'navbar-hidden' : ''}`}
    >
      {/* Dynamic Background Layer */}
      <motion.div
        style={{ opacity: bgOpacity }}
        className='navbar-bg'
      />

      <div className='navbar-inner'>
        <div className='navbar-row'>

          {/* Logo */}
          <div className='navbar-logo-wrap'>
            <Link href='/' className='navbar-logo'>
              <div className={`navbar-logo-text ${scrolled ? 'scrolled' : ''}`}>
                <Waves className={`navbar-logo-icon ${scrolled ? 'scrolled' : ''}`} size={36} strokeWidth={1.5} />
                <span className="logo-text-inner">
                  <span className='logo-bold'>BEACH</span>
                  <span className='logo-thin'>RESORT</span>
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav className='navbar-desktop'>
            <div className='navbar-links-center'>
              {[
                { label: 'Home', href: '/' },
                { label: 'Rooms', href: '/rooms' },
                { label: 'Services', href: '/#services' }
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`navbar-link ${scrolled ? 'scrolled' : ''}`}
                >
                  {item.label}
                  <span className={`navbar-link-underline ${scrolled ? 'scrolled' : ''}`} />
                </Link>
              ))}
            </div>
          </nav>

          {/* Mobile menu toggle */}
          <div className='navbar-mobile-toggle'>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`navbar-hamburger ${scrolled || isOpen ? 'scrolled' : ''}`}
              type='button'
              aria-label='Toggle navigation'
            >
              <span className={`navbar-bar ${isOpen ? 'open-top' : ''}`} />
              <span className={`navbar-bar ${isOpen ? 'open-mid' : ''}`} />
              <span className={`navbar-bar ${isOpen ? 'open-bot' : ''}`} />
            </button>
          </div>

        </div>
      </div>

      {/* Extreme Corner Auth Section - Outside the 1400px container */}
      <div className='navbar-auth-section'>
        {user?.id && token ? (
          <UserPopover scrolled={scrolled} />
        ) : (
          <>
            <Button
              onClick={() => router.push('/auth/login')}
              type='text'
              size='middle'
              className={`navbar-login-btn ${scrolled ? 'scrolled' : ''}`}
            >
              Log In
            </Button>
            <Link
              href='/rooms'
              className={`navbar-book-btn ${scrolled ? 'scrolled' : ''}`}
            >
              Book Now
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0 0)' }}
            exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.5, ease: [0.77, 0, 0.175, 1] }}
            className='navbar-mobile-menu'
          >
            <div className='navbar-mobile-links'>
              {[
                { label: 'Home', href: '/' },
                { label: 'Rooms', href: '/rooms' },
                { label: 'Services', href: '/#services' }
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className='navbar-mobile-link'
                >
                  {item.label}
                  <span className='navbar-mobile-link-underline' />
                </Link>
              ))}

              <Link
                href='/rooms'
                onClick={() => setIsOpen(false)}
                className='navbar-mobile-book'
              >
                Book Now
              </Link>

              {!(user?.id && token) && (
                <button
                  onClick={() => { setIsOpen(false); router.push('/auth/login'); }}
                  className='navbar-mobile-login'
                  type='button'
                >
                  Log In
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export default Navbar;
