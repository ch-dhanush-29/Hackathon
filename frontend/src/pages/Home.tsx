import { Link } from 'react-router-dom';
import { Search, MessageSquare, FileText, BookOpen, CheckCircle } from 'lucide-react';

const features = [
  { icon: Search, title: 'Smart Paper Search', desc: 'Find research papers across multiple databases with AI-powered search' },
  { icon: MessageSquare, title: 'AI Chat Assistant', desc: 'Ask questions about your research papers and get intelligent responses' },
  { icon: FileText, title: 'DocSpace Editor', desc: 'Create and edit documents with rich text formatting like Google Docs' },
  { icon: BookOpen, title: 'Literature Review', desc: 'Generate comprehensive literature reviews from selected papers' },
];

const benefits = [
  'Save 80% time on literature review',
  'Access millions of research papers',
  'AI-powered insights and summaries',
  'Collaborative workspace features',
  'Export to multiple formats',
];

export default function HomePage() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="font-bold text-lg">ResearchHub AI</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Welcome, {user.name || 'Researcher'}</span>
          <Link to="/dashboard" className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700">
            Go to Dashboard →
          </Link>
        </div>
      </div>

      <div className="text-center py-12">
        <h1 className="text-4xl font-bold mb-2">
          <span className="text-primary-600">Your AI-Powered</span>{' '}
          <span className="text-gray-900">Research Assistant</span>
        </h1>
        <p className="text-gray-500 mt-3 max-w-xl mx-auto">
          Accelerate your research with intelligent paper discovery, AI-powered insights, and collaborative document editing - all in one platform.
        </p>
        <div className="flex gap-3 justify-center mt-6">
          <Link to="/search" className="px-6 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Start Researching</Link>
          <Link to="/docspace" className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">Try DocSpace</Link>
        </div>
      </div>

      {/* Features */}
      <h2 className="text-xl font-bold text-center mb-6">Powerful Features for Modern Research</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {features.map((f) => (
          <div key={f.title} className="bg-white border border-gray-200 rounded-xl p-5 text-center hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center mx-auto mb-3">
              <f.icon size={20} className="text-primary-600" />
            </div>
            <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
            <p className="text-xs text-gray-500">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Benefits */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-700 rounded-2xl p-8 text-white text-center">
        <h2 className="text-xl font-bold mb-4">Why Choose ResearchHub AI?</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {benefits.map((b) => (
            <div key={b} className="flex items-center gap-2 text-sm">
              <CheckCircle size={16} className="text-green-300" />
              {b}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
