import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, Send } from 'lucide-react';

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pour l'instant, juste simuler l'envoi
    setStatus('sending');
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setStatus(null), 3000);
    }, 1000);
  };

  return (
    <section
      id="contact"
      className="py-20 px-4 bg-white dark:bg-gray-900 animate-fade-in"
    >
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900 dark:text-white">
          {t('contact.title')}
        </h2>
        
        <p className="text-lg md:text-xl text-center mb-12 text-gray-600 dark:text-gray-400">
          {t('contact.subtitle')}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Formulaire */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                >
                  {t('contact.form.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-roomtech-yellow transition-colors"
                />
              </div>
              
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                >
                  {t('contact.form.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-roomtech-yellow transition-colors"
                />
              </div>
              
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                >
                  {t('contact.form.phone')}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-roomtech-yellow transition-colors"
                />
              </div>
              
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                >
                  {t('contact.form.message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-roomtech-yellow transition-colors resize-none"
                />
              </div>
              
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-roomtech-yellow hover:bg-yellow-500 text-roomtech-black font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === 'sending' ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    {t('contact.form.sending')}
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    {t('contact.form.send')}
                  </>
                )}
              </button>
              
              {status === 'success' && (
                <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg">
                  {t('contact.form.success')}
                </div>
              )}
              
              {status === 'error' && (
                <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg">
                  {t('contact.form.error')}
                </div>
              )}
            </form>
          </div>
          
          {/* Informations de contact */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <div className="bg-roomtech-yellow p-3 rounded-full mr-4">
                  <Mail className="text-roomtech-black" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {t('contact.info.email')}
                  </h3>
                  <a
                    href="mailto:contact@roomtech.com"
                    className="text-roomtech-yellow hover:text-yellow-500 transition-colors"
                  >
                    roomtechnologie2025@gmail.com
                  </a>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <div className="bg-roomtech-yellow p-3 rounded-full mr-4">
                  <Phone className="text-roomtech-black" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {t('contact.info.phone')}
                  </h3>
                  <a
                    href="tel:+33123456789"
                    className="text-roomtech-yellow hover:text-yellow-500 transition-colors"
                  >
                    +253 77 08 09 80
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

