import React from 'react';
import { motion } from 'framer-motion';
import profileImage from '../images/duta.jpg';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-header">
              <h1>
                Hi, I'm <span className="gradient-text">Duta Alamin</span>
              </h1>
              <p className="hero-description">
                A passionate Full Stack Developer and Data Analyst crafting beautiful and functional web experiences. 
                I specialize in building modern web applications using React, Next.js, and Node.js. 
                With expertise in data analysis using Python and SQL, I combine development skills with data-driven insights 
                to create comprehensive solutions.
              </p>
            </div>

            <div className="hero-social">
              <a 
                href="https://github.com/dutaalamin" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
              >
                <FaGithub />
                <span>GitHub</span>
              </a>

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
                href="https://instagram.com/dutalmn" 
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
