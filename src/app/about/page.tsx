import Link from 'next/link';
import { 
  ShoppingBag, 
  TrendingUp, 
  Shield, 
  Zap, 
  Globe, 
  Award,
  ArrowRight,
  Sparkles,
  CheckCircle,
  BarChart3,
  Clock,
  Users,
  Star
} from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950/50 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6">
            <Sparkles size={16} className="animate-pulse" />
            About Us
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              SmartScan
            </span>
            <span className="text-white">Price</span>
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            Revolutionizing online shopping with intelligent price comparison technology
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-20">
        {/* Introduction Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 mb-12">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/20">
              <ShoppingBag className="h-8 w-8 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-3">Our Mission</h2>
              <p className="text-white/60 leading-relaxed text-lg">
                Nowadays, online shopping is gaining massive popularity because it is convenient and easy to use. 
                Nevertheless, the ability to compare prices of products across various online commerce sites is one 
                of the greatest problems consumers must contend with.
              </p>
              <p className="text-white/60 leading-relaxed text-lg mt-4">
                Our specialized Price Comparison Application solves this inefficiency by creating an absolute system 
                that aggregates current data metrics from platforms like Amazon, eBay, Walmart, and AliExpress into 
                a centralized dashboard space.
              </p>
            </div>
          </div>
        </div>

        {/* Core Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 group hover:bg-white/10 transition-all duration-300 hover:scale-105">
            <div className="p-3 rounded-xl bg-indigo-500/20 w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
              <Globe className="h-6 w-6 text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Centralized Search</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Unified product search tracking architecture across multiple platforms
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 group hover:bg-white/10 transition-all duration-300 hover:scale-105">
            <div className="p-3 rounded-xl bg-purple-500/20 w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
              <Shield className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Transparent Data</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Non-biased scraping engines for accurate price comparison
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 group hover:bg-white/10 transition-all duration-300 hover:scale-105">
            <div className="p-3 rounded-xl bg-pink-500/20 w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
              <Zap className="h-6 w-6 text-pink-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Efficient Filtering</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Advanced parameter filtering frameworks for precise results
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Award className="h-7 w-7 text-indigo-400" />
            <h2 className="text-2xl font-bold text-white">Core Value Targets</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Centralized product search tracking architecture',
              'Transparent, non-biased scraping engines',
              'Efficient parameter filtering frameworks',
              'Real-time price updates and alerts',
              'User-friendly interface with smart recommendations',
              'Secure and privacy-focused experience'
            ].map((value, index) => (
              <div key={index} className="flex items-start gap-3 group">
                <CheckCircle className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-white/70 group-hover:text-white transition-colors duration-300 text-sm">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="text-center bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 group hover:bg-white/10 transition-all duration-300">
            <div className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
              10K+
            </div>
            <div className="text-white/40 text-sm mt-1">Products Compared</div>
          </div>
          <div className="text-center bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 group hover:bg-white/10 transition-all duration-300">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
              50+
            </div>
            <div className="text-white/40 text-sm mt-1">Retailers</div>
          </div>
          <div className="text-center bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 group hover:bg-white/10 transition-all duration-300">
            <div className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
              99.9%
            </div>
            <div className="text-white/40 text-sm mt-1">Accuracy Rate</div>
          </div>
          <div className="text-center bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 group hover:bg-white/10 transition-all duration-300">
            <div className="text-3xl font-bold bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
              24/7
            </div>
            <div className="text-white/40 text-sm mt-1">Live Updates</div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 border border-white/10 p-8 text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-pink-600/10 blur-3xl"></div>
          <div className="relative">
            <h3 className="text-2xl font-bold text-white mb-3">Ready to Start Saving?</h3>
            <p className="text-white/60 mb-6 max-w-md mx-auto">
              Join thousands of smart shoppers who save money with SmartScanPrice
            </p>
            <Link 
              href="/register" 
              className="group inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-105"
            >
              Get Started Now
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}