import './App.css';
import screenvImage from './images/screenv.png';
import fishImage from './images/fishytype.png';
import shopImage from './images/shop.png';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ParallaxProvider } from 'react-scroll-parallax';
import { useEffect, useState, useRef } from 'react';
import Hero from './components/Hero';
import emailjs from '@emailjs/browser';

const techStack = [
  {
    name: "JavaScript",
    logo: "https://cdn.simpleicons.org/javascript/F7DF1E",
    description: "Bahasa pemrograman utama untuk web development"
  },
  {
    name: "React",
    logo: "https://cdn.simpleicons.org/react/61DAFB",
    description: "Library JavaScript untuk UI"
  },
  {
    name: "Next.js",
    logo: "https://cdn.simpleicons.org/nextdotjs/FFFFFF",
    description: "Framework React untuk produksi"
  },
  {
    name: "Node.js",
    logo: "https://cdn.simpleicons.org/nodedotjs/339933",
    description: "Runtime JavaScript untuk backend"
  },
  {
    name: "Vite",
    logo: "https://cdn.simpleicons.org/vite/646CFF",
    description: "Build tool modern"
  },
  {
    name: "Tailwind CSS",
    logo: "https://cdn.simpleicons.org/tailwindcss/06B6D4",
    description: "Framework CSS utility-first"
  },
  {
    name: "MySQL",
    logo: "https://cdn.simpleicons.org/mysql/4479A1",
    description: "Database SQL"
  },
  {
    name: "MongoDB",
    logo: "https://cdn.simpleicons.org/mongodb/47A248",
    description: "Database NoSQL"
  },
  {
    name: "Python",
    logo: "https://cdn.simpleicons.org/python/3776AB",
    description: "Bahasa pemrograman serbaguna"
  },
  {
    name: "TypeScript",
    logo: "https://cdn.simpleicons.org/typescript/3178C6",
    description: "JavaScript dengan type system"
  },
  {
    name: "Firebase",
    logo: "https://cdn.simpleicons.org/firebase/FFCA28",
    description: "Platform development dari Google"
  },
  {
    name: "AWS",
    logo: "https://banner2.cleanpng.com/20190418/qty/kisspng-amazon-web-services-logo-cloud-computing-amazon-co-logoaws-1-itnext-summit-1713897691932.webp",
    description: "Platform cloud computing"
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
    title: "Fishytype",
    description: "Interactive typing speed test app with multiple themes and real-time WPM tracking.",
    image: fishImage,
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Zustand"],
    liveUrl: "https://fishytype.vercel.app/",
    sourceUrl: "https://github.com/dutaalamin/FishyType",
  },
  {
    title: "Casava",
    description: "E-commerce platform with Stripe payments, user authentication, and admin dashboard.",
    image: shopImage,
    tags: ["React", "Firebase", "Stripe API", "Redux"],
    liveUrl: "https://casavastore.vercel.app/",
    sourceUrl: "https://github.com/dutaalamin/ecommerce",
  }
];

function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress);
  const [isLoading, setIsLoading] = useState(true);
  const form = useRef();

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
            zIndex: 1000
          }}
        />

        {/* Hero Section */}
        <Hero />

        {/* Tech Stack Section */}
        <section className="tech-stack-section">
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
          <p>&copy; 2024 Duta Alamin. All rights reserved.</p>
        </footer>
      </div>
    </ParallaxProvider>
  );
}

export default App;
