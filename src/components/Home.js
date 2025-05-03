// src/components/Home.js
import React from 'react';
import { Container, Grid, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';

const Home = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #f0f7ff, white)' }}>
      {/* Hero Section */}
      <section style={{ 
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        <div style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to right, #3b82f6, #9333ea)',
          opacity: 0.5
        }}></div>
        <div style={{ 
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          padding: '0 1rem'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="h2" style={{ color: '#2D3748', marginBottom: '1rem' }}>
              Welcome to HealZone
            </Typography>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Typography variant="h5" style={{ color: '#4A5568', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto' }}>
              Your journey to better mental health starts here. Connect with professionals,
              find support, and take control of your well-being.
            </Typography>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}
          >
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                color="primary"
                style={{ textTransform: 'none', padding: '0.5rem 2rem' }}
              >
                Get Started
              </Button>
            </Link>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Button
                variant="outlined"
                color="primary"
                style={{ textTransform: 'none', padding: '0.5rem 2rem' }}
              >
                Login
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '4rem 0', background: 'white' }}>
        <Container>
          <Typography variant="h3" align="center" style={{ marginBottom: '3rem' }}>
            Why Choose HealZone?
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                icon: FaUser,
                title: 'Professional Support',
                description: 'Connect with licensed therapists and mental health professionals'
              },
              {
                icon: FaLock,
                title: 'Secure & Private',
                description: 'Your privacy and security are our top priority'
              },
              {
                icon: FaEnvelope,
                title: 'Personalized Care',
                description: 'Customized treatment plans tailored to your needs'
              }
            ].map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  style={{ textAlign: 'center', padding: '2rem', background: '#f0f7ff', borderRadius: '8px' }}
                >
                  <feature.icon style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#3b82f6' }} />
                  <Typography variant="h5" style={{ marginBottom: '0.5rem' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" style={{ color: '#4b5563' }}>
                    {feature.description}
                  </Typography>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      {/* Services Section */}
      <section style={{ padding: '4rem 0', background: '#f0f7ff' }}>
        <Container>
          <Typography variant="h3" align="center" style={{ marginBottom: '3rem' }}>
            Our Services
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                title: 'Online Therapy',
                description: 'Schedule sessions with therapists from the comfort of your home'
              },
              {
                title: 'Support Groups',
                description: 'Join community groups for peer support and connection'
              },
              {
                title: 'Mental Health Resources',
                description: 'Access educational materials and self-help guides'
              },
              {
                title: 'Crisis Support',
                description: '24/7 emergency support for immediate assistance'
              }
            ].map((service, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  style={{ padding: '2rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                >
                  <Typography variant="h5" style={{ marginBottom: '0.5rem' }}>
                    {service.title}
                  </Typography>
                  <Typography variant="body1" style={{ color: '#4b5563' }}>
                    {service.description}
                  </Typography>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      {/* Call to Action Section */}
      <section style={{ padding: '3rem 0', background: '#3b82f6', color: 'white' }}>
        <Container>
          <div style={{ textAlign: 'center' }}>
            <Typography variant="h3" style={{ marginBottom: '1rem' }}>
              Start Your Healing Journey Today
            </Typography>
            <Typography variant="h5" style={{ marginBottom: '2rem' }}>
              Take the first step towards a healthier mind and happier life
            </Typography>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                color="primary"
                style={{
                  textTransform: 'none',
                  padding: '0.5rem 2rem',
                  background: 'white',
                  color: '#3b82f6',
                  '&:hover': {
                    background: '#f0f7ff',
                    color: '#3b82f6'
                  }
                }}
              >
                Sign Up Now
              </Button>
            </Link>
            <Link to="/login" style={{ textDecoration: 'none', marginLeft: '1rem' }}>
              <Button
                variant="outlined"
                color="primary"
                style={{
                  textTransform: 'none',
                  padding: '0.5rem 2rem',
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: '#f0f7ff',
                    background: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Login
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Home;
