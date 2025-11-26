import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Mail,
  Phone,
  Send,
  CheckCircle2,
  Loader2,
  Github,
  Instagram,
} from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const Contact = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState(null);

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'name':
        if (!value.trim()) {
          error = t('contact.validation.nameRequired');
        } else if (value.trim().length < 2) {
          error = t('contact.validation.nameMinLength');
        }
        break;
      case 'email':
        if (!value.trim()) {
          error = t('contact.validation.emailRequired');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = t('contact.validation.emailInvalid');
        }
        break;
      case 'phone':
        if (value && !/^[\d\s\-\+\(\)]+$/.test(value)) {
          error = t('contact.validation.phoneInvalid');
        }
        break;
      case 'message':
        if (!value.trim()) {
          error = t('contact.validation.messageRequired');
        } else if (value.trim().length < 10) {
          error = t('contact.validation.messageMinLength');
        }
        break;
      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Real-time validation
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors({
        ...errors,
        [name]: error,
      });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({
      ...touched,
      [name]: true,
    });

    const error = validateField(name, value);
    setErrors({
      ...errors,
      [name]: error,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = {
      name: true,
      email: true,
      phone: true,
      message: true,
    };
    setTouched(allTouched);

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);

    // If there are errors, don't submit
    if (Object.keys(newErrors).length > 0) {
      setStatus('error');
      return;
    }

    // Submit form to PHP script
    setStatus('sending');
    
    try {
      // Utiliser l'URL complète ou relative selon l'environnement
      // En développement, utiliser VITE_API_URL si défini, sinon essayer localhost:8000
      // En production, utiliser le chemin relatif
      const isDevelopment = import.meta.env.DEV || !import.meta.env.PROD;
      const apiUrl = isDevelopment 
        ? (import.meta.env.VITE_API_URL || 'http://localhost:8000/contact.php')
        : '/contact.php';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.phone || '', // Utiliser phone comme company ou laisser vide
          message: formData.message,
        }),
      });

      // Vérifier si la réponse est OK
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Essayer de parser le JSON
      let data;
      try {
        const text = await response.text();
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('Erreur de parsing JSON:', parseError);
        throw new Error('Réponse invalide du serveur');
      }

      if (data.success) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
        setErrors({});
        setTouched({});
        // Le message de succès sera affiché pendant 5 secondes
        setTimeout(() => setStatus(null), 5000);
      } else {
        setStatus('error');
        setErrors({ submit: data.error || t('contact.form.error') });
        setTimeout(() => {
          setStatus(null);
          setErrors({});
        }, 5000);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du formulaire:', error);
      console.error('Détails de l\'erreur:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      let errorMessage = t('contact.form.networkError') || 'Erreur de connexion. Veuillez réessayer.';
      
      // Messages d'erreur plus spécifiques
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorMessage = 'Impossible de contacter le serveur. Vérifiez que le serveur PHP est démarré et que contact.php est accessible.';
      } else if (error.message.includes('HTTP error')) {
        errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
      } else if (error.message.includes('JSON')) {
        errorMessage = 'Erreur de traitement. Veuillez réessayer.';
      }
      
      setStatus('error');
      setErrors({ submit: errorMessage });
      setTimeout(() => {
        setStatus(null);
        setErrors({});
      }, 5000);
    }
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="py-20 px-4 bg-white dark:bg-gray-900"
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
                  onBlur={handleBlur}
                  required
                  aria-required="true"
                  aria-invalid={errors.name ? 'true' : 'false'}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.name
                      ? 'border-red-500 dark:border-red-400'
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-roomtech-yellow focus:border-roomtech-yellow transition-all duration-200`}
                />
                {errors.name && (
                  <p
                    id="name-error"
                    className="mt-1 text-sm text-red-600 dark:text-red-400"
                    role="alert"
                  >
                    {errors.name}
                  </p>
                )}
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
                  onBlur={handleBlur}
                  required
                  aria-required="true"
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.email
                      ? 'border-red-500 dark:border-red-400'
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-roomtech-yellow focus:border-roomtech-yellow transition-all duration-200`}
                />
                {errors.email && (
                  <p
                    id="email-error"
                    className="mt-1 text-sm text-red-600 dark:text-red-400"
                    role="alert"
                  >
                    {errors.email}
                  </p>
                )}
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
                  onBlur={handleBlur}
                  aria-invalid={errors.phone ? 'true' : 'false'}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.phone
                      ? 'border-red-500 dark:border-red-400'
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-roomtech-yellow focus:border-roomtech-yellow transition-all duration-200`}
                />
                {errors.phone && (
                  <p
                    id="phone-error"
                    className="mt-1 text-sm text-red-600 dark:text-red-400"
                    role="alert"
                  >
                    {errors.phone}
                  </p>
                )}
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
                  onBlur={handleBlur}
                  required
                  rows="5"
                  aria-required="true"
                  aria-invalid={errors.message ? 'true' : 'false'}
                  aria-describedby={
                    errors.message ? 'message-error' : undefined
                  }
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.message
                      ? 'border-red-500 dark:border-red-400'
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-roomtech-yellow focus:border-roomtech-yellow transition-all duration-200 resize-none`}
                />
                {errors.message && (
                  <p
                    id="message-error"
                    className="mt-1 text-sm text-red-600 dark:text-red-400"
                    role="alert"
                  >
                    {errors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                aria-label="Submit contact form"
                className="w-full bg-roomtech-yellow hover:bg-yellow-500 text-roomtech-black font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {status === 'sending' ? (
                  <>
                    <Loader2
                      size={20}
                      className="animate-spin"
                      aria-hidden="true"
                    />
                    {t('contact.form.sending')}
                  </>
                ) : (
                  <>
                    <Send size={20} aria-hidden="true" />
                    {t('contact.form.send')}
                  </>
                )}
              </button>

              {status === 'success' && (
                <div
                  className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg flex items-center gap-2"
                  role="alert"
                  aria-live="polite"
                >
                  <CheckCircle2 size={20} aria-hidden="true" />
                  {t('contact.form.success')}
                </div>
              )}

              {status === 'error' && (
                <div
                  className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg"
                  role="alert"
                  aria-live="assertive"
                >
                  {errors.submit || t('contact.form.error')}
                </div>
              )}
            </form>
          </div>

          {/* Informations de contact */}
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="flex flex-col justify-center space-y-8"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, x: 30 },
                visible: { opacity: 1, x: 0 },
              }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-600 shadow-md hover:shadow-xl opacity-75"
            >
              <div className="flex items-center mb-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 6 }}
                  className="bg-roomtech-yellow p-3 rounded-full mr-4"
                >
                  <Mail className="text-roomtech-black" size={24} />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {t('contact.info.email')}
                  </h3>
                  <a
                    href="mailto:roomtechnologie2025@gmail.com"
                    aria-label="Send email to RoomTech"
                    className="text-roomtech-yellow hover:text-yellow-500 transition-colors"
                  >
                    roomtechnologie2025@gmail.com
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, x: 30 },
                visible: { opacity: 1, x: 0 },
              }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl"
            >
              <div className="flex items-center mb-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 6 }}
                  className="bg-roomtech-yellow p-3 rounded-full mr-4"
                >
                  <Phone className="text-roomtech-black" size={24} />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {t('contact.info.phone')}
                  </h3>
                  <a
                    href="tel:+25377080980"
                    aria-label="Call RoomTech"
                    className="text-roomtech-yellow hover:text-yellow-500 transition-colors"
                  >
                    +253 77 08 09 80 <br />
                    +253 77 25 77 77
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Social Links */}
            <motion.div
              variants={{
                hidden: { opacity: 0, x: 30 },
                visible: { opacity: 1, x: 0 },
              }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                {t('contact.social.title')}
              </h3>
              <div className="flex items-center gap-4">
                <motion.a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit our GitHub"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center w-12 h-12 bg-roomtech-yellow hover:bg-yellow-500 text-roomtech-black rounded-full shadow-lg hover:shadow-xl"
                >
                  <Github size={24} />
                </motion.a>
                <motion.a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit our Instagram"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center w-12 h-12 bg-roomtech-yellow hover:bg-yellow-500 text-roomtech-black rounded-full shadow-lg hover:shadow-xl"
                >
                  <Instagram size={24} />
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
