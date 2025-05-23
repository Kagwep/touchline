import React, { useState, useEffect } from 'react';
import { ChevronRight, Trophy, Zap, Star, Calendar, Users, Award, Mail, Twitter, MessageCircle, Youtube } from 'lucide-react';
import { TouchlineNavigation } from './Navigation';

const Tournament: React.FC = () => {
  const [email, setEmail] = useState('');
  const [notificationStatus, setNotificationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

  const newsItems = [
    "Tournament Beta Testing begins December 2025!",
    "New Championship rewards revealed - Legendary cards await!",
    "Cross-platform tournaments coming to mobile and desktop",
    "Weekly tournaments with seasonal themes announced"
  ];

  const tournamentFeatures = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Competitive Battles",
      description: "Face off against players worldwide in structured tournament brackets with skill-based matchmaking.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Exclusive Rewards",
      description: "Earn rare cards, unique badges, and special titles available only through tournament victories.",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Seasonal Events",
      description: "Participate in limited-time tournaments themed around real football seasons and major competitions.",
      color: "from-green-600 to-green-700"
    }
  ];

  const socialLinks = [
    { icon: <MessageCircle className="w-6 h-6" />, label: "Discord", href: "#" },
    { icon: <Twitter className="w-6 h-6" />, label: "Twitter", href: "#" },
    { icon: <Youtube className="w-6 h-6" />, label: "YouTube", href: "#" },
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
          {/* Tournament Icon */}
          <div className="relative inline-block mb-8">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-900/50 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent animate-pulse"></div>
              <Trophy className="w-16 h-16 md:w-20 md:h-20 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-green-400 via-emerald-400 to-green-400 rounded-full opacity-20 animate-spin-slow"></div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Tournaments
            <br />
            <span className="text-green-300 bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">
              Coming Soon
            </span>
          </h1>
          
          <p className="text-lg md:text-xl mb-8 text-green-100 max-w-3xl mx-auto">
            Get ready for the ultimate competitive experience! Tournament mode is currently in development 
            and will bring intense multiplayer battles, seasonal competitions, and exclusive rewards 
            to Touchline.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {tournamentFeatures.map((feature, index) => (
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

        {/* Tournament Preview Cards */}
        <div className="bg-gradient-to-r from-green-800/40 to-emerald-800/40 backdrop-blur-sm border border-green-600/30 rounded-2xl p-8 mb-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 via-transparent to-emerald-400/5"></div>
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-green-300">
              What to Expect
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Weekly Championships</h4>
                    <p className="text-green-100">Compete in weekly tournaments with rotating themes and special rules</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Skill-Based Matchmaking</h4>
                    <p className="text-green-100">Fair matches against players of similar skill levels</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Legendary Rewards</h4>
                    <p className="text-green-100">Exclusive cards and items only available through tournament victories</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-sm font-bold">95</span>
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  </div>
                  <div className="h-24 bg-green-700 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">Tournament Winner</div>
                    <div className="text-sm text-green-200">Exclusive Card</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Section */}
        <div className="bg-green-600/20 border-2 border-green-400/30 rounded-2xl p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/5 via-transparent to-emerald-400/5 animate-pulse"></div>
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-green-300">
              Be the First to Know!
            </h2>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
              Join our notification list to get instant updates when tournaments go live. 
              Early subscribers get exclusive beta access!
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
                    <>Added! ✓</>
                  ) : (
                    <>
                      <Mail className="w-5 h-5 mr-2" />
                      Notify Me
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex justify-center space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-12 h-12 bg-green-700/50 hover:bg-green-600/50 rounded-full flex items-center justify-center transition-all hover:-translate-y-1 hover:shadow-lg border border-green-600/30"
                  title={social.label}
                >
                  {social.icon}
                </a>
              ))}
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

export default Tournament;