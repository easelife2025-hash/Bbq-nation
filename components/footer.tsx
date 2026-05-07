import Link from 'next/link';
import { Flame, Instagram, Facebook, Twitter, MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-zinc-950 pt-20 border-t border-orange-950/50">
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="col-span-1 md:col-span-1 space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <Flame className="w-8 h-8 text-orange-500 group-hover:text-amber-400 transition-colors duration-300" />
              <span className="font-display text-2xl font-bold tracking-wider text-neutral-100 uppercase">
                Barbeque <span className="text-orange-500">Nation</span>
              </span>
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Experience the joy of grilling right at your table. Premium cuts, exotic marinades, and an unforgettable culinary journey.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-neutral-400 hover:bg-orange-600 hover:text-white transition-all duration-300">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-neutral-400 hover:bg-orange-600 hover:text-white transition-all duration-300">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-neutral-400 hover:bg-orange-600 hover:text-white transition-all duration-300">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-display uppercase tracking-widest text-sm mb-6">Explore</h4>
            <ul className="space-y-4 text-sm text-neutral-400">
              <li><Link href="/" className="hover:text-orange-500 transition-colors">Home</Link></li>
              <li><Link href="/menu" className="hover:text-orange-500 transition-colors">Our Menu</Link></li>
              <li><Link href="/about" className="hover:text-orange-500 transition-colors">About Us</Link></li>
              <li><Link href="/book" className="hover:text-orange-500 transition-colors">Reservations</Link></li>
              <li><Link href="/contact" className="hover:text-orange-500 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-display uppercase tracking-widest text-sm mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm text-neutral-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-500 shrink-0" />
                <span>123 Grill Avenue, Culinary District,<br/>Food City, FC 12345</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-orange-500 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-orange-500 shrink-0" />
                <span>reservations@barbequenation.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-display uppercase tracking-widest text-sm mb-6">Opening Hours</h4>
            <ul className="space-y-4 text-sm text-neutral-400">
              <li className="flex justify-between border-b border-zinc-900 pb-2">
                <span>Mon - Thu</span>
                <span className="text-neutral-300">11:00 AM - 10:30 PM</span>
              </li>
              <li className="flex justify-between border-b border-zinc-900 pb-2">
                <span>Friday</span>
                <span className="text-neutral-300">11:00 AM - 11:30 PM</span>
              </li>
              <li className="flex justify-between border-b border-zinc-900 pb-2">
                <span>Saturday</span>
                <span className="text-neutral-300">10:00 AM - 11:30 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span className="text-neutral-300">10:00 AM - 10:30 PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-zinc-950 py-6 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>&copy; {new Date().getFullYear()} Barbeque Nation. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-neutral-300">Privacy Policy</Link>
            <Link href="#" className="hover:text-neutral-300">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
