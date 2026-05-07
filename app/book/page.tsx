'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, Calendar, Clock, Users, User, Phone, MessageSquare, LogIn } from 'lucide-react';
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';
import { firestore } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '@/components/auth-provider';

import Link from 'next/link';

interface BookingFormData {
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  notes: string;
}

export default function BookTablePage() {
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    notes: ''
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    // Basic init or fetch if needed
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to book a table.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      let normalizedPhone = formData.phone.trim().replace(/\s+/g, '');
      if (/^\d{10}$/.test(normalizedPhone)) {
        normalizedPhone = '+91' + normalizedPhone;
      }

      const newBooking = {
        id: Math.random().toString(36).substring(2, 10),
        userId: user.uid,
        ...formData,
        phone: normalizedPhone,
        status: 'Pending',
        createdAt: new Date().toISOString()
      };

      if (!firestore) {
         throw new Error("Database connection not running");
      }

      const addPromise = addDoc(collection(firestore, 'bookings'), newBooking);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Timeout: It looks like the Firestore Database hasn't been created yet. Please go to your Firebase Console -> Build -> Firestore Database and click 'Create database'.")), 10000)
      );

      await Promise.race([addPromise, timeoutPromise]);
      
      setIsSubmitted(true);
      
      // Reset form
      setFormData({
        name: '',
        phone: '',
        date: '',
        time: '',
        guests: '2',
        notes: ''
      });
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Failed to book table. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-zinc-950">
      <Toaster position="top-right" />
      <AnimatePresence mode="wait">
        {isSubmitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center justify-center min-h-[60vh]"
          >
            <div className="text-center p-12 bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg mx-auto shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
              >
                <CheckCircle2 className="w-24 h-24 text-orange-500 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(234,88,12,0.5)]" />
              </motion.div>
              <h2 className="text-3xl font-display font-bold text-white uppercase mb-4 relative z-10">Table Reserved!</h2>
              <p className="text-neutral-400 mb-8 font-light relative z-10 text-balance">
                Your booking has been confirmed. Get ready for an epic live grill experience. We can&apos;t wait to host you!
              </p>
              <div className="flex gap-4 justify-center">
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="relative z-10 px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-bold tracking-widest uppercase rounded-md transition-all border border-zinc-700 hover:border-zinc-500"
                >
                  Book Again
                </button>
              </div>
            </div>
          </motion.div>
        ) : !user ? (
          <motion.div
            key="auth"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center justify-center min-h-[60vh] px-6"
          >
            <div className="max-w-xl mx-auto text-center relative z-10 border border-zinc-800 bg-zinc-900/40 backdrop-blur-md p-10 rounded-2xl shadow-xl">
              <div className="w-16 h-16 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <LogIn className="w-6 h-6 text-orange-500" />
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold tracking-wider uppercase mb-4 text-white">
                Log In <span className="text-orange-500">First</span>
              </h1>
              <p className="text-neutral-400 text-lg mb-8">
                To reserve a table, please log in or create an account with us.
              </p>
              <Link
                href="/login?redirect=/book"
                className="inline-block px-8 py-4 w-full sm:w-auto bg-orange-600 hover:bg-orange-500 text-white font-bold tracking-widest uppercase rounded-sm transition-all duration-300 shadow-[0_0_20px_rgba(234,88,12,0.4)]"
              >
                Log In to Continue
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16"
          >
            {/* Left Side: Form */}
            <div className="bg-zinc-900/40 p-8 md:p-10 rounded-2xl border border-zinc-800 backdrop-blur-sm shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/5 blur-[100px] rounded-full pointer-events-none" />
              
              <span className="text-orange-500 font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Reservations</span>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white uppercase mb-8">
                Book Your <span className="text-orange-500">Table</span>
              </h1>

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Date Input */}
                  <motion.div 
                    animate={{ scale: focusedField === 'date' ? 1.02 : 1 }}
                    className="space-y-2 relative"
                  >
                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                      <Calendar className="w-3 h-3" /> Date
                    </label>
                    <input 
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('date')}
                      onBlur={() => setFocusedField(null)}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3.5 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all shadow-inner"
                    />
                  </motion.div>

                  {/* Time Input */}
                  <motion.div
                    animate={{ scale: focusedField === 'time' ? 1.02 : 1 }}
                    className="space-y-2 relative"
                  >
                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                      <Clock className="w-3 h-3" /> Time
                    </label>
                    <select 
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('time')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3.5 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all shadow-inner appearance-none custom-select-arrow"
                    >
                      <option value="" disabled>Select Time</option>
                      <option value="12:00">12:00 PM (Lunch)</option>
                      <option value="13:00">01:00 PM (Lunch)</option>
                      <option value="14:00">02:00 PM (Lunch)</option>
                      <option value="19:00">07:00 PM (Dinner)</option>
                      <option value="20:00">08:00 PM (Dinner)</option>
                      <option value="21:00">09:00 PM (Dinner)</option>
                    </select>
                  </motion.div>
                </div>

                {/* Guests Input */}
                <motion.div
                   animate={{ scale: focusedField === 'guests' ? 1.01 : 1 }}
                   className="space-y-2 relative"
                >
                  <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                    <Users className="w-3 h-3" /> Number of Guests
                  </label>
                  <select 
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('guests')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3.5 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all shadow-inner appearance-none custom-select-arrow"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i} value={i + 1}>{i + 1} Person{i > 0 ? 's' : ''}</option>
                    ))}
                    <option value="10+">10+ (Corporate/Party)</option>
                  </select>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <motion.div
                    animate={{ scale: focusedField === 'name' ? 1.02 : 1 }}
                    className="space-y-2 relative"
                  >
                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                      <User className="w-3 h-3" /> Full Name
                    </label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      required
                      placeholder="John Doe"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3.5 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all shadow-inner placeholder:text-neutral-700"
                    />
                  </motion.div>
                  
                  {/* Phone Input */}
                  <motion.div
                    animate={{ scale: focusedField === 'phone' ? 1.02 : 1 }}
                    className="space-y-2 relative"
                  >
                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                      <Phone className="w-3 h-3" /> Phone Number
                    </label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField(null)}
                      required
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3.5 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all shadow-inner placeholder:text-neutral-700"
                    />
                  </motion.div>
                </div>

                {/* Special Requests */}
                <motion.div
                  animate={{ scale: focusedField === 'notes' ? 1.01 : 1 }}
                  className="space-y-2 relative"
                >
                  <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                    <MessageSquare className="w-3 h-3" /> Special Requests <span className="text-neutral-600 normal-case tracking-normal">(Optional)</span>
                  </label>
                  <textarea 
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('notes')}
                    onBlur={() => setFocusedField(null)}
                    rows={3}
                    placeholder="Anniversary, Birthday, Allergies..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3.5 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all shadow-inner resize-none placeholder:text-neutral-700"
                  ></textarea>
                </motion.div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-orange-600 hover:bg-orange-500 disabled:bg-orange-600/50 text-white font-bold tracking-widest uppercase rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(234,88,12,0.3)] hover:shadow-[0_0_25px_rgba(234,88,12,0.5)] mt-4 flex items-center justify-center gap-3 group overflow-hidden relative"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Confirming...</span>
                    </>
                  ) : (
                    <>
                      <span className="relative z-10">Confirm Reservation</span>
                      <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right Side: Info / Image */}
            <div className="hidden lg:flex flex-col gap-8 justify-center">
              <div className="relative h-[450px] rounded-2xl overflow-hidden shadow-2xl border border-zinc-800/50 group">
                <Image
                  src="https://images.unsplash.com/photo-1558030006-450675393462?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Grill Time"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80" />
                
                <div className="absolute bottom-0 left-0 right-0 p-8">
                   <h3 className="text-2xl font-display uppercase text-white mb-2">The Live Grill Experience</h3>
                   <p className="text-neutral-300 font-light">Join us for an unforgettable dining journey.</p>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl text-center shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600 opacity-50" />
                <h3 className="text-xl font-display uppercase text-white mb-3">Group & Corporate Bookings</h3>
                <p className="text-neutral-400 text-sm mb-6 font-light">
                  Planning a corporate lunch, a birthday bash, or a large family get-together? We offer special packages and private zones for large groups to ensure your celebration is perfect.
                </p>
                <a href="tel:+15551234567" className="inline-flex items-center justify-center px-6 py-3 border border-orange-500/30 text-orange-500 font-bold uppercase tracking-widest rounded-lg hover:bg-orange-500/10 hover:border-orange-500 transition-colors text-sm w-full md:w-auto">
                  <Phone className="w-4 h-4 mr-2" />
                  +1 (555) 123-4567
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

