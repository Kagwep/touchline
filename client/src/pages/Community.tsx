import React, { useState, useEffect } from 'react';
import { ChevronRight, Users, Zap, Star, MessageCircle, Share2, Heart, Trophy, Gift, Mail, Twitter, Youtube, Github } from 'lucide-react';
import { TouchlineNavigation } from './Navigation';

const Community: React.FC = () => {
  const [email, setEmail] = useState('');
  const [notificationStatus, setNotificationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

  const newsItems = [
    "Community Hub launching with guilds and chat features!",
    "Player-to-player trading system in development",
    "Community tournaments and leaderboards coming soon",
    "Share your best card collections with friends worldwide"
  ];

  const communityFeatures = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Guilds & Teams",
      description: "Form alliances with fellow collectors, compete in guild wars, and share strategies with your squad.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Share2 className="w-8 h-8" />,
      title: "Trading Hub",
      description: "Trade cards with players globally, negotiate deals, and complete your dream collection through community exchanges.",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Global Chat",
      description: "Connect with collectors worldwide, discuss tactics, share highlights, and make new friends in real-time.",
      color: "from-green-600 to-green-700"
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Community Events",
      description: "Participate in community-driven challenges, showcase events, and seasonal competitions with unique rewards.",
      color: "from-green-400 to-green-500"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Collection Showcase",
      description: "Display your rarest cards, get likes from the community, and climb the collector leaderboards.",
      color: "from-emerald-400 to-emerald-500"
    },
    {
      icon: <Gift className="w-8 h-8" />,
      title: "Daily Rewards",
      description: "Earn community points through participation, unlock exclusive perks, and receive special edition cards.",
      color: "from-green-500 to-emerald-500"
    }
  ];

  const socialLinks = [
    { icon: <MessageCircle className="w-6 h-6" />, label: "Discord", href: "#", desc: "Join our Discord server" },
    { icon: <Twitter className="w-6 h-6" />, label: "Twitter", href: "#", desc: "Follow for updates" },
    { icon: <Youtube className="w-6 h-6" />, label: "YouTube", href: "#", desc: "Watch gameplay videos" },
    { icon: <Github className="w-6 h-6" />, label: "Reddit", href: "#", desc: "Community discussions" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % newsItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [newsItems.length]);

  const handleNotifySubmit = () => {
    if (email.includes('@')) {
      setNotificationStatus('success');
      setTimeout(() => {
        setNotificationStatus('idle');
        setEmail('');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 to-green-700 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>
      
      {/* Background glow */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-green-400 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-emerald-400 rounded-full filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: "1.5s"}}></div>
      
      {/* Navigation placeholder */}
      <TouchlineNavigation />
      
      {/* News ticker */}
      <div className="bg-green-800/50 border-y border-green-600/30 py-2 mb-6 relative overflow-hidden">
        <div className="container mx-auto px-4 flex items-center">
          <div className="bg-green-600 text-white px-3 py-1 rounded mr-4 text-sm font-bold flex items-center shrink-0">
            <Zap className="w-4 h-4 mr-1" /> NEWS
          </div>
          <div className="overflow-hidden relative w-full">
            <div className="whitespace-nowrap">
              <span className="inline-block transition-opacity duration-700">
                {newsItems[currentNewsIndex]}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8 md:py-16 relative z-10">
        <div className="text-center mb-16">
          {/* Community Icon */}
          <div className="relative inline-block mb-8">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-900/50 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-conic from-green-300 via-emerald-300 to-green-300 opacity-20 animate-spin-slow"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent animate-pulse"></div>
              <Users className="w-16 h-16 md:w-20 md:h-20 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-green-400 via-emerald-400 to-green-400 rounded-full opacity-20 animate-spin-slow"></div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Community Hub
            <br />
            <span className="text-green-300 bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">
              Coming Soon
            </span>
          </h1>
          
          <p className="text-lg md:text-xl mb-8 text-green-100 max-w-3xl mx-auto">
            Connect with fellow collectors from around the world! Our community hub will feature trading, 
            guilds, chat rooms, and exclusive community events. Build friendships and become part of 
            the ultimate football card community.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {communityFeatures.map((feature, index) => (
            <div 
              key={index}
              className="bg-green-800/30 backdrop-blur-sm border border-green-600/30 rounded-xl p-6 hover:bg-green-700/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-green-900/30 group"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
              <p className="text-green-100 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Community Preview */}
        <div className="bg-gradient-to-r from-green-800/40 to-emerald-800/40 backdrop-blur-sm border border-green-600/30 rounded-2xl p-8 mb-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 via-transparent to-emerald-400/5"></div>
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-green-300">
              Join the Global Community
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Real-time Trading</h4>
                    <p className="text-green-100">Negotiate trades with players worldwide and complete your collection</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Guild Competitions</h4>
                    <p className="text-green-100">Team up with friends and compete in exclusive guild tournaments</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Collection Showcases</h4>
                    <p className="text-green-100">Share your rarest finds and get recognition from the community</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                {/* Mock community cards */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-4 transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">👤</div>
                      <div>
                        <div className="font-semibold text-sm">CardMaster_2024</div>
                        <div className="text-xs text-green-200">Guild Leader</div>
                      </div>
                    </div>
                    <div className="text-sm text-green-100">"Just pulled a legendary Messi! Anyone want to trade for Ronaldo?"</div>
                    <div className="flex items-center space-x-4 mt-3 text-xs text-green-200">
                      <span className="flex items-center"><Heart className="w-3 h-3 mr-1" />24</span>
                      <span className="flex items-center"><MessageCircle className="w-3 h-3 mr-1" />8</span>
                      <span className="flex items-center"><Share2 className="w-3 h-3 mr-1" />Share</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-lg p-4 transform rotate-1 hover:rotate-0 transition-transform duration-300">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 bg-emerald-400 rounded-full flex items-center justify-center">👤</div>
                      <div>
                        <div className="font-semibold text-sm">FootballFan_99</div>
                        <div className="text-xs text-emerald-200">Active Trader</div>
                      </div>
                    </div>
                    <div className="text-sm text-emerald-100">"Our guild just won the weekly tournament! Great teamwork everyone! 🏆"</div>
                    <div className="flex items-center space-x-4 mt-3 text-xs text-emerald-200">
                      <span className="flex items-center"><Heart className="w-3 h-3 mr-1" />42</span>
                      <span className="flex items-center"><MessageCircle className="w-3 h-3 mr-1" />15</span>
                      <span className="flex items-center"><Share2 className="w-3 h-3 mr-1" />Share</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Preview Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {socialLinks.map((social, index) => (
            <div key={index} className="bg-green-800/30 backdrop-blur-sm border border-green-600/30 rounded-xl p-6 text-center hover:bg-green-700/40 transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                {social.icon}
              </div>
              <h3 className="font-bold text-lg mb-2">{social.label}</h3>
              <p className="text-green-100 text-sm">{social.desc}</p>
              <button className="mt-4 bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg text-sm transition-colors">
                Join Now
              </button>
            </div>
          ))}
        </div>

        {/* Notification Section */}
        <div className="bg-green-600/20 border-2 border-green-400/30 rounded-2xl p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/5 via-transparent to-emerald-400/5 animate-pulse"></div>
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-green-300">
              Be Part of the Community!
            </h2>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
              Get notified when the Community Hub launches and be among the first to join guilds, 
              start trading, and connect with collectors worldwide!
            </p>
            
            <div className="max-w-md mx-auto mb-8">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-full bg-green-800/50 border border-green-600/30 text-white placeholder-green-300/70 focus:outline-none focus:border-green-400 backdrop-blur-sm"
                />
                <button
                  onClick={handleNotifySubmit}
                  disabled={notificationStatus === 'success'}
                  className={`px-6 py-3 rounded-full font-bold transition-all flex items-center justify-center ${
                    notificationStatus === 'success'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 hover:shadow-lg hover:shadow-green-900/30'
                  }`}
                >
                  {notificationStatus === 'success' ? (
                    <>Joined! ✓</>
                  ) : (
                    <>
                      <Mail className="w-5 h-5 mr-2" />
                      Join Waitlist
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="text-green-200 text-sm">
              🌟 Early members get exclusive community badges and starter rewards!
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-green-950 py-8 relative mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-green-400 rounded-full mr-2 flex items-center justify-center">
                  ⚽
                </div>
                <span className="text-xl font-bold">Touchline</span>
              </div>
              <p className="text-green-300 mt-2">The ultimate digital football card game</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
              <a href="#" className="text-green-300 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-green-300 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-green-300 hover:text-white transition-colors">Support</a>
              <a href="#" className="text-green-300 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-8 text-center text-green-400 text-sm">
            &copy; 2025 Touchline. All rights reserved.
          </div>
        </div>
      </footer>

      <style >{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Community;