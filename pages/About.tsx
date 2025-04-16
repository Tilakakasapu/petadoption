import React from 'react';
import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="container mx-auto p-8 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-rose-400 to-pink-500 text-white p-10 rounded-lg shadow-lg mb-10"
      >
        <h1 className="text-5xl font-bold text-center mb-4">About Us</h1>
        <p className="text-center text-lg">
          We connect pets with loving homes, creating a world filled with compassion and second chances.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
        >
          <h2 className="text-2xl font-semibold mb-4 border-b-2 border-rose-400 inline-block">Who We Are</h2>
          <p className="text-lg leading-relaxed">
            Welcome to [Pet Adoption], a platform dedicated to connecting loving homes with pets in need. 
            Our mission is to make pet adoption easier, transparent, and accessible for everyone.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
        >
          <h2 className="text-2xl font-semibold mb-4 border-b-2 border-rose-400 inline-block">Our Mission</h2>
          <p className="text-lg leading-relaxed">
            We believe that every pet deserves a second chance at happiness. Our goal is to reduce 
            the number of homeless animals and ensure that each pet finds a safe, loving home.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
        >
          <h2 className="text-2xl font-semibold mb-4 border-b-2 border-rose-400 inline-block">What We Do</h2>
          <ul className="text-lg leading-relaxed space-y-2">
            <li>🐾 <strong>Adoption Listings:</strong> Browse a wide range of adoptable pets</li>
            <li>🏡 <strong>Rehoming Assistance:</strong> Helping individuals find responsible adopters</li>
            <li>❤️ <strong>Rescue & Shelter Support:</strong> Partnering with shelters and rescue groups</li>
            <li>📚 <strong>Pet Care Resources:</strong> Offering guidance on pet care and training</li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
        >
          <h2 className="text-2xl font-semibold mb-4 border-b-2 border-rose-400 inline-block">Contact Us</h2>
          <div className="text-lg leading-relaxed space-y-2">
            <p>📍 <strong>Address:</strong> Rgukt</p>
            <p>📞 <strong>Phone:</strong> 7989487951</p>
            <p>📧 <strong>Email:</strong> gummallajhansi22@gmail.com</p>
            <p>🌐 <strong>Website:</strong> [Your Website URL]</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;