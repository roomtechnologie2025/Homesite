import { useTranslation } from 'react-i18next';
import { Wrench, Code, Rocket, Clock } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Services = () => {
  const { t } = useTranslation();
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.2 });

  const currentServices = [
    {
      icon: Wrench,
      title: t('services.current.maintenance.title'),
      description: t('services.current.maintenance.description'),
      status: 'current',
    },
  ];

  const futureServices = [
    {
      icon: Code,
      title: t('services.future.fullstack.title'),
      description: t('services.future.fullstack.description'),
      status: 'future',
    },
    {
      icon: Rocket,
      title: t('services.future.other.title'),
      description: t('services.future.other.description'),
      status: 'future',
    },
  ];

  return (
    <section
      id="services"
      ref={ref}
      className={`py-20 px-4 bg-gray-50 dark:bg-gray-800 transition-opacity duration-700 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900 dark:text-white">
          {t('services.title')}
        </h2>

        {/* Services actuels */}
        <div className="mb-16">
          <h3 className="text-2xl md:text-3xl font-semibold mb-8 text-gray-800 dark:text-gray-200">
            {t('services.current.title')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {currentServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="group bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-roomtech-yellow hover:border-roomtech-yellow/80"
                >
                  <div className="flex justify-center mb-4">
                    <div className="bg-gradient-to-br from-roomtech-yellow to-yellow-400 p-4 rounded-full group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-lg">
                      <Icon className="text-roomtech-black" size={32} />
                    </div>
                  </div>
                  <h4 className="text-xl font-semibold mb-3 text-center text-gray-900 dark:text-white group-hover:text-roomtech-yellow transition-colors duration-300">
                    {service.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-center">
                    {service.description}
                  </p>
                  <div className="mt-4 text-center">
                    <span className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 px-4 py-2 rounded-full text-sm font-semibold border border-green-300 dark:border-green-700">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      Disponible
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Services futurs */}
        <div>
          <h3 className="text-2xl md:text-3xl font-semibold mb-8 text-gray-800 dark:text-gray-200">
            {t('services.future.title')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {futureServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="group bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-gray-300 dark:border-gray-600 opacity-75 hover:opacity-90"
                >
                  <div className="flex justify-center mb-4">
                    <div className="bg-gray-300 dark:bg-gray-600 p-4 rounded-full group-hover:scale-105 transition-transform duration-300">
                      <Icon
                        className="text-gray-600 dark:text-gray-300"
                        size={32}
                      />
                    </div>
                  </div>
                  <h4 className="text-xl font-semibold mb-3 text-center text-gray-900 dark:text-white">
                    {service.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-center">
                    {service.description}
                  </p>
                  <div className="mt-4 text-center">
                    <span className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-semibold border border-blue-300 dark:border-blue-700">
                      <Clock size={14} />
                      Bientôt disponible
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
