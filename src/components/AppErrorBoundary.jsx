import { Component } from 'react';

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      message: error?.message || 'The dashboard could not finish rendering.',
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App render error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center p-6">
          <div className="w-full max-w-2xl rounded-[32px] border border-rose-400/20 bg-slate-950/80 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-300">App Error</p>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white">
              The dashboard hit a runtime problem.
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              {this.state.message}
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Refresh the page once. If it still appears, the error is now visible instead of being hidden behind a blank
              screen, which makes it much easier to debug.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
