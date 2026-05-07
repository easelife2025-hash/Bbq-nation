'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Loader2, CheckCircle2, ChevronRight, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast, { Toaster } from 'react-hot-toast';
import { db, auth, firestore } from '@/lib/firebase';
import { ref, onValue, update, remove as removeDb } from 'firebase/database';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'orders' | 'bookings'>('orders');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [orders, setOrders] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  
  const [firebaseError, setFirebaseError] = useState(false);

  useEffect(() => {
    let unsubscribeAuth: () => void;
    let unsubscribeOrders: () => void;
    let unsubscribeBookings: () => void;

    const initFirebase = async () => {
      try {
        if (!auth || !db) {
          setFirebaseError(true);
          setIsLoadingAuth(false);
          return;
        }

        unsubscribeAuth = onAuthStateChanged(auth, (user) => {
          setIsAuthenticated(!!user);
          setIsLoadingAuth(false);

          if (user && db) {
            try {
              const ordersRef = ref(db, 'orders');
              unsubscribeOrders = onValue(ordersRef, snap => {
                const data = snap.val();
                if (data) {
                  const items = Object.keys(data).map(key => ({
                    ...data[key],
                    dbKey: key,
                    displayId: data[key].id || key
                  }));
                  setOrders(items.sort((a: any, b: any) => {
                    const d1 = b.created_at ? new Date(b.created_at).getTime() : 0;
                    const d2 = a.created_at ? new Date(a.created_at).getTime() : 0;
                    return d1 - d2;
                  }));
                } else {
                  setOrders([]);
                }
              }, error => {
                console.warn("Orders error:", error);
              });

              if (firestore) {
                const firestoreBookingsRef = collection(firestore, 'bookings');
                unsubscribeBookings = onSnapshot(firestoreBookingsRef, (snap) => {
                  const items = snap.docs.map(docSnap => ({
                    ...docSnap.data(),
                    dbKey: docSnap.id,
                    displayId: docSnap.data().bookingId || docSnap.id
                  }));
                  setBookings(items.sort((a: any, b: any) => {
                    const d1 = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    const d2 = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    return d1 - d2;
                  }));
                }, error => {
                  console.warn("Bookings error:", error);
                });
              }
            } catch (e) {
              console.warn("Database querying failed", e);
            }
          }
        });
      } catch (e) {
        console.error(e);
        setFirebaseError(true);
        setIsLoadingAuth(false);
      }
    };

    initFirebase();

    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
      if (unsubscribeOrders) unsubscribeOrders();
      if (unsubscribeBookings) unsubscribeBookings();
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!auth) {
        throw new Error("Firebase Auth not initialized");
      }
      
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in successfully");
    } catch (e) {
      toast.error("Invalid credentials.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (dbKey: string, newStatus: string) => {
    try {
      if (!db) throw new Error("Firebase DB not initialized");
      
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout: Database is unreachable.")), 5000));
      await Promise.race([
        update(ref(db, `orders/${dbKey}`), { status: newStatus }),
        timeoutPromise
      ]);
      toast.success(`Order updated`);
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : "Failed to update order");
    }
  };

  const handleUpdateBookingStatus = async (dbKey: string, newStatus: string) => {
    try {
      if (!firestore) throw new Error("Firestore not initialized");
      
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout: Database is unreachable.")), 5000));
      await Promise.race([
        updateDoc(doc(firestore, 'bookings', dbKey), { status: newStatus }),
        timeoutPromise
      ]);
      toast.success(`Booking updated`);
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : "Failed to update booking");
    }
  };

  const handleDeleteOrder = async (dbKey: string) => {
    try {
      if (!db) throw new Error("Firebase DB not initialized");
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout: Database is unreachable.")), 5000));
      await Promise.race([
        removeDb(ref(db, `orders/${dbKey}`)),
        timeoutPromise
      ]);
      toast.success(`Order deleted`);
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : "Failed to delete order");
    }
  };

  const handleDeleteBooking = async (dbKey: string) => {
    try {
      if (!firestore) throw new Error("Firestore not initialized");
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout: Database is unreachable.")), 5000));
      await Promise.race([
        deleteDoc(doc(firestore, 'bookings', dbKey)),
        timeoutPromise
      ]);
      toast.success(`Booking deleted`);
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : "Failed to delete booking");
    }
  };

  const handleLogout = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 1. Loading UI
  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
         <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-4" />
         <p className="text-neutral-400 font-mono text-sm">Authenticating admin...</p>
      </div>
    );
  }

  // 2. Missing Firebase Config UI
  if (firebaseError) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide">Firebase Not Configured</h2>
        <p className="text-neutral-400 max-w-md text-balance text-sm">
          The Admin Panel requires Firebase Authentication and Firestore to work. Please ensure you have added your Firebase configuration to your environment variables.
        </p>
      </div>
    );
  }

  // 3. Login UI
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 relative">
        <Toaster position="top-right" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 blur-[100px] rounded-full pointer-events-none" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-xl relative z-10"
        >
          <div className="flex justify-center mb-6">
            <ShieldAlert className="w-12 h-12 text-orange-500" />
          </div>
          <h1 className="text-2xl font-display uppercase text-center text-white mb-2">Admin Portal</h1>
          <p className="text-center text-neutral-400 text-sm mb-8">Sign in with Firebase Auth</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@barbequenation.com"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold tracking-widest uppercase rounded-lg transition-all flex items-center justify-center"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Access Dashboard"}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // 4. Admin Dashboard UI
  return (
    <div className="min-h-screen bg-zinc-950 pt-24 pb-12 px-6">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b border-zinc-800">
          <div>
            <h1 className="text-3xl font-display uppercase text-white mb-2 text-balance"><span className="text-orange-500">Live</span> Dashboard</h1>
            <p className="text-neutral-400 font-light text-sm">Monitor incoming orders and bookings in real-time.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="mt-4 md:mt-0 px-6 py-2 border border-zinc-800 hover:bg-zinc-800 text-white rounded font-bold uppercase text-xs tracking-wider transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 border-b border-zinc-800 mb-6">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-3 text-sm font-bold tracking-widest uppercase transition-colors relative ${activeTab === 'orders' ? 'text-orange-500' : 'text-neutral-500 hover:text-white'}`}
          >
            Orders
            {activeTab === 'orders' && <motion.div layoutId="adm-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />}
          </button>
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-3 text-sm font-bold tracking-widest uppercase transition-colors relative ${activeTab === 'bookings' ? 'text-orange-500' : 'text-neutral-500 hover:text-white'}`}
          >
            Bookings
            {activeTab === 'bookings' && <motion.div layoutId="adm-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />}
          </button>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {activeTab === 'orders' ? (
              <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                {orders.length === 0 ? (
                  <div className="text-center py-20 text-neutral-500">No orders placed yet.</div>
                ) : (
                  orders.map((order) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={order.dbKey}
                      className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl flex flex-col md:flex-row gap-6 md:items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-mono text-orange-500">#{order.displayId?.slice(0, 8).toUpperCase()}</span>
                          <span className={`text-xs px-2 py-1 rounded font-bold uppercase tracking-wider ${
                            order.status === 'Completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                            order.status === 'Preparing' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                            'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                          }`}>
                            {order.status}
                          </span>
                          <span className="text-neutral-500 text-xs">
                            {order.created_at ? formatDistanceToNow(new Date(order.created_at), { addSuffix: true }) : 'Just now'}
                          </span>
                        </div>
                        <h3 className="text-lg text-white font-bold">{order.customer_name}</h3>
                        <p className="text-neutral-400 text-sm mt-1">
                          {order.items?.length || 0} items • <span className="text-orange-400">₹{order.total_price}</span>
                        </p>
                        <div className="mt-4 space-y-1">
                          {order.items?.map((item: any, i: number) => (
                            <div key={i} className="text-neutral-500 text-sm flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 block shrink-0" />
                              {item.quantity}x {item.name}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 shrink-0">
                        {order.status === 'Pending' && (
                          <button 
                            onClick={() => handleUpdateOrderStatus(order.dbKey, 'Preparing')}
                            className="px-4 py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded font-bold uppercase text-xs tracking-wider transition-colors"
                          >
                            Mark Preparing
                          </button>
                        )}
                        {(order.status === 'Pending' || order.status === 'Preparing') && (
                          <button 
                            onClick={() => handleUpdateOrderStatus(order.dbKey, 'Completed')}
                            className="px-4 py-2 bg-green-600/10 hover:bg-green-600/20 text-green-400 border border-green-600/30 rounded font-bold uppercase text-xs tracking-wider transition-colors"
                          >
                            Mark Completed
                          </button>
                        )}
                        <button 
                          onClick={() => {
                            if (window.confirm("Are you sure you want to delete this order?")) {
                              handleDeleteOrder(order.dbKey);
                            }
                          }}
                          className="px-4 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-600/30 rounded font-bold uppercase text-xs tracking-wider transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            ) : (
              <motion.div key="bookings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                {bookings.length === 0 ? (
                  <div className="text-center py-20 text-neutral-500">No bookings yet.</div>
                ) : (
                  bookings.map((booking) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={booking.dbKey}
                      className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl flex flex-col md:flex-row gap-6 md:items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-mono text-orange-500">#{booking.displayId?.slice(0, 8).toUpperCase()}</span>
                          <span className={`text-xs px-2 py-1 rounded font-bold uppercase tracking-wider ${
                            booking.status === 'Completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                            booking.status === 'Confirmed' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                            'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                          }`}>
                            {booking.status}
                          </span>
                          <span className="text-neutral-500 text-xs">
                            {booking.createdAt ? formatDistanceToNow(new Date(booking.createdAt), { addSuffix: true }) : 'Just now'}
                          </span>
                        </div>
                        <h3 className="text-lg text-white font-bold">{booking.name} <span className="text-neutral-500 font-normal text-sm ml-2">({booking.guests} Guests)</span></h3>
                        <p className="text-neutral-400 text-sm mt-1">
                          {booking.date} at {booking.time} • <span className="text-orange-400">{booking.phone}</span>
                        </p>
                        {booking.notes && (
                          <div className="mt-4 text-neutral-500 text-sm bg-zinc-950 p-3 rounded border border-zinc-800">
                            <strong className="text-neutral-400 block mb-1 uppercase text-xs tracking-wider">Notes</strong>
                            {booking.notes}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 shrink-0">
                        {booking.status === 'Pending' && (
                          <button 
                            onClick={() => handleUpdateBookingStatus(booking.dbKey, 'Confirmed')}
                            className="px-4 py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded font-bold uppercase text-xs tracking-wider transition-colors"
                          >
                            Mark Confirmed
                          </button>
                        )}
                        {(booking.status === 'Pending' || booking.status === 'Confirmed') && (
                          <button 
                            onClick={() => handleUpdateBookingStatus(booking.dbKey, 'Completed')}
                            className="px-4 py-2 bg-green-600/10 hover:bg-green-600/20 text-green-400 border border-green-600/30 rounded font-bold uppercase text-xs tracking-wider transition-colors"
                          >
                            Mark Completed
                          </button>
                        )}
                        <button 
                          onClick={() => {
                            if (window.confirm("Are you sure you want to delete this booking?")) {
                              handleDeleteBooking(booking.dbKey);
                            }
                          }}
                          className="px-4 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-600/30 rounded font-bold uppercase text-xs tracking-wider transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
