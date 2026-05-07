'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Loader2, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });

    // Reset success message after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <span className="text-orange-500 font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Reach Out</span>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white uppercase mb-6">
            Get in <span className="text-orange-500">Touch</span>
          </h1>
          <p className="text-neutral-400 max-w-2xl mx-auto font-light">
            Have a question, feedback, or need help with a large booking? We are here to help. Reach out to us and we&apos;ll get back to you shortly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info & Map */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8 flex flex-col"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto">
              {/* Location */}
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-lg hover:shadow-orange-500/10 hover:border-zinc-700 transition-all duration-300">
                <div className="w-10 h-10 bg-orange-950/50 rounded-full flex items-center justify-center border border-orange-900 mb-4">
                  <MapPin className="w-4 h-4 text-orange-500" />
                </div>
                <h3 className="text-white font-display uppercase mb-1">Our Location</h3>
                <p className="text-neutral-400 text-sm font-light">123 Culinary Drive, Foodie Town, CA 90210</p>
              </div>

              {/* Phone */}
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-lg hover:shadow-orange-500/10 hover:border-zinc-700 transition-all duration-300">
                <div className="w-10 h-10 bg-orange-950/50 rounded-full flex items-center justify-center border border-orange-900 mb-4">
                  <Phone className="w-4 h-4 text-orange-500" />
                </div>
                <h3 className="text-white font-display uppercase mb-1">Call Us</h3>
                <p className="text-neutral-400 text-sm font-light">
                  <a href="tel:+15551234567" className="hover:text-orange-500 transition-colors block">+1 (555) 123-4567</a>
                  <a href="tel:+15559876543" className="hover:text-orange-500 transition-colors block">+1 (555) 987-6543</a>
                </p>
              </div>

              {/* Email */}
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-lg hover:shadow-orange-500/10 hover:border-zinc-700 transition-all duration-300">
                <div className="w-10 h-10 bg-orange-950/50 rounded-full flex items-center justify-center border border-orange-900 mb-4">
                  <Mail className="w-4 h-4 text-orange-500" />
                </div>
                <h3 className="text-white font-display uppercase mb-1">Email Us</h3>
                <p className="text-neutral-400 text-sm font-light">
                  <a href="mailto:hello@barbequenation.com" className="hover:text-orange-500 transition-colors block">hello@barbequenation.com</a>
                  <a href="mailto:reservations@barbequenation.com" className="hover:text-orange-500 transition-colors block text-xs underline decoration-zinc-700 underline-offset-2">reservations@barbequenation.com</a>
                </p>
              </div>

              {/* Hours */}
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-lg hover:shadow-orange-500/10 hover:border-zinc-700 transition-all duration-300">
                <div className="w-10 h-10 bg-orange-950/50 rounded-full flex items-center justify-center border border-orange-900 mb-4">
                  <Clock className="w-4 h-4 text-orange-500" />
                </div>
                <h3 className="text-white font-display uppercase mb-1">Opening Hours</h3>
                <p className="text-neutral-400 text-sm font-light">
                  <span className="block">Mon-Thu: 11:00 AM - 10:30 PM</span>
                  <span className="block mt-1">Fri-Sun: 11:00 AM - 11:30 PM</span>
                </p>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="flex-grow min-h-[300px] w-full bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden relative shadow-lg">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8402891185374!2d-122.40087088468153!3d37.79328897975618!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858061eb7ceea1%3A0x6eacfe34bbbfb18!2sFinancial%20District%2C%20San%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1684305886915!5m2!1sen!2sus" 
                width="100%" 
                height="100%" 
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)", position: "absolute", inset: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale contrast-125"
              ></iframe>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-zinc-900/40 p-8 md:p-10 rounded-2xl border border-zinc-800 backdrop-blur-sm shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/5 blur-[100px] rounded-full pointer-events-none" />
            <h2 className="text-3xl font-display uppercase text-white mb-2 relative z-10">Send a Message</h2>
            <p className="text-neutral-400 font-light mb-8 text-sm">Fill out the form below and our team will get back to you within 24 hours.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your Name"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3.5 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all shadow-inner placeholder:text-neutral-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3.5 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all shadow-inner placeholder:text-neutral-700"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">Subject</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3.5 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all shadow-inner appearance-none custom-select-arrow"
                >
                  <option value="" disabled>Select a subject</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Feedback">Feedback</option>
                  <option value="Careers">Careers</option>
                  <option value="Large Booking">Large Booking / Corporate Event</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="How can we help you?"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3.5 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all shadow-inner resize-none placeholder:text-neutral-700"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isSubmitted}
                className="w-full py-4 bg-orange-600 hover:bg-orange-500 disabled:bg-zinc-800 disabled:text-neutral-400 text-white font-bold tracking-widest uppercase rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(234,88,12,0.3)] hover:shadow-[0_0_25px_rgba(234,88,12,0.5)] mt-4 flex items-center justify-center gap-3 overflow-hidden relative group"
              >
                <AnimatePresence mode="wait">
                  {isSubmitting ? (
                    <motion.div
                      key="submitting"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2"
                    >
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Sending...</span>
                    </motion.div>
                  ) : isSubmitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-2 text-green-400"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Message Sent!</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="default"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 relative z-10"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                {!isSubmitting && !isSubmitted && (
                   <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
