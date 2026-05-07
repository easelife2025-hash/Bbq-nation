import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-400px)] px-6 text-center">
      <h2 className="text-4xl font-display font-bold text-white uppercase mb-4">
        404 - Page <span className="text-orange-500">Not Found</span>
      </h2>
      <p className="text-neutral-400 mb-8 max-w-md mx-auto">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold tracking-widest uppercase rounded-sm transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
