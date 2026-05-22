import { Link } from 'react-router-dom';
import { Brain } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">Neuro<span className="text-violet-400">Forge</span></span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Train your brain like a pro athlete. Cognitive performance tools for competitive gamers, students, and high-performance individuals.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm text-gray-500">
              <li><Link to="/pricing" className="hover:text-gray-300 transition-colors">Pricing</Link></li>
              <li><Link to="/tests" className="hover:text-gray-300 transition-colors">Training Tests</Link></li>
              <li><Link to="/analytics" className="hover:text-gray-300 transition-colors">Analytics</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Account</h4>
            <ul className="space-y-2.5 text-sm text-gray-500">
              <li><Link to="/login" className="hover:text-gray-300 transition-colors">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-gray-300 transition-colors">Create Account</Link></li>
              <li><Link to="/settings" className="hover:text-gray-300 transition-colors">Settings</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2.5 text-sm text-gray-500">
              <li><Link to="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/refunds" className="hover:text-gray-300 transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} NeuroForge. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <span>Secure payments by Paddle</span>
            <span>·</span>
            <Link to="/privacy" className="hover:text-gray-400">Privacy</Link>
            <span>·</span>
            <Link to="/terms" className="hover:text-gray-400">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
