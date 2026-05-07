'use client';

import { Suspense, useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, User, Lock, Mail, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import toast, { Toaster } from 'react-hot-toast';

function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const searchParams = useSearchParams();
  const redirectParams = searchParams.get('redirect') || '/';

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!auth) throw new Error("Firebase Auth not initialized");
      
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Successfully logged in");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success("Account created successfully");
      }
      setTimeout(() => router.push(redirectParams), 1000);
    } catch (error: any) {
      console.error("Authentication error", error);
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-display uppercase tracking-widest text-white">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
        <p className="text-neutral-400 mt-2 text-sm">{isLogin ? 'Sign in to your account' : 'Join Barbeque Nation'}</p>
      </div>

      <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
            <Mail className="w-3 h-3" /> Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
            placeholder="you@example.com"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
            <Lock className="w-3 h-3" /> Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
            placeholder="••••••••"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 mt-2 bg-orange-600 hover:bg-orange-500 text-white font-bold tracking-widest uppercase rounded-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(234,88,12,0.3)] hover:shadow-[0_0_25px_rgba(234,88,12,0.5)]"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
             isLogin ? "Sign In" : "Sign Up"
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-neutral-400">
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        {' '}
        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="text-orange-500 font-bold hover:underline"
        >
          {isLogin ? "Sign Up" : "Sign In"}
        </button>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-zinc-950 flex flex-col items-center justify-center relative overflow-hidden">
      <Toaster position="top-right" />
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-2xl relative z-10 shadow-2xl"
      >
        <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>}>
          <LoginForm />
        </Suspense>
      </motion.div>
    </div>
  );
}
