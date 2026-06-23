import { Empty, Result, Skeleton } from 'antd';
import axios from 'axios';
import getConfig from 'next/config';
import Link from 'next/link';
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Banner from '../components/home/Banner';
import FeaturedRooms from '../components/home/FeaturedRooms';
import Hero from '../components/home/Hero';
import Services from '../components/home/Services';
import FloatingElements from '../components/home/FloatingElements';
import MainLayout from '../components/layout';

const { publicRuntimeConfig } = getConfig();

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  return (
    <div
      style={{
        position: 'fixed',
        top: '25%',
        right: '24px',
        bottom: '25%',
        width: '1px',
        background: 'rgba(44,53,57,0.1)',
        zIndex: 50,
        display: 'none'
      }}
      className='scroll-tracker'
    >
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          background: '#b89f7a',
          height: useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
        }}
      />
    </div>
  );
}

function Home(props) {
  const { scrollYProgress } = useScroll();

  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.4, 0.8, 1],
    ['#F9F6F0', '#F4F0E6', '#F0F4F2', '#F7F2EB']
  );

  const ambientY1 = useTransform(scrollYProgress, [0, 1], ['0%', '200%']);
  const ambientY2 = useTransform(scrollYProgress, [0, 1], ['30%', '-150%']);

  return (
    <MainLayout title='Beach Resort ― Home'>
      <motion.div
        style={{ backgroundColor }}
        className='page-ambient'
      >
        {/* Global Glowing Orbs */}
        <motion.div
          className='ambient-orb orb-right'
          style={{ y: ambientY1 }}
        />
        <motion.div
          className='ambient-orb orb-left'
          style={{ y: ambientY2 }}
        />

        {/* Scroll Progress Bar */}
        <ScrollProgressBar />

        {/* Floating 3D Elements */}
        <FloatingElements />

        {/* Main Content */}
        <div className='page-content'>
          <Hero>
            <Banner
              title='Sanctuary Discovered'
              subtitle='A Private Coastal Escape'
            >
              <Link href='/rooms' className='btn-hero-primary'>
                Reserve Your Stay
              </Link>
            </Banner>
          </Hero>

          <Services />

          <section className='featured-rooms-section'>
            <Skeleton
              loading={props?.featuredRooms?.loading}
              active
              paragraph={{ rows: 8 }}
            >
              {props?.featuredRooms?.data?.rows?.length === 0 ? (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description='No Rooms Found'
                />
              ) : props?.error ? (
                <Result
                  title='Failed to fetch'
                  subTitle={props?.error?.message || 'Sorry! Something went wrong. App server error'}
                  status='error'
                />
              ) : (
                <FeaturedRooms
                  featuredRoom={props?.featuredRooms?.data?.rows}
                />
              )}
            </Skeleton>
          </section>
        </div>
      </motion.div>
    </MainLayout>
  );
}

export async function getServerSideProps() {
  try {
    const serverUrl = process.env.API_SERVER_BASE_URL || publicRuntimeConfig.API_BASE_URL;
    const response = await axios.get(`${serverUrl}/api/v1/featured-rooms-list`);
    const featuredRooms = response?.data?.result;

    return {
      props: {
        featuredRooms,
        error: null
      }
    };
  } catch (err) {
    return {
      props: {
        featuredRooms: null,
        error: err?.response?.data || { message: err?.message || 'Unknown error' }
      }
    };
  }
}

export default Home;
