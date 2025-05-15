import React, { useCallback, useEffect } from 'react';

const COLORS = {
  BRILLIANT_BLUE: '#0066FF',
  ROYAL_RED: '#CC0000',
  VIBRANT_YELLOW: '#FFCC00',
  FOREST_GREEN: '#006600',
  PURPLE_PRIDE: '#660099'
};

const DEFAULT_MAPPINGS = {
  Barcelona: 'BRILLIANT_BLUE',
  Liverpool: 'ROYAL_RED',
  BVB: 'VIBRANT_YELLOW',
  Celtic: 'FOREST_GREEN',
  RealMadrid: 'PURPLE_PRIDE'
};

// Theme colors for green football theme
const THEME = {
  background: '#0c2410',
  cardBackground: '#153815',
  headerBackground: '#194219',
  textPrimary: '#d9ffda',
  textSecondary: '#a7cca7',
  accentGreen: '#3dcc3d',
  accentDark: '#0a3a0a',
  buttonHover: '#2a582a'
};

const Section = ({ title, content }) => {
  if (title === 'Club Badges') {
    return (
      <div className="mb-6">
        <h3 className="text-xl mb-3" style={{ color: THEME.accentGreen }}>{title}</h3>
        <p className="mb-3" style={{ color: THEME.textSecondary }}>
          Your players will wear badges based on your home club:
        </p>
        <ul className="space-y-2">
          {Object.entries(DEFAULT_MAPPINGS).map(([club, colorKey]) => (
            <li key={club} className="pl-4 relative flex items-center gap-2">
              <span 
                className="absolute left-0"
                style={{ color: COLORS[colorKey] }}
              >
                •
              </span>
              <span style={{ color: COLORS[colorKey] }}>{club}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const formatContent = (content) => {
    if (!content) return null;
    if (content.includes('\n\n•')) {
      const [intro, listContent] = content.split('\n\n');
      const listItems = listContent.split('\n• ').filter(Boolean);
      
      return (
        <>
          <p className="mb-3" style={{ color: THEME.textSecondary }}>{intro}</p>
          <ul className="space-y-2">
            {listItems.map((item, index) => (
              <li key={index} className="pl-4 relative" style={{ color: THEME.textSecondary }}>
                <span className="absolute left-0" style={{ color: THEME.accentGreen }}>•</span>
                {item}
              </li>
            ))}
          </ul>
        </>
      );
    }
    return content.split('\n').map((line, index) => (
      line ? <p key={index} className="mb-2" style={{ color: THEME.textSecondary }}>{line}</p> : null
    ));
  };

  return (
    <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: THEME.cardBackground }}>
      {title && <h3 className="text-xl mb-3" style={{ color: THEME.accentGreen }}>{title}</h3>}
      {formatContent(content)}
    </div>
  );
};

const ImageSection = ({ url, width, height }) => (
  <div className="flex justify-center mb-6">
    <img 
      src={url} 
      className="rounded-lg max-w-full h-auto border-2"
      style={{ borderColor: THEME.accentDark, width, height }}
      alt="Guide content" 
    />
  </div>
);

const VideoSection = ({ url, title, width, height }) => (
  <div className="mb-6 flex flex-col items-center">
    <div className="rounded-lg overflow-hidden border-2 mb-2" style={{ borderColor: THEME.accentDark }}>
      <iframe
        src={url}
        title={title || "Tutorial video"}
        width={width || "560"}
        height={height || "315"}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
    {title && <p className="text-center" style={{ color: THEME.textSecondary }}>{title}</p>}
  </div>
);

const GameTutorial = ({ content, onClose }) => {
  // Add custom scrollbar styles when component mounts
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .scrollbar-custom::-webkit-scrollbar {
        width: 8px;
      }
      .scrollbar-custom::-webkit-scrollbar-track {
        background: ${THEME.accentDark};
        border-radius: 4px;
      }
      .scrollbar-custom::-webkit-scrollbar-thumb {
        background: ${THEME.accentGreen};
        border-radius: 4px;
      }
      .scrollbar-custom::-webkit-scrollbar-thumb:hover {
        background: ${THEME.buttonHover};
      }
    `;
    document.head.appendChild(styleElement);
    
    // Clean up when component unmounts
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const renderContent = useCallback((item) => {
    switch (item.gType) {
      case 'section':
        return (
          <Section 
            key={item.data.title || Math.random()} 
            title={item.data.title} 
            content={item.data.content} 
          />
        );
      case 'image':
        return (
          <ImageSection 
            key={item.data.url || Math.random()} 
            url={item.data.url} 
            width={item.data.width}
            height={item.data.height}
          />
        );
      case 'video':
        return (
          <VideoSection
            key={item.data.url || Math.random()}
            url={item.data.url}
            title={item.data.title}
            width={item.data.width}
            height={item.data.height}
          />
        );
      default:
        return null;
    }
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="w-[1200px] h-[800px] rounded-lg flex flex-col shadow-xl" style={{ backgroundColor: THEME.background }}>
        {/* Title Bar */}
        <div className="h-12 rounded-t-lg flex items-center justify-between px-5" style={{ backgroundColor: THEME.headerBackground }}>
          <div className="flex items-center">
            <span className="mr-2 text-2xl" style={{ color: THEME.accentGreen }}>⚽</span>
            <h2 className="text-xl font-bold" style={{ color: THEME.textPrimary }}>Manager's Guide</h2>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ backgroundColor: THEME.accentDark, color: THEME.textPrimary }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = THEME.buttonHover}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = THEME.accentDark}
          >
            ✕
          </button>
        </div>
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-custom">
          <div className="space-y-4">
            {content.map(renderContent)}
          </div>
        </div>
        {/* Footer */}
        <div className="h-10 rounded-b-lg flex items-center justify-center" style={{ backgroundColor: THEME.headerBackground }}>
          <span style={{ color: THEME.textSecondary }}>Use ⬆️ ⬇️ keys to scroll</span>
        </div>
      </div>
    </div>
  );
};

export default GameTutorial;