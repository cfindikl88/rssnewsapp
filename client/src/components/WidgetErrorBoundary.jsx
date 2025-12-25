import React from 'react';

class WidgetErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error(`Widget error in ${this.props.widgetName}:`, error, errorInfo);

        // Log to error service
        // if (window.errorLoggingService) {
        //   window.errorLoggingService.logError(error, {
        //     ...errorInfo,
        //     widget: this.props.widgetName
        //   });
        // }
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 mb-4">
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm font-medium">
                            {this.props.widgetName} yüklenemedi
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default WidgetErrorBoundary;
