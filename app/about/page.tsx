'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import Image from 'next/image';
import { useRef } from 'react';
import { CheckCircle2, Award, Users, Flame } from 'lucide-react';

const ParallaxImage = ({ src, alt }: { src: string; alt: string }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  // Subtle parallax translation
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <div ref={ref} className="relative h-full min-h-[400px] md:min-h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl bg-zinc-900">
      <motion.div style={{ y }} className="absolute inset-x-0 -top-[15%] -bottom-[15%]">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          referrerPolicy="no-referrer"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-zinc-950/30" />
      </motion.div>
    </div>
  );
};

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-zinc-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header content */}
        <div className="text-center mb-20 animate-fade-in-up">
          <span className="text-orange-500 font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Uncover the Secret</span>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white uppercase mb-6 text-balance">
            Our <span className="text-orange-500">Story</span>
          </h1>
          <p className="text-neutral-400 max-w-2xl mx-auto font-light">
            Discover the passion, the people, and the pioneering spirit that reinvented the live grill experience.
          </p>
        </div>

        <div className="space-y-32">
          {/* Section 1: Core Story */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-display uppercase text-white mb-6">The <span className="text-orange-500">Beginning</span></h2>
              <div className="space-y-6 text-neutral-400 text-lg font-light leading-relaxed">
                <p>
                  Founded in 2006, Barbeque Nation was built on a simple yet revolutionary idea: putting the control of dining back into the guests&apos; hands. We introduced the concept of the live grill embedded directly in dining tables.
                </p>
                <p>
                  What started as a single restaurant has grown into a phenomenon. Combining the warmth of a barbecue with the variety of a lavish buffet, we transformed how people celebrate their special moments.
                </p>
              </div>
            </motion.div>
            <div className="h-full">
              <ParallaxImage 
                src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Restaurant Atmosphere" 
              />
            </div>
          </section>

          {/* Section 2: Why Choose Us (Alternating) */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
             <div className="order-2 lg:order-1 h-full">
              <ParallaxImage 
                src="https://images.unsplash.com/photo-1555243896-c709bfa0b564?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Culinary Process" 
              />
            </div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="order-1 lg:order-2"
            >
              <h2 className="text-4xl font-display uppercase text-white mb-8">Why <span className="text-orange-500">Choose Us</span></h2>
              
              <div className="space-y-8">
                <div className="flex gap-6 items-start">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-orange-950/50 flex items-center justify-center border border-orange-900">
                    <Flame className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display uppercase text-white mb-2">Live Grills at Your Table</h3>
                    <p className="text-neutral-400 font-light">Experience the thrill of grilling your own starters just the way you like them, served hot and fresh.</p>
                  </div>
                </div>
                
                <div className="flex gap-6 items-start">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-orange-950/50 flex items-center justify-center border border-orange-900">
                    <Award className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display uppercase text-white mb-2">Premium Quality Meats</h3>
                    <p className="text-neutral-400 font-light">We source only the finest, freshest ingredients and marinate them to perfection using our secret spice blends.</p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-orange-950/50 flex items-center justify-center border border-orange-900">
                    <Users className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display uppercase text-white mb-2">Unmatched Hospitality</h3>
                    <p className="text-neutral-400 font-light">Our staff is dedicated to making every meal a celebration, ensuring your plate is never empty and your glass is always full.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Section 3: Chef Highlights */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-display uppercase text-white mb-6">The Culinary <span className="text-orange-500">Masters</span></h2>
              <div className="space-y-6 text-neutral-400 text-lg font-light leading-relaxed">
                <p>
                  Behind every smoky, sizzling bite is a team of passionate culinary artists. Our head chefs bring decades of global experience, combining traditional barbecue techniques with bold, avant-garde flavors.
                </p>
                <div className="bg-zinc-900/50 p-6 border-l-4 border-orange-500 rounded-r-lg italic my-8">
                  &quot;Cooking with fire is primal. We take that raw element and elevate it with complex marinades, creating an interactive journey your palate won&apos;t forget.&quot; 
                  <span className="block mt-4 text-sm font-display text-white uppercase not-italic">— Executive Chef, Marcus</span>
                </div>
                <p>
                  We are constantly innovating, bringing seasonal specials and regional delicacies to your table to ensure your experience is always evolving.
                </p>
              </div>
            </motion.div>
            <div className="h-full">
              <ParallaxImage 
                src="https://images.unsplash.com/photo-1577219491135-ce39b730d4be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Executive Chef" 
              />
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}
