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
      <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto">
        {!submitted ? (
          <motion.form
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full"
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
              className={`w-full sm:flex-1 px-3 sm:px-4 py-2 sm:py-3 email-field border rounded-sm focus:outline-none transition-all text-sm sm:text-base ${
                validateEmail(email)
                  ? "border-green-500 focus:ring-green-500 focus:ring-2"
                  : "border-gray-300 focus:ring-gray-300 focus:ring-2"
              }`}
            />
            <button
              type="submit"
              className="w-2/3 sm:w-auto bg-yellow-400 text-black font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-2xl hover:bg-yellow-300 transition-all duration-200 font-bebas tracking-wider text-base sm:text-lg uppercase focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed max-w-xs"
              disabled={!validateEmail(email)}
            >
              Subscribe
            </button>
          </motion.form>
        ) : (
          <motion.div
            className="text-lg sm:text-xl font-semibold text-green-600 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Thank you for subscribing!
          </motion.div>
        )}
      </div>
    );
};

export default NewsletterSignup; 