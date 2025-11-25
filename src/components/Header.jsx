import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Moon, Sun, Menu, X, Globe } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import Logo from './Logo';

const Header = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);

  const languages = [
    { code: 'fr', name: 'FR' },
    { code: 'en', name: 'EN' },
    { code: 'so', name: 'SO' },
  ];

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('language', langCode);
  };

  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  useEffect(() => {
    const handleScroll = () => {
      // Check if scrolled
      setIsScrolled(window.scrollY > 50);

      // Update active section
      const sections = ['home', 'about', 'services', 'news', 'blog', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const navItems = [
    { id: 'home', key: 'nav.home' },
    { id: 'about', key: 'nav.about' },
    { id: 'services', key: 'nav.services' },
    { id: 'news', key: 'nav.news' },
    { id: 'blog', key: 'nav.blog' },
    { id: 'contact', key: 'nav.contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 dark:bg-gray-900/95 shadow-lg'
          : 'bg-white/90 dark:bg-gray-900/90 shadow-md'
      }`}
      role="banner"
    >
      <nav className="container mx-auto px-4 py-4" aria-label="Main navigation">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => scrollToSection('home')}
            className="cursor-pointer"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && scrollToSection('home')}
            aria-label="Go to home"
          >
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <div
            className="hidden md:flex items-center gap-8"
            role="navigation"
            aria-label="Main menu"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                aria-label={`Navigate to ${t(item.key)} section`}
                aria-current={activeSection === item.id ? 'page' : undefined}
                className={`relative px-3 py-2 rounded-md transition-all duration-300 ${
                  activeSection === item.id
                    ? 'text-roomtech-yellow font-semibold'
                    : 'text-gray-700 dark:text-gray-300 hover:text-roomtech-yellow'
                }`}
              >
                {t(item.key)}
                {activeSection === item.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-roomtech-yellow rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="relative group">
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Select language"
                aria-expanded="false"
                aria-haspopup="true"
              >
                <Globe size={20} aria-hidden="true" />
                <span className="hidden sm:inline">
                  {i18n.language.toUpperCase()}
                </span>
              </button>
              <div
                className="absolute right-0 mt-2 w-20 bg-white dark:bg-gray-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-gray-200 dark:border-gray-700"
                role="menu"
              >
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    role="menuitem"
                    aria-label={`Change language to ${lang.name}`}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors ${
                      i18n.language === lang.code
                        ? 'text-roomtech-yellow font-semibold'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700 transition-all duration-300 overflow-hidden ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
          role="navigation"
          aria-label="Mobile menu"
        >
          <div className="flex flex-col gap-2 mt-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                aria-label={`Navigate to ${t(item.key)} section`}
                aria-current={activeSection === item.id ? 'page' : undefined}
                className={`px-4 py-2 rounded-md text-left transition-colors ${
                  activeSection === item.id
                    ? 'text-roomtech-yellow font-semibold bg-yellow-50 dark:bg-yellow-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {t(item.key)}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
