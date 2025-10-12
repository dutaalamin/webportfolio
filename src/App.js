import './App.css';
import screenvImage from './images/screenv.png';
import fishImage from './images/fishytype.png';
import shopImage from './images/shop.png';
import marvelImage from './images/marvel.png';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ParallaxProvider } from 'react-scroll-parallax';
import { useEffect, useState, useRef } from 'react';
import Hero from './components/Hero';
import emailjs from '@emailjs/browser';
import logo from './images/logo.png'; // Add your logo image

const techStack = [
  {
    name: "JavaScript",
    logo: "https://cdn.simpleicons.org/javascript/F7DF1E",

  },
  {
    name: "React",
    logo: "https://cdn.simpleicons.org/react/61DAFB",

  },
  {
    name: "Next.js",
    logo: "https://cdn.simpleicons.org/nextdotjs/FFFFFF",

  },
  {
    name: "Node.js",
    logo: "https://cdn.simpleicons.org/nodedotjs/339933",

  },
  {
    name: "Vite",
    logo: "https://cdn.simpleicons.org/vite/646CFF",

  },
  {
    name: "Tailwind CSS",
    logo: "https://cdn.simpleicons.org/tailwindcss/06B6D4",

  },
  {
    name: "MySQL",
    logo: "https://cdn.simpleicons.org/mysql/4479A1",

  },
  {
    name: "MongoDB",
    logo: "https://cdn.simpleicons.org/mongodb/47A248",

  },
  {
    name: "Python",
    logo: "https://cdn.simpleicons.org/python/3776AB",

  },
  {
    name: "TypeScript",
    logo: "https://cdn.simpleicons.org/typescript/3178C6",

  },
  {
    name: "Firebase",
    logo: "https://cdn.simpleicons.org/firebase/FFCA28",

  },
  {
    name: "AWS",
    logo: "https://banner2.cleanpng.com/20190418/qty/kisspng-amazon-web-services-logo-cloud-computing-amazon-co-logoaws-1-itnext-summit-1713897691932.webp",

  }
];

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

function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress);
  const [isLoading, setIsLoading] = useState(true);
  const form = useRef();
  const [showMusicModal, setShowMusicModal] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [musicTracks] = useState([
    {
      id: 1,
      title: "Lofi Chill",
      artist: "Relaxing Beats",
      file: "/music/music.mp3",
      genre: "Lofi",
      duration: "3:45"
    },
    {
      id: 2,
      title: "Ambient Dreams",
      artist: "Peaceful Vibes",
      file: "/music/ambient.mp3", // Anda bisa menambahkan file ini
      genre: "Ambient",
      duration: "4:20"
    },
    {
      id: 3,
      title: "Focus Mode",
      artist: "Study Beats",
      file: "/music/focus.mp3", // Anda bisa menambahkan file ini
      genre: "Electronic",
      duration: "5:15"
    },
    {
      id: 4,
      title: "No Music",
      artist: "Silence",
      file: null,
      genre: "None",
      duration: "0:00"
    }
  ]);

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
      const sections = ['home', 'tech', 'projects'];
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

  const handleMusicChoice = (track) => {
    setShowMusicModal(false);
    setSelectedTrack(track);
    
    if (track && track.file && audioRef.current) {
      audioRef.current.src = track.file;
      audioRef.current.load();
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(error => {
          console.error('Error playing audio:', error);
        });
    } else {
      // User memilih "No Music"
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleTrackSelect = (track) => {
    setSelectedTrack(track);
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
                href="#tech"
                className={`nav-link ${activeSection === 'tech' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('tech');
                }}
              >
                Tech
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
          </ul>
        </nav>

        {/* Music Selection Modal */}
        {showMusicModal && (
          <div className="music-modal-overlay">
            <div className="music-modal music-selection-modal">
              <div className="music-modal-content">
                <h3>🎵 Choose Your Music</h3>
                <p>Select a background track for your browsing experience</p>
                
                <div className="music-tracks-list">
                  {musicTracks.map((track) => (
                    <div 
                      key={track.id}
                      className={`music-track-item ${selectedTrack?.id === track.id ? 'selected' : ''}`}
                      onClick={() => handleTrackSelect(track)}
                    >
                      <div className="track-info">
                        <div className="track-title">{track.title}</div>
                        <div className="track-artist">{track.artist}</div>
                        <div className="track-meta">
                          <span className="track-genre">{track.genre}</span>
                          <span className="track-duration">{track.duration}</span>
                        </div>
                      </div>
                      <div className="track-play-icon">
                        {track.file ? (
                          <i className="fas fa-play"></i>
                        ) : (
                          <i className="fas fa-volume-mute"></i>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="music-modal-buttons">
                  <button 
                    className="music-btn music-btn-confirm"
                    onClick={() => handleMusicChoice(selectedTrack)}
                    disabled={!selectedTrack}
                  >
                    {selectedTrack?.file ? 'Play Selected' : 'Continue Without Music'}
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

        {/* Tech Stack Section */}
        <section id="tech" className="tech-stack-section">
          <div className="container">
            <motion.div 
              className="section-header"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2>Tech Stack</h2>
            </motion.div>

            <div className="tech-grid">
              {techStack.map((tech, index) => (
                <motion.div
                  key={tech.name}
                  className="tech-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <img src={tech.logo} alt={tech.name} className="tech-logo" />
                  <h3>{tech.name}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

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

export default App;
