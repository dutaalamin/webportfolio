import React, { useState } from 'react';
import { motion } from 'framer-motion';

const About = () => {
  const [activeSkillCategory, setActiveSkillCategory] = useState('Web Development');

  const skillCategories = {
    'Web Development': {
      description: 'Building modern, responsive web applications',
      skills: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'Bootstrap']
    },
    'REST API': {
      description: 'Creating robust and scalable backend services',
      skills: ['Node.js', 'Express.js', 'Laravel', 'PHP', 'Python', 'Flask', 'Django']
    },
    'AI & Machine Learning': {
      description: 'Developing intelligent solutions with ML/AI',
      skills: ['Python', 'TensorFlow', 'PyTorch', 'OpenAI API', 'Gemini AI', 'Machine Learning']
    },
    'Mobile Development': {
      description: 'Cross-platform mobile app development',
      skills: ['React Native', 'Flutter', 'Ionic', 'Mobile UI/UX']
    }
  };

  const languagesAndFrameworks = [
    'HTML', 'CSS', 'JavaScript', 'TypeScript', 'PHP', 'Python',
    'React', 'Next.js', 'Tailwind CSS', 'Bootstrap', 'Node.js',
    'Express.js', 'Laravel', 'Flask', 'Django', 'Firebase'
  ];

  const toolsAndTechnologies = [
    'Visual Studio Code', 'Git', 'Github', 'Figma', 'Vite', 'Docker',
    'Kubernetes', 'Google Cloud', 'Postman'
  ];

  const experiences = [
    {
      startDate: 'Jan 2026',
      endDate: 'Present',
      location: 'Cilegon, Indonesia',
      company: 'PT POSCO DX INDONESIA',
      role: 'Factory Automation Engineer',
      type: 'Full-time',
      description: 'Designing and implementing automation systems for factory operations. Developing and maintaining industrial automation solutions. Optimizing manufacturing processes through automation technologies.',
      technologies: ['Factory Automation', 'Industrial Automation', 'PLC Programming', 'SCADA Systems', 'Manufacturing Systems', 'Process Optimization', 'System Integration', 'Technical Engineering']
    },
    {
      startDate: 'Jan 2025',
      endDate: 'Oct 2025',
      location: 'Jakarta, Indonesia',
      company: 'PT. KARUNIA BERCA INDONESIA',
      role: 'Software Engineer',
      type: 'Contract',
      description: 'Development & Customization: Building and customizing ERP modules to meet specific company requirements. System Integration: Integrating various business systems and ensuring seamless data flow. Problem Solving: Identifying and resolving technical issues in existing systems.',
      technologies: ['PHP', 'Java', 'ERP', 'System Integration', 'Database Management', 'Problem Solving', 'Software Development', 'Customization', 'Business Analysis', 'Technical Support', 'API Development', 'System Architecture']
    },
    {
      startDate: 'Sep 2024',
      endDate: 'Dec 2024',
      location: 'Remote',
      company: 'Appen',
      role: 'AI Engineer',
      type: 'Freelance',
      description: 'Contributed to the improvement of multilingual AI systems by annotating and translating text-to-speech (TTS) datasets used for training and fine-tuning speech models. Worked on data quality assurance and validation for machine learning projects.',
      technologies: ['Artificial Intelligence (AI)', 'Analytical Skills', 'Machine Learning', 'Data Annotation', 'Text-to-Speech', 'Natural Language Processing', 'Data Quality Assurance']
    },
    {
      startDate: 'Oct 2023',
      endDate: 'Mar 2024',
      location: 'Yogyakarta, Indonesia',
      company: 'BPPTKG',
      role: 'Bachelor Thesis',
      type: 'Hybrid',
      description: 'I developed a deep learning model using Convolutional Neural Network (CNN) to classify images of Mount Merapi captured in different environmental and volcanic conditions. The goal was to explore how convolutional neural networks can be used for volcanic activity monitoring and early warning systems.',
      technologies: ['Python (Programming Language)', 'Convolutional Neural Networks (CNN)', 'Deep Learning', 'Image Classification', 'Computer Vision', 'TensorFlow', 'Data Analysis']
    },
    {
      startDate: 'Aug 2022',
      endDate: 'Sep 2022',
      location: 'Cilegon, Banten, Indonesia',
      company: 'PT Indorama Polypet Indonesia',
      role: 'Information Technology Intern',
      type: 'Internship',
      description: 'Assisted in IT infrastructure maintenance and support. Worked on database management and system administration tasks. Participated in troubleshooting and technical support activities.',
      technologies: ['Databases', 'Analytical Skills', 'System Administration', 'IT Support', 'Technical Troubleshooting']
    }
  ];

  const education = {
    period: '2019 - 2023',
    institution: 'Universitas Pembangunan Nasional Veteran Yogyakarta',
    degree: 'Bachelor\'s degree, Informatics',
    type: 'University',
    description: 'Completed Bachelor\'s degree in Informatics with focus on software engineering, artificial intelligence, and system development. Gained comprehensive knowledge in programming, database management, and software architecture.',
    gpa: ''
  };


  return (
    <section id="about" className="about-section">
      <div className="about-container">
        {/* Who Am I Section */}
        <motion.div
          className="who-am-i-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="who-am-i-container">
            {/* Left Section - Images */}
            <div className="who-am-i-images">
              <h2>About Me</h2>
              <div className="image-collage">
                <img 
                  src={process.env.PUBLIC_URL + '/images/duta.png'} 
                  alt="Duta Alamin"
                  className="main-image"
                />
                <img 
                  src={process.env.PUBLIC_URL + '/images/duta.png'} 
                  alt="Duta Alamin"
                  className="overlay-image-1"
                />
                <img 
                  src={process.env.PUBLIC_URL + '/images/duta.png'} 
                  alt="Duta Alamin"
                  className="overlay-image-2"
                />
              </div>
            </div>

            {/* Right Section - Text */}
            <div className="who-am-i-text">
              <h3>Duta Alamin</h3>
              <p>
                I’m a <strong>Software Engineer</strong> with a strong interest in how technology connects business, operations, and industrial environments. 
                My background spans <strong>ERP systems</strong>, <strong>IT business processes</strong>, and <strong>factory automation</strong>, allowing me to see problems from both technical and operational perspectives. 
                I enjoy building practical solutions, improving workflows, and continuously sharpening my skills through real-world challenges.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Skills & Expertise Section */}
        <motion.div
          className="skills-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2>Skills & Expertise</h2>
          <p className="skills-intro">Explore my technical skills across different domains. Click on any category to see the specific technologies and tools I work with.</p>
          
          <div className="skill-categories">
            {Object.keys(skillCategories).map((category) => (
              <button
                key={category}
                className={`skill-category-btn ${activeSkillCategory === category ? 'active' : ''}`}
                onClick={() => setActiveSkillCategory(category)}
              >
                <h3>{category}</h3>
                <p>{skillCategories[category].description}</p>
              </button>
            ))}
          </div>

          <div className="active-skills">
            {skillCategories[activeSkillCategory].skills.map((skill, idx) => (
              <span key={idx} className="skill-tag">{skill}</span>
            ))}
          </div>

          <div className="technologies-section">
            <div className="tech-group">
              <h3>Languages & Frameworks</h3>
              <div className="tech-tags">
                {languagesAndFrameworks.map((tech, idx) => (
                  <span key={idx} className="tech-tag">{tech}</span>
                ))}
              </div>
            </div>

            <div className="tech-group">
              <h3>Tools & Technologies</h3>
              <div className="tech-tags">
                {toolsAndTechnologies.map((tool, idx) => (
                  <span key={idx} className="tech-tag">{tool}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Professional Experience Section */}
        <motion.div
          className="experience-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2>Professional Experience</h2>
          <div className="experience-timeline">
            {experiences.map((exp, idx) => (
              <div key={idx} className="experience-item">
                <div className="timeline-marker">
                  <div className="timeline-date">
                    <div>{exp.startDate}</div>
                    <div className="timeline-label">Start</div>
                  </div>
                  <div className="timeline-date">
                    <div>{exp.endDate}</div>
                    <div className="timeline-label">End</div>
                  </div>
                  <div className="timeline-location">{exp.location}</div>
                </div>
                <div className="experience-card">
                  <h3>{exp.company}</h3>
                  <h4>{exp.role} • {exp.type}</h4>
                  <p>{exp.description}</p>
                  <div className="experience-tech">
                    {exp.technologies.map((tech, techIdx) => (
                      <span key={techIdx} className="exp-tech-tag">{tech}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Education Section */}
        <motion.div
          className="education-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2>Education</h2>
          <div className="education-card">
            <div className="education-period">{education.period}</div>
            <h3>{education.institution}</h3>
            <h4>{education.degree}</h4>
            <div className="education-type">{education.type}</div>
            <p className="education-description">{education.description}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;

