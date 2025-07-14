'use client';
import React, { useState } from "react";
import { motion } from "framer-motion";

interface NewsletterSignupProps {
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = () => {
    const [email, setEmail] = useState<string>("");
    const [submitted, setSubmitted] = useState<boolean>(false);
  
    const validateEmail = (email: string): boolean =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (validateEmail(email)) {
        setSubmitted(true);
      }
    };

    return (
      <div className="flex flex-col items-center justify-center">
        {!submitted ? (
          <motion.form
            className="flex items-center justify-around space-x-3"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <input
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`px-4 py-2 email-field border focus:outline-none transition-all ${
                validateEmail(email)
                  ? "border-green-500 focus:ring-green-500"
                  : "border-gray-300 focus:ring-gray-300"
              }`}
            />
            <button
              type="submit"
              className="bg-yellow-400 text-black font-bold py-4 px-8 rounded-2xl hover:bg-yellow-300 transition-all duration-200 font-bebas tracking-wider text-lg uppercase focus:outline-none"
              disabled={!validateEmail(email)}
            >
              Subscribe
            </button>
          </motion.form>
        ) : (
          <motion.div
            className="text-xl font-semibold text-green-600"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Thank you!
          </motion.div>
        )}
      </div>
    );
};
  
export default NewsletterSignup; 