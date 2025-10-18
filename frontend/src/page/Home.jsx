import React from 'react';
import { Link } from 'react-router-dom'


// Custom style for the complex background gradient, combining with Tailwind classes.
const pageStyle = {
  backgroundImage: 'radial-gradient(at 0% 0%, #1e3a8a 0%, transparent 50%), radial-gradient(at 100% 100%, #4c1d95 0%, transparent 50%)',
};

const Home = () => {
   
    // SVG Icons
    const MessageIcon = (props) => (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 mx-auto">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
    );

    const UsersIcon = (props) => (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 mx-auto">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );

    const LockIcon = (props) => (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 mx-auto">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    );

    return (
        <div 
            className="flex flex-col min-h-screen text-white bg-slate-900"
            style={pageStyle}
        >
            {/* Header / Navigation Bar */}
            <header className="w-full p-4 md:p-6 backdrop-blur-sm bg-slate-900/50 sticky top-0 z-10 shadow-lg">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    {/* Logo/App Name */}
                    <a href="#" className="text-3xl font-extrabold tracking-tight text-white transition duration-300 hover:text-indigo-400">
                        Connectify <span className="text-indigo-500">.</span>
                    </a>

                    {/* Auth Buttons */}
                    <div className="flex space-x-3">
                        <Link
                            to={'/login'}
                            className="px-4 py-2 text-sm font-semibold text-white bg-transparent border-2 border-indigo-600 rounded-xl transition duration-300 transform hover:scale-105 hover:bg-indigo-600 hover:shadow-md hover:shadow-indigo-500/50"
                        >
                            Login
                        </Link>
                        <Link
                           to={'/signup'}
                            className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-md shadow-purple-500/50 transition duration-300 transform hover:scale-105"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content / Hero Section */}
            <main className="flex-grow flex items-center justify-center p-6">
                <div className="text-center max-w-4xl">
                    {/* Headline */}
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight mb-4">
                        Chat, Connect, <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-500">Create Friendships</span>.
                    </h1>
                    
                    {/* Subheading / App Value Prop */}
                    <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                        Discover new people globally, share your interests, and build meaningful relationships in real-time with our seamless chat platform.
                    </p>

                    {/* Main CTA Buttons (More prominent) */}
                    <div className="flex justify-center space-x-4 md:space-x-6">
                        <Link
                           to={'/signup'}
                            className="px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-xl shadow-indigo-600/40 hover:from-indigo-600 hover:to-purple-700 transition duration-300 transform hover:scale-105"
                        >
                            Start Chatting Now
                        </Link>
                        {/* <button
                            onClick={handleExploreFeatures}
                            className="px-8 py-4 text-lg font-bold text-indigo-400 bg-slate-800 rounded-2xl border-2 border-slate-700 shadow-xl shadow-slate-900/50 hover:bg-slate-700 transition duration-300 transform hover:scale-105"
                        >
                            Explore Features
                        </button> */}
                    </div>
                </div>
            </main>
            
            {/* Simple Feature Showcase Section */}
            <section className="w-full py-12 bg-slate-900/70 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-8 text-indigo-300">Why Connectify?</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1: Real-time Messaging */}
                        <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 shadow-xl hover:shadow-indigo-500/20 transition duration-300">
                            <div className="text-4xl mb-3 text-teal-400">
                                <MessageIcon />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-white">Instant Connection</h3>
                            <p className="text-slate-400 text-sm">Experience zero-latency messaging powered by Socket.IO for flawless, real-time conversations.</p>
                        </div>

                        {/* Feature 2: Friend Discovery */}
                        <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 shadow-xl hover:shadow-purple-500/20 transition duration-300">
                            <div className="text-4xl mb-3 text-purple-400">
                                <UsersIcon />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-white">Global Community</h3>
                            <p className="text-slate-400 text-sm">Easily find and connect with like-minded individuals from all over the world.</p>
                        </div>

                        {/* Feature 3: Secure & Private */}
                        <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 shadow-xl hover:shadow-teal-500/20 transition duration-300">
                            <div className="text-4xl mb-3 text-indigo-400">
                                <LockIcon />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-white">Secure Platform</h3>
                            <p className="text-slate-400 text-sm">Your privacy is our priority. Enjoy chatting in a safe and moderated environment.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="w-full p-4 text-center text-xs text-slate-500 border-t border-slate-800">
                &copy; 2025 Connectify. Built with MERN Stack & Socket.IO.
            </footer>
        </div>
    );
};

export default Home;
