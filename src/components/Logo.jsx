import { useTheme } from '../hooks/useTheme';

const Logo = ({ className = '', showText = true }) => {
  const { theme } = useTheme();

  const logoSrc = theme === 'dark' ? '/noir.jpg' : '/blanc.jpg';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src={logoSrc}
        alt="RoomTech Logo"
        className="h-12 w-auto"
        loading="lazy"
        width="48"
        height="48"
      />

      {showText && (
        <span className="text-2xl font-bold text-roomtech-yellow dark:text-roomtech-yellow">
          ROOM TECH
        </span>
      )}
    </div>
  );
};

export default Logo;
