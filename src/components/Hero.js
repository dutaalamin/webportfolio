import React, { useState } from 'react';
import TicTacToe from './TicTacToe';

const linkedinUrl = 'https://linkedin.com/in/dutaalamin';


const heroAnimationStyle = `
@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}
@keyframes pulseGlow {
  0%, 100% { filter: drop-shadow(0 2px 8px #00eaff88); }
  50% { filter: drop-shadow(0 2px 24px #00eaffcc); }
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Always hide embedded game container by default */
.desktop-only { display: none !important; }

/* TicTacToe trigger button - visible on all breakpoints */
.ttt-trigger { display: flex; }

/* Desktop position (>=1025px) */
@media (min-width: 1025px) {
  .ttt-trigger {
    position: fixed;
    top: 80px;
    right: 2rem;
  }
}

/* Tablet/Mobile (<=1024px) */
@media (max-width: 1024px) {
  .ttt-trigger {
    position: fixed;
    bottom: 2rem;
    left: 2rem;
  }
}

@media (max-width: 600px) {
  .hero-title-modern {
    font-size: 2.5rem !important;
  }
  .hero-subtitle-modern {
    font-size: 1rem !important;
    flex-direction: column !important;
    gap: 0.5rem !important;
  }
  .hero {
    padding-top: 20px !important;
  }
  .hero-actions {
    flex-direction: column !important;
    gap: 1rem !important;
  }
  .action-button {
    padding: 0.8rem 1.5rem !important;
    font-size: 0.9rem !important;
  }
}
`;


const Hero = () => {
  const [showGameModal, setShowGameModal] = useState(false);

  return (
    <>
      <style>{heroAnimationStyle}</style>
      <section className="hero" style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        margin: 0,
        paddingTop: '60px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="hero-container" style={{ width: '100%' }}>
          <div className="hero-content" style={{ width: '100%' }}>
            <div className="hero-text" style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              textAlign: 'center',
              gap: '2rem',
              width: '100%',
            }}>
              <h1 className="hero-title-modern" style={{ 
                fontSize: '7rem',
                fontWeight: 900,
                fontFamily: 'Montserrat, sans-serif',
                letterSpacing: '0.1em',
                margin: 0,
                lineHeight: 1.1,
                color: '#fff',
                textShadow: 'none',
                animation: 'fadeIn 1s ease-out',
                transition: 'transform 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}>
                <span style={{
                  color: '#fff',
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 900,
                  display: 'inline-block',
                }}>DUTA</span> <span style={{
                  color: '#fff',
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 900,
                  display: 'inline-block',
                }}>ALAMIN</span>
              </h1>
              <p className="hero-subtitle-modern" style={{ 
                fontSize: '1.7rem',
                fontFamily: 'Poppins, monospace',
                letterSpacing: '0.2em',
                margin: 0,
                lineHeight: 1.5,
                color: '#fff',
                textShadow: '0 2px 8px #00eaff44',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1.5rem',
              }}>
                <span>SOFTWARE ENGINEER</span>
                <span style={{fontWeight: 'bold', color: '#00eaff'}}>|</span>
                <span>ERP FUNCTIONAL</span>
                <span style={{fontWeight: 'bold', color: '#00eaff'}}>|</span>
                <span>SUPPLY CHAIN</span>
              </p>
              <div className="hero-actions" style={{ 
                marginTop: '3rem',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2rem',
                flexWrap: 'wrap'
              }}>
                <a 
                  href={linkedinUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="action-button linkedin-button"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '1rem 2rem',
                    backgroundColor: 'transparent',
                    border: '2px solid #0077b5',
                    color: '#0077b5',
                    textDecoration: 'none',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '1rem',
                    fontWeight: '600',
                    letterSpacing: '0.05em',
                    borderRadius: '50px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    minWidth: '140px',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#0077b5';
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 119, 181, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#0077b5';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </a>
                
                <a 
                  href="https://open.spotify.com/playlist/2gQgfHfdjW8S0S4Ypfu1jV" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="action-button playlist-button"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '1rem 2rem',
                    backgroundColor: 'transparent',
                    border: '2px solid #1DB954',
                    color: '#1DB954',
                    textDecoration: 'none',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '1rem',
                    fontWeight: '600',
                    letterSpacing: '0.05em',
                    borderRadius: '50px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    minWidth: '140px',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1DB954';
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(29, 185, 84, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#1DB954';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                  My Playlist
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* TicTacToe embedded hidden by CSS (desktop-only) */}
        <div className="tictactoe-container desktop-only"></div>

        {/* TicTacToe Trigger Button */}
        <button
          className="tictactoe-icon-button ttt-trigger"
          onClick={() => setShowGameModal(true)}
          style={{
            position: 'fixed',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(0, 234, 255, 0.2) 0%, rgba(0, 234, 255, 0.1) 100%)',
            border: '2px solid rgba(0, 234, 255, 0.5)',
            color: '#00eaff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            zIndex: 100,
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(0, 234, 255, 0.3)',
            backdropFilter: 'blur(10px)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 234, 255, 0.5)';
            e.currentTarget.style.borderColor = '#00eaff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 234, 255, 0.3)';
            e.currentTarget.style.borderColor = 'rgba(0, 234, 255, 0.5)';
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
          </svg>
        </button>

        {/* Modal untuk Game */}
        {showGameModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(5px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '1rem',
              animation: 'fadeIn 0.3s ease-out',
            }}
            onClick={() => setShowGameModal(false)}
          >
            <div
              style={{
                background: 'linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(8,20,24,0.9) 100%)',
                borderRadius: '20px',
                padding: '2rem',
                maxWidth: '92%',
                maxHeight: '90vh',
                overflow: 'auto',
                position: 'relative',
                border: '1px solid rgba(0, 234, 255, 0.3)',
                boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,234,255,0.06) inset'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowGameModal(false)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'rotate(90deg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'rotate(0deg)';
                }}
              >
                ×
              </button>
              <TicTacToe />
            </div>
          </div>
        )}

      </section>
    </>
  );
};

export default Hero;




