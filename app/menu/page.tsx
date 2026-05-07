'use client';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { useState } from 'react';
import { Plus, Check, ShoppingBag, X, Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { firestore } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '@/components/auth-provider';

const categories = ["BBQ", "Starters", "Veg", "Non-Veg", "Desserts"];

const menuData: Record<string, any[]> = {
  "BBQ": [
    { 
      id: "bbq-1", name: "Mutton Seekh Kebab", desc: "Spiced minced lamb charred over open flame.", price: "₹699", 
      img: "https://images.unsplash.com/photo-1558030006-450675393462?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
    },
    { 
      id: "bbq-2", name: "Chicken Tikka", desc: "Classic tandoori marinated chicken skewers.", price: "₹599", 
      img: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
    },
    { 
      id: "bbq-3", name: "Grilled Prawns", desc: "Jumbo prawns marinated in fiery herbs.", price: "₹899", 
      img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
    },
    { 
      id: "bbq-4", name: "Smoked Ribs", desc: "Slow-smoked ribs with our signature BBQ sauce.", price: "₹999", 
      img: "https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
    }
  ],
  "Starters": [
    { 
      id: "st-1", name: "Crispy Corn", desc: "Golden fried corn kernels wok-tossed with pepper.", price: "₹349", 
      img: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
    },
    { 
      id: "st-2", name: "Cajun Spiced Potato", desc: "Crispy skin-on potatoes with signature mayo.", price: "₹299", 
      img: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
    },
    { 
      id: "st-3", name: "Chilli Chicken Dry", desc: "Spicy wok-tossed chicken chunks with bell peppers.", price: "₹449", 
      img: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
    },
    { 
      id: "st-4", name: "Paneer 65", desc: "Deep-fried spicy cottage cheese cubes.", price: "₹399", 
      img: "https://images.unsplash.com/photo-1628296507421-c225dfcee92c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
    }
  ],
  "Veg": [
    { 
      id: "vg-1", name: "Paneer Tikka", desc: "Cottage cheese with bell peppers, grilled.", price: "₹449", 
      img: "https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
    },
    { 
      id: "vg-2", name: "Grilled Mushrooms", desc: "Button mushrooms stuffed with cheese & herbs.", price: "₹399", 
      img: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
    },
    { 
      id: "vg-3", name: "Dal Makhani", desc: "24-hour slow cooked black lentils with cream.", price: "₹499", 
      img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
    },
    { 
      id: "vg-4", name: "Veg Biryani", desc: "Fragrant basmati rice layered with vegetables.", price: "₹399", 
      img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
    }
  ],
  "Non-Veg": [
    { 
      id: "nv-1", name: "Awadhi Mutton Biryani", desc: "Slow-cooked fragrant rice with tender mutton.", price: "₹599", 
      img: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
    },
    { 
      id: "nv-2", name: "Butter Chicken", desc: "Rich and creamy tomato gravy with roast chicken.", price: "₹549", 
      img: "https://images.unsplash.com/photo-1603894584373-5ac82b6ae398?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
    },
    { 
      id: "nv-3", name: "Fish Curry", desc: "Coastal style spicy and tangy fish curry.", price: "₹649", 
      img: "https://images.unsplash.com/photo-1596796937229-cb6a2df1def6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
    },
    { 
      id: "nv-4", name: "Lamb Chops", desc: "Pan-seared lamb chops with rosemary jus.", price: "₹899", 
      img: "https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
    }
  ],
  "Desserts": [
    { 
      id: "ds-1", name: "Angoori Gulab Jamun", desc: "Mini dumplings in warm rose syrup.", price: "₹249", 
      img: "https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
    },
    { 
      id: "ds-2", name: "Sizzling Brownie", desc: "Warm chocolate brownie with vanilla ice cream.", price: "₹349", 
      img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
    },
    { 
      id: "ds-3", name: "Phirni", desc: "Traditional slow-cooked ground rice pudding.", price: "₹199", 
      img: "https://images.unsplash.com/photo-1563805042-7684c8a9e9ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
    },
    { 
      id: "ds-4", name: "Cheesecake", desc: "Classic New York style baked cheesecake.", price: "₹399", 
      img: "https://images.unsplash.com/photo-1533158307587-828f0a76cf46?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
    }
  ]
};

export default function MenuPage() {
  const { user, signInWithGoogle } = useAuth();
  const [activeTab, setActiveTab] = useState(categories[0]);
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [customerName, setCustomerName] = useState('');

  const handleAddToPlate = (item: any) => {
    setAddedItems(prev => {
      const newSet = new Set(prev);
      newSet.add(item.id);
      return newSet;
    });

    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1, numericPrice: parseInt(item.price.replace('₹', '')) }];
    });
    
    // Reset added button state after 1 second
    setTimeout(() => {
      setAddedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }, 1000);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const cartTotal = cart.reduce((total, item) => total + (item.numericPrice * item.quantity), 0);

  const router = useRouter();

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to order.");
      setIsCartOpen(false);
      router.push('/login?redirect=/menu');
      return;
    }

    if (cart.length === 0) return toast.error("Cart is empty");
    setIsCheckingOut(true);

    try {
      const newOrder = {
        id: Math.random().toString(36).substring(2, 10),
        userId: user.uid,
        customerName: customerName,
        items: cart,
        total: cartTotal,
        status: 'Pending',
        createdAt: new Date().toISOString()
      };

      if (!firestore) throw new Error("Database not initialized");

      await addDoc(collection(firestore, 'orders'), newOrder);

      toast.success("Order placed successfully!");
      setCart([]);
      setCustomerName('');
      setIsCartOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to place order.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-zinc-950 relative">
      <Toaster position="top-right" />
      
      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <button 
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-8 right-8 z-40 bg-orange-600 hover:bg-orange-500 text-white rounded-full p-4 shadow-[0_0_20px_rgba(234,88,12,0.5)] transition-all flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-sm"
        >
          <ShoppingBag className="w-5 h-5" />
          <span>{cart.length}</span>
        </button>
      )}

      {/* Cart Sidebar Overlay */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-zinc-900 border-l border-zinc-800 z-50 shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                <h2 className="text-xl font-display uppercase text-white flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5 text-orange-500" /> Your Order
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="text-neutral-500 hover:text-white transition-colors p-2">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center text-neutral-500 py-10">Your cart is empty.</div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between bg-zinc-950 p-4 rounded-lg border border-zinc-800">
                      <div>
                        <h4 className="text-white font-bold text-sm">{item.name}</h4>
                        <div className="text-neutral-400 text-xs mt-1">₹{item.numericPrice} x {item.quantity}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-orange-500 font-bold">₹{item.numericPrice * item.quantity}</span>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-400">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-zinc-800 bg-zinc-950">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-neutral-400 uppercase tracking-widest text-xs font-bold">Total</span>
                    <span className="text-2xl font-bold text-white">₹{cartTotal}</span>
                  </div>
                  <form onSubmit={handleCheckout} className="space-y-4">
                    <input 
                      type="text" 
                      required 
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Your Name (For the order)" 
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500"
                    />
                    <button 
                      type="submit" 
                      disabled={isCheckingOut}
                      className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold tracking-widest uppercase rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      {isCheckingOut ? <Loader2 className="w-5 h-5 animate-spin" /> : "Place Order"}
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <span className="text-orange-500 font-bold tracking-[0.2em] uppercase text-xs mb-4 block">A La Carte & Buffet</span>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white uppercase mb-6 text-balance">
            Explore <span className="text-orange-500">Menu</span>
          </h1>
          <p className="text-neutral-400 max-w-2xl mx-auto font-light">
            Discover our wide range of premium grilled delicacies, hearty main courses, and decadent desserts. Available for individual orders or as part of our limitless buffet experience.
          </p>
        </div>

        {/* Categories Tabs */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-16 border-b border-zinc-800 pb-px">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={`relative px-6 py-3 text-sm md:text-base font-bold tracking-widest uppercase transition-colors duration-300 ${
                activeTab === category ? "text-orange-500" : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              {category}
              {activeTab === category && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute left-0 right-0 -bottom-px h-0.5 bg-orange-500"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {menuData[activeTab].map((item) => {
                const isAdded = addedItems.has(item.id);
                
                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -8 }}
                    className="bg-zinc-900/40 border border-zinc-800 rounded-xl overflow-hidden flex flex-col group hover:border-orange-500/50 hover:shadow-[0_10px_30px_rgba(234,88,12,0.15)] transition-all duration-300"
                  >
                    {/* Image Container */}
                    <div className="relative h-48 overflow-hidden bg-zinc-900">
                      <Image
                        src={item.img}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
                      <div className="absolute top-4 right-4 bg-zinc-950/80 backdrop-blur text-orange-500 font-bold px-3 py-1 rounded text-sm tracking-wider border border-orange-500/30">
                        {item.price}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-display text-white uppercase tracking-wider mb-2 group-hover:text-orange-400 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-neutral-500 text-sm mb-6 flex-grow font-light">
                        {item.desc}
                      </p>

                      {/* Action Button */}
                      <button
                        onClick={() => handleAddToPlate(item)}
                        className={`w-full py-3 rounded-md font-bold uppercase tracking-widest text-sm transition-all duration-300 flex items-center justify-center gap-2 border ${
                          isAdded 
                            ? "bg-green-600 border-green-500 text-white" 
                            : "bg-transparent border-zinc-700 text-neutral-300 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-500/10"
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-4 h-4" /> Plate Added
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" /> Add to Plate
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Global Buffet Banner */}
        <div className="mt-24 p-8 md:p-12 bg-gradient-to-r from-orange-900/40 to-transparent border border-orange-900/50 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-orange-600/20 blur-[100px] rounded-full point-events-none group-hover:bg-orange-500/30 transition-colors duration-700" />
          
          <div className="relative z-10 text-center md:text-left">
            <h3 className="text-3xl font-display uppercase text-white mb-2">Want it all?</h3>
            <p className="text-orange-200/70 font-light">
              Upgrade to our unlimited buffet experience. All you can eat starters, mains, and desserts starting at just <span className="font-bold text-orange-400">₹899/person</span>.
            </p>
          </div>
          
          <div className="relative z-10 shrink-0">
            <a href="/book" className="px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold tracking-widest uppercase rounded-sm inline-block transition-all shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_30px_rgba(234,88,12,0.5)]">
              Book Unlimited Buffet
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

