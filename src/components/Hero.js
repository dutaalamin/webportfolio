import React from 'react';

const featuredLogos = [
  {
    name: 'Appen',
    url: 'https://s41226.pcdn.co/wp-content/uploads/2024/02/appen-logo.svg',
    width: 90,
  },
  {
    name: 'Upwork',
    url: 'https://image.status.io/z6aeO6kAGsAG.png',
    width: 90,
  },
  {
    name: 'Fiverr',
    url: 'https://freepnglogo.com/images/all_img/1706198346fiverr-logo-transparent.png',
    width: 90,
  },
  // Tambahkan logo lain jika ingin
];

// Tambahkan style global untuk animasi
const heroAnimationStyle = `
@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}
@keyframes pulseGlow {
  0%, 100% { filter: drop-shadow(0 2px 8px #00eaff88); }
  50% { filter: drop-shadow(0 2px 24px #00eaffcc); }
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
  .featured-logos {
    display: flex !important;
    flex-wrap: wrap !important;
    justify-content: center !important;
    gap: 0.5rem !important;
  }
}
`;

const Hero = () => {
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
                fontWeight: 'bold',
                fontFamily: 'Orbitron, Poppins, monospace',
                letterSpacing: '0.1em',
                margin: 0,
                lineHeight: 1.1,
                color: '#fff',
                textShadow: '0 4px 32px #00eaff, 0 1px 0 #000',
              }}>
                <span style={{
                  background: 'linear-gradient(90deg, #00eaff, #0072ff, #00eaff, #0072ff)',
                  backgroundSize: '200% 200%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'gradientMove 3s linear infinite, pulseGlow 2s ease-in-out infinite',
                  fontFamily: 'Orbitron, Poppins, monospace',
                  fontWeight: 900,
                  display: 'inline-block',
                }}>DUTA</span> <span style={{
                  background: 'linear-gradient(90deg, #00eaff, #0072ff, #00eaff, #0072ff)',
                  backgroundSize: '200% 200%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'gradientMove 3s linear infinite, pulseGlow 2s ease-in-out infinite',
                  fontFamily: 'Orbitron, Poppins, monospace',
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
                <span>FRONT END</span>
                <span style={{fontWeight: 'bold', color: '#00eaff'}}>|</span>
                <span>SUPPLY CHAIN</span>
              </p>
              <div className="hero-featured" style={{ 
                marginTop: '3rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <span className="featured-label" style={{
                  color: '#aaa',
                  fontFamily: 'monospace',
                  fontSize: '1rem',
                  letterSpacing: '0.15em',
                  marginBottom: '0.5rem',
                }}>AS FEATURED IN</span>
              <div className="featured-logos">
                {featuredLogos.map((logo) => (
                  <img
                    key={logo.name}
                    src={logo.url}
                    alt={logo.name}
                    className="featured-logo"
                      style={{ width: logo.width, height: 'auto', margin: '0 1rem' }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default Hero;
