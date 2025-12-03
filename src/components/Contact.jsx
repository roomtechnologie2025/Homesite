import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Mail,
  Phone,
  Send,
  CheckCircle2,
  Loader2,
  Github,
  Instagram,
  AlertCircle,
} from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import emailjs from '@emailjs/browser';
import { emailjsConfig, isEmailjsConfigured } from '../config/emailjs';

// Helper function to get error messages with fallback
const getErrorMessage = (t, key, fallback) => {
  const message = t(key);
  return message && message !== key ? message : fallback;
};

const Contact = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [status, setStatus] = useState(null);
  const [submitError, setSubmitError] = useState('');

  // Create Zod schema with translated error messages (memoized to avoid recreation on every render)
  const contactSchema = useMemo(
    () =>
      z.object({
        name: z
          .string()
          .min(
            1,
            getErrorMessage(
              t,
              'contact.validation.nameRequired',
              'Le nom est requis'
            )
          )
          .min(
            2,
            getErrorMessage(
              t,
              'contact.validation.nameMinLength',
              'Le nom doit contenir au moins 2 caractères'
            )
          )
          .max(100, 'Le nom ne peut pas dépasser 100 caractères')
          .trim(),
        email: z
          .email(
            getErrorMessage(
              t,
              'contact.validation.emailInvalid',
              "L'email n'est pas valide"
            )
          )
          .max(255, "L'email ne peut pas dépasser 255 caractères")
          .toLowerCase()
          .trim(),
        phone: z
          .string()
          .optional()
          .refine(
            (val) => !val || /^[\d\s\-\+\(\)]+$/.test(val),
            getErrorMessage(
              t,
              'contact.validation.phoneInvalid',
              "Le numéro de téléphone n'est pas valide"
            )
          )
          .transform((val) => val?.trim() || ''),
        message: z
          .string()
          .min(
            1,
            getErrorMessage(
              t,
              'contact.validation.messageRequired',
              'Le message est requis'
            )
          )
          .min(
            10,
            getErrorMessage(
              t,
              'contact.validation.messageMinLength',
              'Le message doit contenir au moins 10 caractères'
            )
          )
          .max(2000, 'Le message ne peut pas dépasser 2000 caractères')
          .trim(),
      }),
    [t]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm({
    resolver: zodResolver(contactSchema),
    mode: 'onBlur', // Validate on blur for better UX
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
    },
  });

  // Initialiser EmailJS une seule fois au chargement du composant
  useEffect(() => {
    if (isEmailjsConfigured()) {
      emailjs.init(emailjsConfig.publicKey);
    }
  }, []);

  // Helper function to get EmailJS error message
  const getEmailJSErrorMessage = (error) => {
    // Check for EmailJS specific error codes
    if (error?.text) {
      const errorText = error.text.toLowerCase();

      if (
        errorText.includes('invalid template id') ||
        errorText.includes('template')
      ) {
        return "Configuration EmailJS incorrecte (Template ID invalide). Veuillez contacter l'administrateur.";
      }
      if (
        errorText.includes('invalid service id') ||
        errorText.includes('service')
      ) {
        return "Configuration EmailJS incorrecte (Service ID invalide). Veuillez contacter l'administrateur.";
      }
      if (
        errorText.includes('invalid public key') ||
        errorText.includes('public key') ||
        errorText.includes('api key')
      ) {
        return "Configuration EmailJS incorrecte (Clé publique invalide). Veuillez contacter l'administrateur.";
      }
      if (errorText.includes('quota') || errorText.includes('limit')) {
        return "Limite d'envoi d'emails atteinte. Veuillez réessayer plus tard ou contacter l'administrateur.";
      }
      if (errorText.includes('network') || errorText.includes('connection')) {
        return 'Erreur de connexion. Vérifiez votre connexion internet et réessayez.';
      }

      return error.text;
    }

    if (error?.message) {
      return error.message;
    }

    if (error?.status) {
      return `Erreur ${error.status}: ${
        error.text || "Erreur lors de l'envoi de l'email"
      }`;
    }

    return getErrorMessage(
      t,
      'contact.form.error',
      "Erreur lors de l'envoi. Veuillez réessayer."
    );
  };

  const onSubmit = async (data) => {
    // Reset previous errors
    setSubmitError('');
    setStatus(null);

    // Vérifier que EmailJS est configuré
    if (!isEmailjsConfigured()) {
      const errorMsg =
        "EmailJS n'est pas configuré. Veuillez contacter l'administrateur.";
      setSubmitError(errorMsg);
      setStatus('error');
      setError('root', { message: errorMsg });
      setTimeout(() => {
        setStatus(null);
        setSubmitError('');
      }, 5000);
      return;
    }

    setStatus('sending');

    try {
      // Préparer les paramètres du template
      const templateParams = {
        name: data.name,
        email: data.email,
        phone: data.phone || 'Non communiqué',
        message: data.message,
        from_name: data.name,
        reply_to: data.email,
      };

      // Envoyer l'email via EmailJS
      const response = await emailjs.send(
        emailjsConfig.serviceId,
        emailjsConfig.templateId,
        templateParams,
        emailjsConfig.publicKey
      );

      // EmailJS retourne un statut 200 si l'envoi est réussi
      if (response.status === 200 || response.text === 'OK') {
        setStatus('success');
        reset(); // Reset form using react-hook-form
        // Le message de succès sera affiché pendant 5 secondes
        setTimeout(() => setStatus(null), 5000);
      } else {
        throw new Error(
          `Erreur lors de l'envoi: ${response.status} - ${response.text}`
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire:", error);

      const errorMessage = getEmailJSErrorMessage(error);
      setSubmitError(errorMessage);
      setStatus('error');
      setError('root', { message: errorMessage });

      setTimeout(() => {
        setStatus(null);
        setSubmitError('');
      }, 8000); // Show error for 8 seconds
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
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
              noValidate
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                >
                  {t('contact.form.name')}
                  <span className="text-red-500 ml-1" aria-label="required">
                    *
                  </span>
                </label>
                <input
                  type="text"
                  id="name"
                  {...register('name')}
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
                    className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                    role="alert"
                  >
                    <AlertCircle size={14} aria-hidden="true" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                >
                  {t('contact.form.email')}
                  <span className="text-red-500 ml-1" aria-label="required">
                    *
                  </span>
                </label>
                <input
                  type="email"
                  id="email"
                  {...register('email')}
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
                    className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                    role="alert"
                  >
                    <AlertCircle size={14} aria-hidden="true" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                >
                  {t('contact.form.phone')}
                  <span className="text-gray-400 text-xs ml-1">
                    (optionnel)
                  </span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  {...register('phone')}
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
                    className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                    role="alert"
                  >
                    <AlertCircle size={14} aria-hidden="true" />
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                >
                  {t('contact.form.message')}
                  <span className="text-red-500 ml-1" aria-label="required">
                    *
                  </span>
                </label>
                <textarea
                  id="message"
                  {...register('message')}
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
                    className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                    role="alert"
                  >
                    <AlertCircle size={14} aria-hidden="true" />
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* Root error (for submit errors) */}
              {errors.root && (
                <div
                  className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg flex items-center gap-2"
                  role="alert"
                  aria-live="assertive"
                >
                  <AlertCircle size={20} aria-hidden="true" />
                  {errors.root.message}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || status === 'sending'}
                aria-label="Submit contact form"
                className="w-full bg-roomtech-yellow hover:bg-yellow-500 text-roomtech-black font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {isSubmitting || status === 'sending' ? (
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
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg flex items-center gap-2"
                  role="alert"
                  aria-live="polite"
                >
                  <CheckCircle2 size={20} aria-hidden="true" />
                  {t('contact.form.success')}
                </motion.div>
              )}

              {status === 'error' && submitError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg flex items-start gap-2"
                  role="alert"
                  aria-live="assertive"
                >
                  <AlertCircle
                    size={20}
                    className="mt-0.5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span>{submitError}</span>
                </motion.div>
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
