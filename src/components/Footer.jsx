import { useTranslation } from 'react-i18next';
import Logo from './Logo';

const Footer = () => {
  const { t } = useTranslation();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300 py-12 px-4" role="contentinfo">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo et description */}
          <div>
            <Logo className="mb-4" />
            <p className="text-gray-400">
              {t('about.description')}
            </p>
          </div>
          
          {/* Liens rapides */}
          <nav aria-label="Footer navigation">
            <h3 className="text-white font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollToSection('home')}
                  aria-label={`Navigate to ${t('nav.home')} section`}
                  className="text-gray-400 hover:text-roomtech-yellow transition-colors"
                >
                  {t('nav.home')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('about')}
                  aria-label={`Navigate to ${t('nav.about')} section`}
                  className="text-gray-400 hover:text-roomtech-yellow transition-colors"
                >
                  {t('nav.about')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('services')}
                  aria-label={`Navigate to ${t('nav.services')} section`}
                  className="text-gray-400 hover:text-roomtech-yellow transition-colors"
                >
                  {t('nav.services')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('contact')}
                  aria-label={`Navigate to ${t('nav.contact')} section`}
                  className="text-gray-400 hover:text-roomtech-yellow transition-colors"
                >
                  {t('nav.contact')}
                </button>
              </li>
            </ul>
          </nav>
          
          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('contact.title')}</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a
                  href="mailto:roomtechnologie2025@gmail.com"
                  aria-label="Send email to RoomTech"
                  className="hover:text-roomtech-yellow transition-colors"
                >
                  roomtechnologie2025@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+25377080980"
                  aria-label="Call RoomTech"
                  className="hover:text-roomtech-yellow transition-colors"
                >
                  +253 77 08 09 80
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} {t('footer.company')}. {t('footer.rights')}.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

