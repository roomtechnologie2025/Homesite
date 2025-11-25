import { useTranslation } from 'react-i18next';
import { ArrowDown } from 'lucide-react';
import Logo from './Logo';

const Hero = () => {
  const { t } = useTranslation();

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20 px-4"
    >
      <div className="container mx-auto text-center">
        <div className="mb-8 flex justify-center">
          <Logo className="scale-150" />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900 dark:text-white">
          {t('hero.title')}
        </h1>
        
        <p className="text-xl md:text-2xl mb-4 text-gray-700 dark:text-gray-300">
          {t('hero.subtitle')}
        </p>
        
        <p className="text-lg md:text-xl mb-12 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {t('hero.description')}
        </p>
        
        <button
          onClick={scrollToContact}
          aria-label="Go to contact section"
          className="bg-roomtech-yellow hover:bg-yellow-500 text-roomtech-black font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          {t('hero.cta')}
        </button>
        
        <div className="mt-16 animate-bounce" aria-hidden="true">
          <ArrowDown className="mx-auto text-gray-400 dark:text-gray-500" size={32} />
        </div>
      </div>
    </section>
  );
};

export default Hero;

