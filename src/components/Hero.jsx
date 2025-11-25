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
      className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20 px-4 overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none bg-pattern">
        <div className="absolute top-20 left-10 w-72 h-72 bg-roomtech-yellow/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-roomtech-yellow/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-roomtech-yellow/5 via-transparent to-roomtech-yellow/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-7xl text-center relative z-10">
        <div className="mb-8 flex justify-center animate-fade-in">
          <Logo className="scale-150" />
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900 dark:text-white animate-slide-up gradient-text">
          {t('hero.title')}
        </h1>

        <p
          className="text-xl md:text-2xl mb-4 text-gray-700 dark:text-gray-300 animate-slide-up"
          style={{ animationDelay: '0.1s' }}
        >
          {t('hero.subtitle')}
        </p>

        <p
          className="text-lg md:text-xl mb-12 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto animate-slide-up"
          style={{ animationDelay: '0.2s' }}
        >
          {t('hero.description')}
        </p>

        <button
          onClick={scrollToContact}
          aria-label="Go to contact section"
          className="bg-roomtech-yellow hover:bg-yellow-500 text-roomtech-black font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-roomtech-yellow/50 animate-slide-up"
          style={{ animationDelay: '0.3s' }}
        >
          {t('hero.cta')}
        </button>

        <div className="mt-16 animate-bounce" aria-hidden="true">
          <ArrowDown
            className="mx-auto text-gray-400 dark:text-gray-500"
            size={32}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
