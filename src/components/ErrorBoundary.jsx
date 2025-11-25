import { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    const { t } = this.props;

    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="text-red-500" size={48} />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              {t('error.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t('error.message')}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="bg-roomtech-yellow hover:bg-yellow-500 text-roomtech-black font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              {t('error.refreshButton')}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const ErrorBoundaryWithTranslation = withTranslation()(ErrorBoundary);

export default ErrorBoundaryWithTranslation;
