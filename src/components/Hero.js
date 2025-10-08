import React from 'react';

const featuredLogos = [
  { name: 'Appen',  url: 'https://s41226.pcdn.co/wp-content/uploads/2024/02/appen-logo.svg', width: 90 },
  { name: 'Upwork', url: 'https://image.status.io/z6aeO6kAGsAG.png',                                 width: 90 },
  { name: 'Fiverr', url: 'https://freepnglogo.com/images/all_img/1706198346fiverr-logo-transparent.png', width: 90 },
];

// Global styles (animasi + util lokal)
const heroAnimationStyle = `
@keyframes gradientMove { 0%{background-position:0% 50%} 100%{background-position:100% 50%}}
@keyframes pulseGlow {0%,100%{filter:drop-shadow(0 2px 8px #00eaff88)} 50%{filter:drop-shadow(0 2px 24px #00eaffcc)}}
@keyframes fadeIn {from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)}}

.btn {
  display:inline-flex; align-items:center; justify-content:center;
  gap:.5rem; padding:.85rem 1.2rem; border-radius:999px; font-weight:600;
  border:1px solid rgba(255,255,255,.15); backdrop-filter: blur(6px);
  transition: transform .15s ease, box-shadow .2s ease, background .2s ease, border-color .2s ease;
  text-decoration:none; color:#fff;
}
.btn-primary{
  background: linear-gradient(90deg,#00baff,#00eaff);
  box-shadow: 0 8px 24px rgba(0,234,255,.2);
}
.btn-primary:hover{ transform: translateY(-1px); box-shadow:0 10px 28px rgba(0,234,255,.28)}
.btn-ghost{
  background: rgba(255,255,255,.06);
}
.btn-ghost:hover{ background: rgba(255,255,255,.12); border-color: rgba(255,255,255,.25) }

.badge-open{
  display:inline-block; padding:.35rem .7rem; border-radius:999px;
  font-size:.85rem; letter-spacing:.02em;
  background: rgba(0,234,255,.1); border:1px solid rgba(0,234,255,.35); color:#bff5ff;
}

@media (max-width: 900px){
  .hero-title-modern{ font-size: 4.25rem !important; }
}
@media (max-width: 600px){
  .hero-title-modern{ font-size: 2.65rem !important; }
  .hero-subtitle-modern{ font-size: 1rem !important; flex-direction:column !important; gap:.5rem !important; }
  .hero{ padding-top: 20px !important; }
  .featured-logos{ display:flex !important; flex-wrap:wrap !important; justify-content:center !important; gap:.5rem !important; }
}

/* Cat bubble */
.cat-container{
  position:absolute; top:20px; right:20px; width:150px; height:150px; z-index:10; border-radius:50%;
  overflow:hidden; background: rgba(255,255,255,.1); backdrop-filter: blur(5px);
  border:2px solid rgba(255,255,255,.2);
}
.cat-image{ width:100%; height:100%; object-fit:cover; transform: scaleX(-1); filter: drop-shadow(0 4px 8px rgba(0,0,0,.2)); mix-blend-mode:screen; }
@media (max-width:768px){ .cat-container{ width:100px; height:100px; top:10px; right:10px } }
@media (max-width:480px){ .cat-container{ width:80px; height:80px; top:5px; right:5px } }
`;

const Hero = () => {
  return (
    <>
      <style>{heroAnimationStyle}</style>

      <section
        className="hero"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          margin: 0,
          paddingTop: '60px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="hero-container" style={{ width: '100%' }}>
          <div className="hero-content" style={{ width: '100%' }}>
            <div
              className="hero-text"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                gap: '1.5rem',
                width: '100%',
              }}
            >
              {/* Badge kecil untuk status */}
              <span className="badge-open" aria-label="Open to roles">
                Open to ERP Functional / SAP roles
              </span>

              <h1
                className="hero-title-modern"
                style={{
                  fontSize: '7rem',
                  fontWeight: 900,
                  fontFamily: 'Montserrat, sans-serif',
                  letterSpacing: '0.1em',
                  margin: 0,
                  lineHeight: 1.1,
                  color: '#fff',
                  textShadow: 'none',
                  animation: 'fadeIn 0.9s ease-out',
                  transition: 'transform 0.25s ease',
                  cursor: 'default',
                }}
              >
                <span style={{ color: '#fff', fontWeight: 900, display: 'inline-block' }}>DUTA</span>{' '}
                <span style={{ color: '#fff', fontWeight: 900, display: 'inline-block' }}>ALAMIN</span>
              </h1>

              {/* Sub-tagline singkat (1 kalimat value) */}
              <p
                style={{
                  margin: 0,
                  color: '#cfefff',
                  fontFamily: 'Inter, ui-sans-serif, system-ui',
                  fontSize: '1.05rem',
                  maxWidth: 820,
                  opacity: 0.95,
                }}
              >
                Building pragmatic ERP & supply-chain systems that connect engineering, procurement, and finance.
              </p>

              <p
                className="hero-subtitle-modern"
                style={{
                  fontSize: '1.35rem',
                  fontFamily: 'Poppins, monospace',
                  letterSpacing: '0.18em',
                  margin: 0,
                  lineHeight: 1.5,
                  color: '#fff',
                  textShadow: '0 2px 8px #00eaff44',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1.25rem',
                }}
                aria-label="roles"
              >
                <span>SOFTWARE ENGINEER</span>
                <span style={{ fontWeight: 'bold', color: '#00eaff' }}>|</span>
                <span>ERP FUNCTIONAL</span>
                <span style={{ fontWeight: 'bold', color: '#00eaff' }}>|</span>
                <span>SUPPLY CHAIN</span>
              </p>

              {/* CTA */}
              <div style={{ display: 'flex', gap: '.8rem', marginTop: '.25rem' }}>
                <a className="btn btn-primary" href="/resume.pdf" target="_blank" rel="noreferrer">
                  Download CV
                </a>
                <a className="btn btn-ghost" href="mailto:dutaalamin23@gmail.com">
                  Email Me
                </a>
              </div>

              {/* Featured logos */}
              <div
                className="hero-featured"
                style={{ marginTop: '2.2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.75rem' }}
              >
                <span
                  className="featured-label"
                  style={{
                    color: '#aaa',
                    fontFamily: 'monospace',
                    fontSize: '0.95rem',
                    letterSpacing: '0.15em',
                    marginBottom: '0.25rem',
                  }}
                >
                  AS FEATURED IN
                </span>
                <div className="featured-logos" aria-label="logos">
                  {featuredLogos.map((logo) => (
                    <img
                      key={logo.name}
                      src={logo.url}
                      alt={logo.name}
                      className="featured-logo"
                      style={{ width: logo.width, height: 'auto', margin: '0 1rem', opacity: 0.9 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cat bubble */}
        <div className="cat-container" aria-hidden="true">
          <img src="https://media.tenor.com/cb9L14uH-YAAAAAM/cool-fun.gif" alt="" className="cat-image" />
        </div>
      </section>

      {/* ===== About Section (baru) ===== */}
      <section id="about" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.25rem 4rem' }}>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 700, letterSpacing: '-.02em', color: '#fff' }}>About</h2>
        <p
          style={{
            marginTop: '1rem',
            fontSize: '1.05rem',
            lineHeight: 1.8,
            color: 'rgba(255,255,255,.9)',
            maxWidth: 900,
          }}
        >
          I’m a Software Engineer specializing in ERP development for construction projects. I’ve shipped modules for RAP
          budgeting, MTO, PR→PO, and cost control that bridge engineering and commercial teams. I’m expanding into ERP
          Functional / SAP—combining technical depth with process design to help companies automate, cut cycle times, and
          make faster decisions.
        </p>

        {/* Highlights */}
        <div
          style={{
            marginTop: '1.25rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
            gap: '14px',
          }}
        >
          {[
            { t: 'RAP vs PO Comparison', d: 'Clear variance tracking → faster quote→approval (~30%).' },
            { t: 'MTO → PR Automation', d: 'Auto stock checks to prevent unnecessary purchases.' },
            { t: 'Cost Target Module', d: 'Real-time budget vs actuals for project teams.' },
            { t: 'Rollout & Enablement', d: 'UI + training; reduced manual Excel handoffs.' },
          ].map((item) => (
            <div
              key={item.t}
              style={{
                borderRadius: 16,
                border: '1px solid rgba(255,255,255,.12)',
                background: 'rgba(255,255,255,.05)',
                padding: '14px 16px',
                backdropFilter: 'blur(6px)',
              }}
            >
              <div style={{ fontWeight: 600, color: '#e8faff' }}>{item.t}</div>
              <div style={{ marginTop: 6, color: 'rgba(255,255,255,.85)', fontSize: '.98rem' }}>{item.d}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Hero;
