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
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
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

// Update style untuk kucing gambar
const catAnimationStyle = `
.cat-container {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 150px;
  height: 150px;
  z-index: 10;
  border-radius: 50%;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.cat-container.second {
  top: 190px; /* 20px + 150px + 20px spacing */
}

.cat-container.third {
  top: 360px; /* 190px + 150px + 20px spacing */
}

.cat-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scaleX(-1);
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
  mix-blend-mode: screen;
}

@media (max-width: 768px) {
  .cat-container {
    width: 100px;
    height: 100px;
    top: 10px;
    right: 10px;
  }
  .cat-container.second {
    top: 180px; /* Menambah jarak dari atas */
  }
  .cat-container.third {
    top: 300px; /* Menyesuaikan jarak dengan kucing kedua */
  }
}

@media (max-width: 480px) {
  .cat-container {
    width: 80px;
    height: 80px;
    top: 5px;
    right: 5px;
  }
  .cat-container.second {
    top: 200px; /* Menambah jarak dari atas agar tidak menutupi teks */
  }
  .cat-container.third {
    top: 320px; /* Menyesuaikan jarak dengan kucing kedua */
  }
}
`;

const Hero = () => {
  return (
    <>
      <style>{heroAnimationStyle}</style>
      <style>{catAnimationStyle}</style>
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

        {/* Update kucing menjadi gambar */}
        <div className="cat-container">
          <img 
            src="https://media.tenor.com/cb9L14uH-YAAAAAM/cool-fun.gif" 
            alt="Cat" 
            className="cat-image"
            style={{
              mixBlendMode: 'screen'
            }}
          />
        </div>
      </section>
    </>
  );
};

export default Hero;


