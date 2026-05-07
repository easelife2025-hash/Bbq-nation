'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, User, Lock, Mail, Loader2 } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import toast, { Toaster } from 'react-hot-toast';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signInWithGoogle } = useAuth();
  const router = useRouter();

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
      setTimeout(() => router.push('/'), 1000);
    } catch (error: any) {
      console.error("Authentication error", error);
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      toast.success("Successfully logged in with Google");
      setTimeout(() => router.push('/'), 1000);
    } catch (error: any) {
      toast.error(error.message || "Google sign in failed");
    }
  };

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

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-zinc-900 px-4 text-neutral-500 uppercase tracking-widest font-bold">Or continue with</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full py-3.5 bg-zinc-950 border border-zinc-800 hover:border-orange-500/50 text-white text-sm font-bold tracking-widest uppercase rounded-lg transition-all flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google
        </button>

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
      </motion.div>
    </div>
  );
}
