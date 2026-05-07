'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Calendar, Clock, Utensils, AlertCircle, LogIn } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { firestore } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

export default function MyUpdatesPage() {
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const [activeTab, setActiveTab] = useState<'bookings' | 'orders'>('bookings');
  
  const [bookings, setBookings] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (!user || !firestore) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoadingBookings(true);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoadingOrders(true);

    const bookingsQuery = query(
      collection(firestore, 'bookings'),
      where('userId', '==', user.uid)
    );

    const unsubscribeBookings = onSnapshot(bookingsQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort manually as we might need composite indexes if we sort on DB level
      data.sort((a: any, b: any) => {
        const da = a.createdAt?.toDate?.() || new Date(a.createdAt);
        const db = b.createdAt?.toDate?.() || new Date(b.createdAt);
        return db.getTime() - da.getTime();
      });
      setBookings(data);
      setLoadingBookings(false);
    });

    const ordersQuery = query(
      collection(firestore, 'orders'),
      where('userId', '==', user.uid)
    );

    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      data.sort((a: any, b: any) => {
        const da = a.createdAt?.toDate?.() || new Date(a.createdAt);
        const db = b.createdAt?.toDate?.() || new Date(b.createdAt);
        return db.getTime() - da.getTime();
      });
      setOrders(data);
      setLoadingOrders(false);
    });

    return () => {
      unsubscribeBookings();
      unsubscribeOrders();
    };
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen pt-32 pb-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-orange-950/20 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
        
        <div className="max-w-2xl mx-auto text-center mt-20 relative z-10">
          <div className="w-20 h-20 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center mx-auto mb-8">
            <LogIn className="w-8 h-8 text-neutral-400" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-wider uppercase mb-6">
            Authentication <span className="text-orange-500">Required</span>
          </h1>
          <p className="text-neutral-400 text-lg mb-8">
            Please log in to view and track your table bookings and food orders.
          </p>
          <button
            onClick={signInWithGoogle}
            className="px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold tracking-widest uppercase rounded-sm transition-all duration-300 shadow-[0_0_20px_rgba(234,88,12,0.4)]"
          >
            Log In with Google
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'completed': return 'text-green-500 border-green-500/30 bg-green-500/10';
      case 'preparing':
      case 'in-progress': return 'text-amber-500 border-amber-500/30 bg-amber-500/10';
      case 'cancelled': return 'text-red-500 border-red-500/30 bg-red-500/10';
      default: return 'text-orange-500 border-orange-500/30 bg-orange-500/10';
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-16 px-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-orange-950/20 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-red-950/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-wider uppercase mb-4">
            My <span className="text-orange-500">Updates</span>
          </h1>
          <p className="text-neutral-400">Track your reservations and orders in real-time.</p>
        </div>

        {/* Custom Tabs */}
        <div className="flex border-b border-neutral-800 mb-8">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex-1 py-4 text-sm font-bold tracking-widest uppercase transition-colors relative ${
              activeTab === 'bookings' ? 'text-orange-500' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Table Bookings
            {activeTab === 'bookings' && (
              <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-4 text-sm font-bold tracking-widest uppercase transition-colors relative ${
              activeTab === 'orders' ? 'text-orange-500' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Food Orders
            {activeTab === 'orders' && (
              <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
            )}
          </button>
        </div>

        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === 'bookings' ? (
              <motion.div
                key="bookings"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {loadingBookings ? (
                  <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-orange-500" /></div>
                ) : bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <div key={booking.id} className="bg-neutral-900 border border-neutral-800 p-6 rounded-sm flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono text-neutral-500 text-xs text-orange-500/80">#{booking.id.slice(0,8).toUpperCase()}</span>
                          <span className={`px-3 py-1 text-xs font-bold tracking-wider uppercase rounded-full border ${getStatusColor(booking.status)}`}>
                            {booking.status || 'Pending'}
                          </span>
                        </div>
                        <h3 className="text-xl font-display font-medium text-white mb-4">{booking.name}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-neutral-400">
                          <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-orange-500" /> {booking.date}</div>
                          <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-orange-500" /> {booking.time}</div>
                          <div className="flex items-center gap-2"><Utensils className="w-4 h-4 text-orange-500" /> {booking.guests} Guests</div>
                        </div>
                      </div>
                      <div className="hidden md:block w-px h-16 bg-neutral-800"></div>
                      <div className="text-left md:text-right w-full md:w-auto mt-4 md:mt-0 p-4 md:p-0 bg-black/20 md:bg-transparent rounded-sm">
                        <div className="text-xs text-neutral-500 mb-1">Occasion</div>
                        <div className="font-medium text-neutral-300 capitalize">{booking.occasion || 'Dining'}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 bg-neutral-900/50 border border-neutral-800/50 rounded-sm">
                    <Calendar className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
                    <h3 className="text-xl font-display text-neutral-300 mb-2">No Bookings Found</h3>
                    <p className="text-neutral-500">You haven&apos;t made any reservations yet.</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="orders"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {loadingOrders ? (
                  <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-orange-500" /></div>
                ) : orders.length > 0 ? (
                  orders.map((order) => (
                    <div key={order.id} className="bg-neutral-900 border border-neutral-800 p-6 rounded-sm">
                      <div className="flex flex-wrap gap-4 justify-between items-start mb-6 pb-4 border-b border-neutral-800">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                             <span className="font-mono text-neutral-500 text-xs">#{order.id.slice(0,8).toUpperCase()}</span>
                             <span className={`px-3 py-1 text-xs font-bold tracking-wider uppercase rounded-full border ${getStatusColor(order.status)}`}>
                               {order.status || 'Pending'}
                             </span>
                          </div>
                          <div className="text-sm text-neutral-400">
                            Ordered: {order.createdAt ? (order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : new Date(order.createdAt).toLocaleDateString()) : 'Recently'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-display text-white">${order.total?.toFixed(2)}</div>
                          <div className="text-sm text-orange-500">{order.items?.length || 0} Items</div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {order.items?.map((item: any, i: number) => (
                          <div key={i} className="flex justify-between items-center text-sm">
                            <div className="flex gap-4">
                              <span className="text-neutral-500">{item.quantity}x</span>
                              <span className="text-neutral-300">{item.name}</span>
                            </div>
                            <span className="text-neutral-400">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 bg-neutral-900/50 border border-neutral-800/50 rounded-sm">
                    <Utensils className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
                    <h3 className="text-xl font-display text-neutral-300 mb-2">No Orders Found</h3>
                    <p className="text-neutral-500">You haven&apos;t placed any food orders yet.</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
