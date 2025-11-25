import { useTranslation } from 'react-i18next';
import { ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
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
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-20 left-10 w-72 h-72 bg-roomtech-yellow/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-roomtech-yellow/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.08, 0.05] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-roomtech-yellow/5 via-transparent to-roomtech-yellow/5 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto max-w-7xl text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex justify-center"
        >
          <Logo className="scale-150" showText={false} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-roomtech-yellow to-yellow-500 bg-clip-text text-transparent leading-tight tracking-tight drop-shadow-sm dark:drop-shadow-md"
        >
          {t('hero.title')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl mb-4 text-gray-700 dark:text-gray-300 leading-relaxed tracking-wide"
        >
          {t('hero.subtitle')}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg md:text-xl mb-12 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed tracking-wide"
        >
          {t('hero.description')}
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToContact}
          aria-label="Go to contact section"
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-roomtech-yellow hover:bg-yellow-500 text-roomtech-black font-semibold px-8 py-4 rounded-lg text-lg shadow-lg hover:shadow-xl hover:shadow-roomtech-yellow/50"
        >
          {t('hero.cta')}
        </motion.button>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-16"
          aria-hidden="true"
        >
          <ArrowDown
            className="mx-auto text-gray-400 dark:text-gray-500"
            size={32}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
