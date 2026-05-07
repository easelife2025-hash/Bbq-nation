'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Star, Clock, ChefHat, Flame, Award, Users } from 'lucide-react';
import { useState, useEffect } from 'react';

const offers = [
  "🔥 20% OFF ON CORPORATE BOOKINGS",
  "🥩 UNLIMITED LUNCH BUFFET @ ₹899",
  "🎉 BIRTHDAY SPECIAL: COMPLIMENTARY CAKE",
  "🍻 HAPPY HOURS: 1+1 ON BEVERAGES",
  "🔥 20% OFF ON CORPORATE BOOKINGS", // Repeated for infinite scroll illusion
];

const testimonials = [
  { name: "Sarah M.", role: "Food Critic", text: "The perfect blend of interactive dining and exceptional flavors. A must-visit!" },
  { name: "James D.", role: "Regular Guest", text: "The live grill concept never gets old. The quality of meat is consistently top-notch." },
  { name: "Priya R.", role: "Local Guide", text: "Amazing ambiance and the service is incredibly fast considering the unlimited nature." },
  { name: "Arjun K.", role: "Food Blogger", text: "The mocktails and the perfectly charred chicken tikka were the highlights of my evening." },
  { name: "Emily S.", role: "Tourist", text: "A great culinary experience! The desserts were heavenly, especially the sizzling brownie." },
  { name: "Rahul T.", role: "Regular Guest", text: "I've celebrated all my family birthdays here. The staff makes every occasion feel special." },
  { name: "Fatima Z.", role: "Google Guide", text: "Unlimited food, great music, and friendly staff. Worth every penny spent here." },
  { name: "Wei C.", role: "Chef", text: "The marinades are incredibly authentic and the DIY grill is such a fun concept for group dinners." },
  { name: "Sanjay M.", role: "Corporate Guest", text: "We hosted our team lunch here. Excellent service and the buffet spread was just extraordinary." },
  { name: "Linda K.", role: "Traveler", text: "Found this gem while touring the city. The appetizers alone are worth the visit. Highly recommended!" },
  { name: "Omar H.", role: "Food Critic", text: "A truly immersive dining experience. The attention to detail in their spice blends is remarkable." }
];

export default function Home() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Zoom Animation */}
        <motion.div 
          className="absolute inset-0 z-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
        >
          <Image
            src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Grilled Meat on Fire"
            fill
            className="object-cover"
            priority
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/40" />
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="flex flex-col items-center gap-6"
          >
            <h1 className="text-6xl md:text-8xl font-display font-bold text-white uppercase leading-[0.9] tracking-tight">
              Live the <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-300">Grill Experience</span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-300 max-w-2xl mt-4 font-light text-balance">
              Experience the ultimate buffet and table-top grilling. Premium cuts, expertly marinated, and cooked exactly how you like it.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <Link
                href="/book"
                className="px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold tracking-widest uppercase rounded-sm transition-all duration-300 shadow-[0_0_20px_rgba(234,88,12,0.4)] hover:shadow-[0_0_30px_rgba(234,88,12,0.6)]"
              >
                Book Table
              </Link>
              <Link
                href="/menu"
                className="px-8 py-4 bg-transparent border border-white/20 hover:bg-white/10 text-white font-bold tracking-widest uppercase rounded-sm transition-all text-center flex items-center gap-2"
              >
                View Menu <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. Offers Section (Animated Banner) */}
      <div className="bg-orange-600 overflow-hidden py-3 whitespace-nowrap border-y border-orange-500/50">
        <motion.div
          className="inline-block text-white font-bold tracking-widest uppercase text-sm"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 20
          }}
        >
          {offers.map((offer, idx) => (
            <span key={idx} className="mx-8">{offer}</span>
          ))}
          {offers.map((offer, idx) => (
            <span key={`dup-${idx}`} className="mx-8">{offer}</span>
          ))}
        </motion.div>
      </div>

      {/* 2. Live Grill Experience Section */}
      <section className="py-24 bg-zinc-950 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="text-orange-500 font-bold tracking-[0.2em] uppercase text-xs mb-4 block">How it works</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white uppercase">
              The <span className="text-orange-500">Experience</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center pt-8">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.5 }}
             whileHover={{ y: -10 }}
             className="bg-zinc-900/50 p-10 rounded-xl border border-zinc-800 hover:border-orange-500/50 transition-colors group"
           >
             <div className="w-16 h-16 mx-auto rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(234,88,12,0)] group-hover:shadow-[0_0_15px_rgba(234,88,12,0.3)]">
               <Flame className="w-8 h-8" />
             </div>
             <h3 className="text-2xl font-display text-white uppercase mb-4">Live Table Grills</h3>
             <p className="text-neutral-500 text-sm">Become your own chef, grilling an array of endless skewers exactly to your liking right at your table.</p>
           </motion.div>
           
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.5, delay: 0.1 }}
             whileHover={{ y: -10 }}
             className="bg-zinc-900/50 p-10 rounded-xl border border-zinc-800 hover:border-orange-500/50 transition-colors group"
           >
             <div className="w-16 h-16 mx-auto rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(234,88,12,0)] group-hover:shadow-[0_0_15px_rgba(234,88,12,0.3)]">
               <Award className="w-8 h-8" />
             </div>
             <h3 className="text-2xl font-display text-white uppercase mb-4">Lavish Buffet</h3>
             <p className="text-neutral-500 text-sm">Complement your grilled starters with our main course buffet featuring global cuisines and rich flavors.</p>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.5, delay: 0.2 }}
             whileHover={{ y: -10 }}
             className="bg-zinc-900/50 p-10 rounded-xl border border-zinc-800 hover:border-orange-500/50 transition-colors group"
           >
             <div className="w-16 h-16 mx-auto rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(234,88,12,0)] group-hover:shadow-[0_0_15px_rgba(234,88,12,0.3)]">
               <Users className="w-8 h-8" />
             </div>
             <h3 className="text-2xl font-display text-white uppercase mb-4">Unending Feasts</h3>
             <p className="text-neutral-500 text-sm">Unlimited portions served with endless hospitality. Gather your family and friends for a joyous meal.</p>
           </motion.div>
        </div>
        </div>
      </section>

      {/* 3. Popular Dishes Grid */}
      <section className="py-24 bg-zinc-900 border-y border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
             <span className="text-orange-500 font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Crowd Favorites</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white uppercase mb-6">
              Popular <span className="text-orange-500">Dishes</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Chicken Tikka",
                desc: "Classic tandoori marinated chicken, charred over open flames.",
                img: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              },
              {
                title: "Mutton Seekh Kebab",
                desc: "Minced lamb infused with aromatic spices, grilled to perfection.",
                img: "https://images.unsplash.com/photo-1558030006-450675393462?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              },
              {
                title: "Paneer Tikka",
                desc: "Soft cottage cheese blocks with bell peppers in spicy marinade.",
                img: "https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="group cursor-pointer bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800 transition-all duration-300 hover:border-orange-500 hover:shadow-[0_0_30px_rgba(234,88,12,0.4)]"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
                </div>
                <div className="p-6 relative bg-zinc-950 z-10 text-center">
                  <h3 className="text-xl font-display font-bold text-white uppercase mb-2 group-hover:text-orange-500 transition-colors">{item.title}</h3>
                  <p className="text-neutral-400 text-sm max-w-[250px] mx-auto">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
             <Link
                href="/menu"
                className="inline-flex items-center gap-2 px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold tracking-widest uppercase rounded-sm transition-all"
              >
                Explore Full Menu <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
          </div>
        </div>
      </section>

      {/* 5. Testimonials (Auto Sliding Carousel) */}
      <section className="py-32 bg-zinc-950 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center relative z-10">
          <div className="mb-12 flex justify-center text-orange-500">
             <Star className="w-8 h-8 fill-orange-500" />
             <Star className="w-8 h-8 fill-orange-500" />
             <Star className="w-8 h-8 fill-orange-500" />
             <Star className="w-8 h-8 fill-orange-500" />
             <Star className="w-8 h-8 fill-orange-500" />
          </div>
          
          <div className="relative h-48 flex items-center justify-center">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 50, position: 'absolute' }}
                animate={{ 
                  opacity: currentTestimonial === idx ? 1 : 0, 
                  x: currentTestimonial === idx ? 0 : currentTestimonial > idx ? -50 : 50,
                  pointerEvents: currentTestimonial === idx ? 'auto' : 'none'
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="w-full"
              >
                <p className="text-2xl md:text-3xl font-light text-white italic mb-8 leading-relaxed">
                  &quot;{testimonial.text}&quot;
                </p>
                <div>
                  <h4 className="text-orange-500 font-bold uppercase tracking-widest text-sm">{testimonial.name}</h4>
                  <p className="text-neutral-500 text-xs uppercase tracking-wider mt-1">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center gap-3 mt-12">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentTestimonial(idx)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentTestimonial === idx ? 'bg-orange-500' : 'bg-zinc-800'
                }`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* Decorative Background Elements */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-orange-900/10 blur-[100px] rounded-full point-events-none" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-orange-900/10 blur-[100px] rounded-full point-events-none" />
      </section>
    </div>
  );
}

