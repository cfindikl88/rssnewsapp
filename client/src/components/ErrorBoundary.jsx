import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        this.setState({ error, errorInfo });

        // TODO: Send to error logging service (Sentry, LogRocket)
        // if (window.errorLoggingService) {
        //   window.errorLoggingService.logError(error, errorInfo);
        // }
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md">
                        <div className="flex items-center gap-3 mb-4">
                            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <h2 className="text-2xl font-bold text-red-600">Bir şeyler yanlış gitti</h2>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-6">
                            Üzgünüz, beklenmedik bir hata oluştu. Lütfen sayfayı yenileyerek tekrar deneyin.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg"
                            aria-label="Sayfayı yenile"
                        >
                            Sayfayı Yenile
                        </button>
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mt-6 text-sm">
                                <summary className="cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                                    Hata Detayları (Geliştirici Modu)
                                </summary>
                                <pre className="mt-3 text-xs text-red-600 bg-red-50 dark:bg-red-900/20 p-4 rounded overflow-auto max-h-48">
                                    {this.state.error.toString()}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
