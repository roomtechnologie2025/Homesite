import { useTranslation } from 'react-i18next';
import { BookOpen, ArrowRight, FileText } from 'lucide-react';

const Blog = () => {
  const { t } = useTranslation();

  // Pour l'instant, pas d'articles. Cette section peut être étendue plus tard
  const blogPosts = [];

  return (
    <section
      id="blog"
      className="py-20 px-4 bg-gray-50 dark:bg-gray-800"
    >
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-center mb-4">
          <BookOpen className="text-roomtech-yellow mr-3" size={32} />
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            {t('blog.title')}
          </h2>
        </div>
        
        <p className="text-lg md:text-xl text-center mb-12 text-gray-600 dark:text-gray-400">
          {t('blog.subtitle')}
        </p>
        
        {blogPosts.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-roomtech-yellow/10 dark:bg-roomtech-yellow/20 mb-6">
              <FileText className="text-roomtech-yellow" size={48} />
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
              {t('blog.noPosts')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
              We're preparing insightful articles and guides about technology and IT maintenance.
            </p>
            <span className="inline-flex items-center gap-2 bg-roomtech-yellow/10 dark:bg-roomtech-yellow/20 text-roomtech-yellow px-4 py-2 rounded-full text-sm font-semibold">
              <BookOpen size={16} />
              Coming Soon
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <article
                key={index}
                className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="mb-4">
                  <span className="text-sm text-roomtech-yellow font-semibold">
                    {post.date}
                  </span>
                  <h3 className="text-xl font-semibold mt-2 mb-3 text-gray-900 dark:text-white">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {post.excerpt}
                  </p>
                </div>
                <button className="flex items-center text-roomtech-yellow hover:text-yellow-500 font-semibold transition-colors">
                  {t('blog.readMore')}
                  <ArrowRight className="ml-2" size={16} />
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Blog;

