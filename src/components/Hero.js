import React from 'react';

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

//* TicTacToe trigger button - visible on all breakpoints, bottom-left */
.ttt-trigger {
  display: flex;
  position: fixed;
  bottom: 2rem;
  left: 2rem;
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

  return (
    <>
      <style>{heroAnimationStyle}</style>
      <section className="hero-about-me" style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: 0,
        margin: 0,
        paddingTop: '60px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="hero-about-container" style={{ 
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 2rem',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          alignItems: 'center'
        }}>
          {/* Left Section - Text */}
          <div className="hero-about-text" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '2rem',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              <p style={{
                margin: 0,
                letterSpacing: '0.38em',
                fontSize: '1.3rem',
                color: 'rgba(255, 255, 255, 0.8)',
                textTransform: 'uppercase'
              }}>
                Duta Alamin
              </p>

              <h1 style={{ 
                fontSize: '4.2rem',
                fontWeight: 900,
                fontFamily: 'Montserrat, sans-serif',
                letterSpacing: '-0.01em',
                margin: 0,
                lineHeight: 1.05,
                color: 'var(--text-color)',
              }}>
                Software<br />Engineer
              </h1>

              <p style={{
                fontSize: '1.05rem',
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: 1.7,
                maxWidth: '820px',
                margin: 0
              }}>
                I’m Duta, a Software Engineer with hands-on experience in ERP development, IT business systems, and supply chain processes. I currently work as a Factory Automation Engineer, bridging software, operations, and industrial systems to build reliable, efficient solutions.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '0.85rem 1.8rem',
                    backgroundColor: '#1f2937',
                    color: '#fff',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                    border: '1px solid rgba(255,255,255,0.15)',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
                    transition: 'all 0.25s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 14px 30px rgba(0,0,0,0.35)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.25)';
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </a>

                <button
                  onClick={() => {
                    const contact = document.getElementById('contact');
                    if (contact) {
                      contact.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  style={{
                    padding: '0.85rem 1.8rem',
                    backgroundColor: 'transparent',
                    color: 'var(--text-color)',
                    borderRadius: '12px',
                    fontWeight: 600,
                    fontSize: '1rem',
                    border: '1px solid rgba(255,255,255,0.25)',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.borderColor = 'var(--primary-color)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  Contact Me
                </button>
              </div>
            </div>
          </div>

          {/* Right Section - Image */}
          <div className="hero-about-image" style={{
            position: 'relative',
            width: '100%',
            height: '600px',
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            <img 
              src="/images/duta1.png" 
              alt="Duta Alamin"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;




