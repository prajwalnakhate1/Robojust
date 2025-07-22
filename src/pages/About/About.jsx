import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiTrendingUp, FiLayers, FiAward } from 'react-icons/fi';
import './About.css';

const About = () => {
  const features = [
    {
      icon: <FiTrendingUp className="feature-icon" />,
      title: "Progressive Approach",
      content: "We stay ahead of industry trends to deliver future-proof solutions",
      color: "bg-gradient-to-br from-teal-500 to-emerald-600"
    },
    {
      icon: <FiLayers className="feature-icon" />,
      title: "Full-Cycle Development",
      content: "From concept to deployment and beyond - we handle it all",
      color: "bg-gradient-to-br from-blue-500 to-indigo-600"
    },
    {
      icon: <FiAward className="feature-icon" />,
      title: "Quality Assurance",
      content: "Rigorous testing protocols ensure flawless performance",
      color: "bg-gradient-to-br from-purple-500 to-violet-600"
    }
  ];

  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="hero-content"
        >
          <h1 className="hero-title">
            About <span className="text-gradient">Robojust</span>
          </h1>
          <p className="hero-subtitle">
            We transform complex challenges into elegant digital solutions through innovative technology and strategic thinking.
          </p>
        </motion.div>
        <div className="hero-pattern"></div>
      </section>

      {/* Core Features */}
      <section className="features-section">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <h2 className="section-title">Our Methodology</h2>
          <p className="section-description">
            A proven framework that delivers exceptional results
          </p>
        </motion.div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              viewport={{ once: true }}
              className={`feature-card ${feature.color}`}
            >
              <div className="feature-icon-container">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-content">{feature.content}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <div className="story-content">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="story-text"
          >
            <h2 className="story-title">Our Journey</h2>
            <p className="story-paragraph">
              Founded in 2020, Robojust began as a small team of passionate technologists with a shared vision: to build digital solutions that make a real impact.
            </p>
            <p className="story-paragraph">
              Today, we've grown into a full-service technology partner for businesses worldwide, but we've never lost our commitment to personalized service and technical excellence.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="story-visual"
          >
            <div className="visual-element"></div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="cta-container"
        >
          <h2 className="cta-title">Ready to Build Something Remarkable?</h2>
          <p className="cta-description">
            Let's discuss how we can bring your vision to life with our technical expertise.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cta-button"
          >
            Start Your Project <FiArrowRight className="button-icon" />
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
};

export default About;
