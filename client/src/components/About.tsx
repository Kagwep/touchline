import React from 'react';
import { Trophy, Users, Map, Award, BookOpen, Video, Play, FileText, DollarSign, Signal, Zap, Icon, Star, Shield, Clock } from 'lucide-react';
import { soccerBall } from '@lucide/lab';

const About = () => {
  const gameBasics = [
    {
      name: 'Your Squad',
      description: 'Build a team of 11 players including defenders, midfielders, attackers, and a goalkeeper. Choose wisely to balance Attack and Defence stats.'
    },
    {
      name: 'The Match',
      description: 'Play against opponents in rounds where you select cards to attack or defend, comparing stats to determine who scores.'
    },
    {
      name: 'Winning',
      description: 'Score more goals than your opponent across all rounds by strategically deploying your best players at the right moments.'
    },
    {
      name: 'Card Collection',
      description: 'Expand your options by collecting new player cards with unique stats, abilities, and rarities.'
    }
  ];

  const cardStats = [
    {
      name: 'Attack',
      description: 'Determines a player\'s goal-scoring ability when attacking. Higher numbers give you better chances to score.'
    },
    {
      name: 'Defence',
      description: 'Measures a player\'s ability to block attacks and prevent goals. Higher numbers improve your defensive strength.'
    },
    {
      name: 'Passing',
      description: 'Affects the success of combinational play and tactical formations. Better passing enables special combo moves.'
    },
    {
      name: 'Speed',
      description: 'Influences counter-attack effectiveness and defensive recovery. Faster players can create strategic advantages.'
    }
  ];

  const matchTactics = [
    {
      name: 'High Press',
      description: 'Deploy cards with high pressure ratings to win the ball back quickly in opponent territory.'
    },
    {
      name: 'Counter Attack',
      description: 'Position fast players to break rapidly and exploit gaps after regaining possession.'
    },
    {
      name: 'Tiki-Taka',
      description: 'Use cards with high passing stats in combination to maintain possession and create openings.'
    },
    {
      name: 'Park the Bus',
      description: 'Strengthen your defense with high defending stat cards to block opponent attacks.'
    }
  ];

  const cardTypes = [
    {
      title: 'Strikers',
      desc: 'Goal-scoring specialists with high Attack stats (80-95)',
      icon: <Icon iconNode={soccerBall}  />
    },
    {
      title: 'Defenders',
      desc: 'Defensive specialists with high Defence stats (75-90)',
      icon: Shield
    },
    {
      title: 'Midfielders',
      desc: 'Versatile players with balanced Attack/Defence (70-85 in both)',
      icon: Users
    },
    {
      title: 'Goalkeepers',
      desc: 'Last line of defense with special Save abilities (Defence 85-99)',
      icon: Map
    },
    {
      title: 'Star Players',
      desc: 'Legendary footballers with special match-winning abilities',
      icon: Star
    }
  ];

  const rarityTypes = [
    {
      title: 'Bronze',
      desc: 'Common players with basic stats (60-75 range)',
      color: 'text-amber-700'
    },
    {
      title: 'Silver',
      desc: 'Uncommon players with improved stats (70-85 range)',
      color: 'text-gray-400'
    },
    {
      title: 'Gold',
      desc: 'Rare players with excellent stats (80-90 range)',
      color: 'text-yellow-500'
    },
    {
      title: 'Diamond',
      desc: 'Ultra-rare players with premium stats (85-95 range)',
      color: 'text-blue-300'
    },
    {
      title: 'Legendary',
      desc: 'The rarest cards with exceptional stats and unique abilities (90-99)',
      color: 'text-purple-400'
    }
  ];

  // Tutorials array
  const tutorials = [
    {
      title: 'Basic Gameplay',
      description: 'Learn the core mechanics of card battles and scoring goals',
      type: 'Video',
      url: 'https://www.youtube.com/embed/basic_gameplay',
      icon: Play,
      color: 'text-green-400'
    },
    {
      title: 'Advanced Strategies',
      description: 'Master tactical formations and card combinations for victory',
      type: 'Video',
      url: 'https://www.youtube.com/embed/advanced_strategies',
      icon: BookOpen,
      color: 'text-blue-400'
    },
    {
      title: 'Card Collection',
      description: 'Tips for building your ultimate squad and managing your player cards',
      type: 'Document',
      url: '/guides/card_collection.pdf',
      icon: FileText,
      color: 'text-yellow-400'
    },
    {
      title: 'Transfer Market',
      description: 'How to trade players and navigate the transfer market effectively',
      type: 'Document',
      url: '/guides/transfer_market.pdf',
      icon: DollarSign,
      color: 'text-purple-400'
    }
  ];

  // Handle tutorial click
  const handleTutorialClick = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-green-900 pt-16 relative">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-[url('/images/pitch-texture.jpg')] bg-cover bg-center opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-green-950/80 via-green-900/90 to-green-900"></div>
      
      {/* Header with animated text */}
      <header className="relative z-10 max-w-6xl mx-auto px-4 pt-8 text-center">
        <div className="flex items-center justify-center mb-3">
          <Icon iconNode={soccerBall} className="w-10 h-10 text-green-300 mr-3" />
          <h1 className="text-4xl md:text-5xl font-bold text-green-300 mb-2">TOUCHLINE SOCCER</h1>
        </div>
        <p className="text-green-200/70 text-lg">Match Attacks Card Game - Season 2025</p>
        <div className="h-1 w-32 bg-green-400/50 mx-auto mt-6 mb-12"></div>
      </header>
      
      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        <div className="relative bg-green-950/40 rounded-lg border border-green-400/20 overflow-hidden">
          {/* Terminal Header */}
          <div className="bg-green-950/60 border-b border-green-400/30 px-4 py-2 flex items-center">
            <div className="flex space-x-2 mr-4">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="text-green-300 font-mono text-sm">manager@touchline-soccer: ~/gameplay-guide</div>
          </div>
          
          <div className="p-8 space-y-8">
            {/* Game Introduction */}
            <section className="mb-10">
              <div className="flex items-center mb-4">
                <Zap className="text-green-300 mr-2" size={24} />
                <h2 className="text-3xl font-mono text-green-300">Game Overview</h2>
              </div>
              <p className="text-green-100/80 mb-4 border-l-2 border-green-400/50 pl-4">
                Touchline Soccer Match Attacks is a digital trading card game based on football. Collect cards featuring real football stars, 
                each with unique Attack and Defence stats. Build your ultimate team and compete against other managers 
                in head-to-head matches where strategic card play determines who scores more goals!
              </p>
              <div className="text-yellow-300/70 inline-block border border-yellow-400/30 px-3 py-1 rounded bg-yellow-900/20 text-sm">
                OFFICIAL GAMEPLAY GUIDE // MANAGER EDITION
              </div>
            </section>

            {/* Gameplay Basics */}
            <section className="bg-green-950/30 border border-green-400/20 p-6 rounded-lg">
              <h2 className="text-2xl font-mono text-green-300 mb-4 pb-2 border-b border-green-400/30 flex items-center">
                <Play className="mr-2 w-6 h-6" /> HOW TO PLAY
              </h2>
              <div className="space-y-6">
                <p className="text-green-100/90">
                  The game is played in rounds where players take turns selecting cards to attack or defend. Score more goals than your opponent to win!
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-mono text-green-300">Game Setup</h3>
                    <ol className="space-y-3 list-decimal pl-5 text-green-100/80">
                      <li>Build your squad of 11 player cards</li>
                      <li>Decide who kicks off (goes first)</li>
                      <li>Take turns playing attack and defense cards</li>
                      <li>Compare stats to determine goals</li>
                      <li>The player with most goals wins!</li>
                    </ol>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-mono text-green-300">Scoring Goals</h3>
                    <ul className="space-y-3 text-green-100/80">
                      <li className="flex items-start">
                        <span className="text-green-400 mr-2 mt-1">›</span>
                        <span>When attacking, if your card's <strong className="text-green-300">Attack stat</strong> is higher than opponent's <strong className="text-green-300">Defence stat</strong>, you score a goal!</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-400 mr-2 mt-1">›</span>
                        <span>When defending, if your card's <strong className="text-green-300">Defence stat</strong> is equal to or higher than opponent's <strong className="text-green-300">Attack stat</strong>, you block the goal.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-400 mr-2 mt-1">›</span>
                        <span>Special abilities on cards can modify stats or provide unique advantages during gameplay.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Game Basics Grid */}
            <section className="bg-green-950/30 border border-green-400/20 p-6 rounded-lg">
              <h2 className="text-2xl font-mono text-green-300 mb-4 pb-2 border-b border-green-400/30">
                GAME BASICS
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gameBasics.map((basic, index) => (
                  <div key={index} className="p-4 bg-green-800/10 border border-green-400/20 rounded">
                    <h4 className="text-green-300 font-mono mb-1">{basic.name}</h4>
                    <p className="text-green-100/70 text-sm">{basic.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Card Types Section */}
            <section className="bg-green-950/30 border border-green-400/20 p-6 rounded-lg">
              <h2 className="text-2xl font-mono text-green-300 mb-4 pb-2 border-b border-green-400/30 flex items-center">
                <Award className="mr-2 w-6 h-6" /> PLAYER CARDS
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cardTypes.map((card, index) => (
                  <div key={index} className="p-4 bg-green-800/10 border border-green-400/20 rounded flex items-start space-x-3">
                   
                      <Icon iconNode={soccerBall}  />
                    
                    <div>
                      <h4 className="text-green-300 font-mono mb-1">{card.title}</h4>
                      <p className="text-green-100/70 text-sm">{card.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Card Stats Section */}
            <section className="bg-green-950/30 border border-green-400/20 p-6 rounded-lg">
              <h2 className="text-2xl font-mono text-green-300 mb-4 pb-2 border-b border-green-400/30">
                CARD STATS
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cardStats.map((stat, index) => (
                  <div key={index} className="p-4 bg-green-800/10 border border-green-400/20 rounded">
                    <h4 className="text-green-300 font-mono mb-1">{stat.name}</h4>
                    <p className="text-green-100/70 text-sm">{stat.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Card Rarity Section */}
            <section className="bg-green-950/30 border border-green-400/20 p-6 rounded-lg">
              <h2 className="text-2xl font-mono text-green-300 mb-4 pb-2 border-b border-green-400/30 flex items-center">
                <Signal className="mr-2 w-6 h-6" /> CARD RARITIES
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {rarityTypes.map((rarity, index) => (
                  <div key={index} className="p-4 bg-green-800/10 border border-green-400/20 rounded">
                    <h4 className={`font-mono mb-1 ${rarity.color}`}>{rarity.title}</h4>
                    <p className="text-green-100/70 text-sm">{rarity.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Strategy Section */}
            <section className="bg-green-950/30 border border-green-400/20 p-6 rounded-lg">
              <h2 className="text-2xl font-mono text-green-300 mb-4 pb-2 border-b border-green-400/30">
                WINNING STRATEGIES
              </h2>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-mono text-green-300">Top Tips for Victory</h3>
                  <ol className="space-y-3 list-decimal pl-5 text-green-100/80">
                    <li><strong className="text-green-300">Build a Balanced Team:</strong> Include a mix of attackers, midfielders, defenders, and a strong goalkeeper.</li>
                    <li><strong className="text-green-300">Save Your Star Players:</strong> Don't play your high-stat cards too early—save them for critical moments.</li>
                    <li><strong className="text-green-300">Study Your Opponent:</strong> Pay attention to the cards they've played to anticipate their remaining options.</li>
                    <li><strong className="text-green-300">Use Special Abilities:</strong> Special cards can turn the tide of a match when used at the right moment.</li>
                    <li><strong className="text-green-300">Form Tactical Combinations:</strong> Some cards gain bonuses when played together (team or nationality links).</li>
                  </ol>
                </div>
              </div>
            </section>

            {/* Tutorials Section */}
            <section className="bg-green-950/30 border border-green-400/20 p-6 rounded-lg">
              <h2 className="text-2xl font-mono text-green-300 mb-4 pb-2 border-b border-green-400/30 flex items-center">
                <BookOpen className="mr-2 w-6 h-6" /> GAMEPLAY GUIDES
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tutorials.map((tutorial, index) => (
                  <div 
                    key={index} 
                    className="p-4 bg-green-800/10 border border-green-400/20 rounded hover:bg-green-800/20 transition-colors group cursor-pointer"
                    onClick={() => handleTutorialClick(tutorial.url)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`rounded-full p-2 ${tutorial.color}/20 group-hover:${tutorial.color}/30 transition-colors`}>
                        <tutorial.icon className={`w-5 h-5 ${tutorial.color}`} />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h4 className="text-green-300 font-mono mb-1">{tutorial.title}</h4>
                          <span className={`ml-2 text-xs font-bold ${tutorial.color} px-2 py-0.5 rounded border border-current opacity-70`}>
                            {tutorial.type}
                          </span>
                        </div>
                        <p className="text-green-100/70 text-sm">{tutorial.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <button className="bg-green-800/30 hover:bg-green-800/50 text-green-300 border border-green-400/30 px-4 py-2 rounded flex items-center space-x-2 mx-auto">
                  <Video size={16} />
                  <span>View All Guides</span>
                </button>
              </div>
            </section>

            {/* Footer with Links */}
            <div className="mt-12 pt-4 border-t border-green-400/20 flex flex-wrap justify-between items-center">
              <div className="text-green-300/60 text-sm">
                <span className="font-mono">Manager Handbook v2.5</span> • <span>Last Updated: May 2025</span>
              </div>
              <div className="flex space-x-4 text-green-300/60">
                <button onClick={() => window.location.href = '/squad'} className="hover:text-green-300 transition-colors">Squad Builder</button>
                <button onClick={() => window.location.href = '/matchday'} className="hover:text-green-300 transition-colors">Play Match</button>
                <button onClick={() => window.location.href = '/market'} className="hover:text-green-300 transition-colors">Transfer Market</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;