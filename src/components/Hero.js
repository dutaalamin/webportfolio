import React, { useEffect, useRef } from 'react';
import profileImage from '../images/duta.jpg';
import { FaLinkedin, FaInstagram } from 'react-icons/fa';
import { TypeAnimation } from 'react-type-animation';

const Hero = () => {
  const particlesRef = useRef(null);

  useEffect(() => {
    const createParticles = () => {
      const particles = particlesRef.current;
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.position = 'absolute';
      }
    };

    createParticles();
  }, []);

  return (
    <section className="hero">
      <div className="particles-bg" ref={particlesRef}></div>
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-header">
              <h1 className="glitch-text">
                <span aria-hidden="true">Duta Alamin</span>
                Duta Alamin
                <span aria-hidden="true">Duta Alamin</span>
              </h1>
              <TypeAnimation
                sequence={[
                  'Software Engineer',
                  2000,
                  'IT Engineer',
                  2000,
                  'Supply Chain Management',
                  2000
                ]}
                wrapper="h2"
                cursor={true}
                repeat={Infinity}
                className="typing-text"
                style={{ fontSize: '1.5rem', marginTop: '1rem', marginBottom: '2rem' }}
              />
              <p className="hero-description" style={{ marginTop: '1rem' }}>
              I'm passionate about IT and Supply Chain Management, 
              with hands-on experience in developing custom ERP solutions that improve business processes and operational efficiency.
              </p>
            </div>

            <div className="hero-social">
              <a 
                href="https://linkedin.com/in/duta-alamin" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
              >
                <FaLinkedin />
                <span>LinkedIn</span>
              </a>

              <a 
                href="https://instagram.com/dutaalamin" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
              >
                <FaInstagram />
                <span>Instagram</span>
              </a>
            </div>

            <div className="hero-cta">
              <a 
                href="#projects" 
                className="cta-button primary"
              >
                View Projects
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
            </div>
          </div>

          <div className="hero-image">
            <div className="image-container">
              <img src={profileImage} alt="Duta Alamin" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
