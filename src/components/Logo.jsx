import { useTheme } from './ThemeProvider';

const Logo = ({ className = '' }) => {
  const { theme } = useTheme();

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        {theme === 'dark' ? (
          <img 
            src="/noir.jpg" 
            alt="RoomTech Logo" 
            className="h-12 w-auto" 
            loading="lazy"
            width="48"
            height="48"
          />
        ) : (
          <img 
            src="/blanc.jpg" 
            alt="RoomTech Logo" 
            className="h-12 w-auto" 
            loading="lazy"
            width="48"
            height="48"
          />
        )}
      </div>
      <span className="text-2xl font-bold text-roomtech-yellow dark:text-roomtech-yellow">
        ROOM TECH
      </span>
    </div>
  );
};

export default Logo;

