import './App.css';
import screenvImage from './images/screenv.png';
import fishImage from './images/fishytype.png';
import shopImage from './images/shop.png';
import marvelImage from './images/marvel.png';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ParallaxProvider } from 'react-scroll-parallax';
import { useEffect, useState, useRef } from 'react';
import Hero from './components/Hero';
import About from './components/About';
import ThemeSwitcher from './components/ThemeSwitcher';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import emailjs from '@emailjs/browser';


const projects = [
  {
    title: "ScreenV",
    description: "Movie discovery platform with real-time ratings and personalized watchlists using TMDB API.",
    image: screenvImage,
    tags: ["React", "TMDB API", "Tailwind CSS", "Context API"],
    liveUrl: "https://screenv.vercel.app/",
    sourceUrl: "https://github.com/dutaalamin/screenv",
  },
  {
    title: "Casava",
    description: "E-commerce platform with Stripe payments, user authentication, and admin dashboard.",
    image: shopImage,
    tags: ["React", "Firebase", "Stripe API", "Redux"],
    liveUrl: "https://casavastore.vercel.app/",
    sourceUrl: "https://github.com/dutaalamin/ecommerce",
  },
  {
    title: "Fishytype",
    description: "Interactive typing speed test app with multiple themes and real-time WPM tracking.",
    image: fishImage,
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Zustand"],
    liveUrl: "https://fishytype.vercel.app/",
    sourceUrl: "https://github.com/dutaalamin/FishyType",
  },
  {
    title: "Marvel Rivals",
    description: "A fan site for the 6v6 team-based game Marvel Rivals, featuring news, updates, and character guides.",
    image: marvelImage,
    tags: ["React", "JavaScript", "Next.js"],
    liveUrl: "https://marvelrivals1.vercel.app/",
    sourceUrl: "https://marvelrivals1.vercel.app/",
  }
];

function AppContent() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress);
  const [isLoading, setIsLoading] = useState(true);
  const form = useRef();
  const [showMusicModal, setShowMusicModal] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const [trackInfo] = useState({
    title: "Background Music",
    artist: "Lofi Beats"
  });
  const [activeSection, setActiveSection] = useState('home');

  // Function to handle smooth scroll
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  // Update active section based on scroll position
    useEffect(() => {
    const handleScroll = () => {
    const sections = ['home', 'about', 'projects'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    audioRef.current = new Audio('/music/music.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleMusicChoice = (choice) => {
    setShowMusicModal(false);
    if (choice && audioRef.current) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(error => {
          console.error('Error playing audio:', error);
        });
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play()
        .catch(error => {
          console.error('Error playing audio:', error);
        });
    }
    setIsPlaying(!isPlaying);
  };

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm(
      'service_1o3f1un',
      'template_876czll',
      form.current,
      'pc_TStT_UQhORjnR2'
    )
      .then((result) => {
          console.log('Message sent successfully');
          alert('Thank you! Your message has been sent.');
          e.target.reset(); // Reset form setelah berhasil
      }, (error) => {
          console.log('Failed to send message:', error);
          alert('Sorry, there was an error. Please try again.');
      });
  };

  return (
    <ParallaxProvider>
      <div className="gradient-overlay"></div>
      <div className="App">
        {/* Navbar */}
        <nav className="navbar">
          <div className="navbar-container">
            <a href="#home" className="nav-logo">
              <div className="nav-logo-photo">
                <img 
                  src={process.env.PUBLIC_URL + '/images/duta.png'} 
                  alt="Duta Alamin"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #00eaff',
                    boxShadow: '0 0 15px rgba(0, 234, 255, 0.5)'
                  }}
                />
              </div>
            </a>
            <ul className="nav-links">
              <li>
                <a
                  href="#home"
                  className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('home');
                  }}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('about');
                  }}
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#projects"
                  className={`nav-link ${activeSection === 'projects' ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('projects');
                  }}
                >
                  Projects
                </a>
              </li>
              <li className="nav-theme-item">
                <ThemeSwitcher />
              </li>
            </ul>
          </div>
        </nav>

        {/* Music Modal */}
        {showMusicModal && (
          <div className="music-modal-overlay">
            <div className="music-modal">
              <div className="music-modal-content">
                <h3>🎵 Play Music?</h3>
                <p>Would you like to play background music?</p>
                <div className="music-modal-buttons">
                  <button 
                    className="music-btn music-btn-yes"
                    onClick={() => handleMusicChoice(true)}
                  >
                    Yes
                  </button>
                  <button 
                    className="music-btn music-btn-no"
                    onClick={() => handleMusicChoice(false)}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <motion.div 
          className="progress-bar"
          style={{
            scaleX,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'var(--primary-color)',
            transformOrigin: '0%',
            zIndex: 1001
          }}
        />

        {/* Hero Section */}
        <section id="home">
          <div className="particles">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="particle" />
            ))}
          </div>
          <Hero />
        </section>

        {/* About Section */}
        <About />

        {/* Projects Section */}
        <section id="projects" className="projects-section">
          <div className="projects-container">
            <motion.div 
              className="projects-header"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2>Projects</h2>
            </motion.div>

            <div className="projects-grid">
              {projects.map((project, index) => (
                <motion.div 
                  key={index}
                  className="project-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: index * 0.3,
                    duration: 0.5,
                    ease: "easeOut"
                  }}
                  whileHover={{ 
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className="project-image-container">
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <img src={project.image} alt={project.title} className="project-image" />
                      <div className="project-overlay">
                        <div className="project-category">{project.category}</div>
                      </div>
                    </a>
                  </div>

                  <div className="project-content">
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-description">{project.description}</p>

                    <div className="project-tags">
                      {project.tags.map((tag, idx) => (
                        <span key={idx} className="project-tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="contact-section">
          <div className="contact-container">
            <h2>Get in Touch</h2>
            <form ref={form} onSubmit={sendEmail} className="contact-form">
              <input type="text" name="user_name" placeholder="Your Name" required />
              <input type="email" name="user_email" placeholder="Your Email" required />
              <textarea name="message" placeholder="Your Message" required></textarea>
              <button type="submit">Send Message</button>
            </form>
          </div>
        </section>

        <footer className="footer">
          <p>&copy; 2025 Duta Alamin. All rights reserved.</p>
        </footer>

        <audio ref={audioRef} src="/music/music.mp3" loop />
        <div className="music-player">
          <button 
            onClick={togglePlay}
            className="music-toggle"
            aria-label={isPlaying ? 'Pause Music' : 'Play Music'}
          >
            <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-music'}`}></i>
            <span className="music-label">{isPlaying ? 'Now Playing' : 'Play Music'}</span>
          </button>
        </div>
      </div>
    </ParallaxProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
