import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">
            About <span className="text-indigo-600">Voltx</span> Technologies
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-600 leading-relaxed">
            Empowering businesses with cutting-edge technology solutions tailored for tomorrow's challenges.
          </p>
        </div>

        <div className="mt-20 space-y-8">
          {/* Our Story */}
          <div className="about-card">
            <div className="about-card-header">
              <h3 className="about-card-title">Our Story</h3>
            </div>
            <div className="p-6">
              <div className="prose prose-lg text-gray-700">
                <p className="mb-4">
                  Founded in 2020, Voltx Technologies has been at the forefront of digital transformation, 
                  helping businesses leverage technology to solve complex challenges and drive sustainable growth.
                </p>
                <p className="mb-4">
                  Our team of experienced developers, designers, and strategists collaborate to deliver 
                  innovative solutions that are precisely tailored to your unique business requirements.
                </p>
                <p>
                  We pride ourselves on building lasting partnerships with our clients by consistently delivering 
                  exceptional value through our products and services.
                </p>
              </div>
            </div>
          </div>

          {/* Our Mission */}
          <div className="about-card">
            <div className="about-card-header">
              <h3 className="about-card-title">Our Mission</h3>
            </div>
            <div className="p-6">
              <div className="prose prose-lg text-gray-700">
                <p>
                  To democratize technology by empowering businesses of all sizes with affordable, scalable, 
                  and reliable solutions that drive operational efficiency, foster innovation, and accelerate growth.
                </p>
              </div>
            </div>
          </div>

          {/* Our Team */}
          <div className="about-card">
            <div className="about-card-header">
              <h3 className="about-card-title">Our Team</h3>
            </div>
            <div className="p-6">
              <div className="prose prose-lg text-gray-700">
                <p className="mb-4">
                  We're a diverse collective of passionate technologists with deep expertise across web and mobile development, 
                  cloud architecture, AI/ML, and emerging technologies.
                </p>
                <p>
                  Our human-centered, collaborative approach ensures we deliver solutions that not only meet technical 
                  requirements but also create meaningful impact for our clients and their customers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold text-gray-800">Ready to transform your business?</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Let's discuss how Voltx Technologies can help you achieve your goals.
          </p>
          <button className="about-cta-button mt-6">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
