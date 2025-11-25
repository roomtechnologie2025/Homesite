import { useTranslation } from 'react-i18next';
import { Home, DollarSign, Users } from 'lucide-react';

const About = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Home,
      title: t('about.feature1.title'),
      description: t('about.feature1.description'),
    },
    {
      icon: DollarSign,
      title: t('about.feature2.title'),
      description: t('about.feature2.description'),
    },
    {
      icon: Users,
      title: t('about.feature3.title'),
      description: t('about.feature3.description'),
    },
  ];

  return (
    <section
      id="about"
      className="py-20 px-4 bg-white dark:bg-gray-900 animate-fade-in"
    >
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900 dark:text-white">
          {t('about.title')}
        </h2>
        
        <p className="text-lg md:text-xl text-center mb-16 text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
          {t('about.description')}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex justify-center mb-4">
                  <div className="bg-roomtech-yellow p-4 rounded-full">
                    <Icon className="text-roomtech-black" size={32} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default About;

