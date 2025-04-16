import React from 'react';
import { motion } from "framer-motion";

const Resources = () => {
  return (
    <div className="container mx-auto p-8 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-rose-400 to-pink-500 text-white p-10 rounded-lg shadow-lg mb-10"
      >
        <h1 className="text-5xl font-bold text-center mb-4">Pet Care Resources</h1>
        <p className="text-center text-lg">
          Everything you need to know about caring for your pet
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
          <h2 className="text-2xl font-semibold mb-4 border-b-2 border-rose-400 inline-block">New Pet Owner Guide</h2>
          <ul className="space-y-2">
            <li>• First-time pet owner essentials</li>
            <li>• Pet-proofing your home</li>
            <li>• Basic training tips</li>
            <li>• Feeding guidelines</li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
        >
          <h2 className="text-2xl font-semibold mb-4 border-b-2 border-rose-400 inline-block">Healthcare</h2>
          <ul className="space-y-2">
            <li>• Vaccination schedules</li>
            <li>• Common health issues</li>
            <li>• Emergency care information</li>
            <li>• Finding a veterinarian</li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
        >
          <h2 className="text-2xl font-semibold mb-4 border-b-2 border-rose-400 inline-block">Pet Behavior</h2>
          <ul className="space-y-2">
            <li>• Understanding pet body language</li>
            <li>• Dealing with anxiety</li>
            <li>• Socialization tips</li>
            <li>• Problem behavior solutions</li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
        >
          <h2 className="text-2xl font-semibold mb-4 border-b-2 border-rose-400 inline-block">Community Support</h2>
          <ul className="space-y-2">
            <li>• Local pet services</li>
            <li>• Pet-friendly locations</li>
            <li>• Support groups</li>
            <li>• Emergency contacts</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default Resources;