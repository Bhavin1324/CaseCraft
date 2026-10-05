import { Component } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('CaseCraft caught an unexpected render error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans">
          <div className="bg-slate-900 border border-rose-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Clinical Simulation Alert</h2>
              <p className="text-xs text-slate-400 mt-1">
                An unexpected rendering issue was intercepted. Your case notes and consultation progress are preserved.
              </p>
            </div>
            {this.state.error?.message && (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-rose-300 text-left overflow-x-auto max-h-32">
                {this.state.error.message}
              </div>
            )}
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReset}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-950/40"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Return to Consultation
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
