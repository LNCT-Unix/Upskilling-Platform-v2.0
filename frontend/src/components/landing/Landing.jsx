import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import logo from '../../assets/octobyte-logo.jpeg';
import heroFemale from '../../assets/hero-female.jpeg';
import heroMale from '../../assets/hero-male.jpeg';
// OctoByte Mascot Logo using image URL
const OctoByteLogo = () => (
  <div className="flex items-center gap-3 select-none cursor-pointer">
    <img
      src={logo}
      alt="OctoByte Logo"
      className="h-12 w-auto object-contain"
    />
  </div>
);
// Dual Character Hero Illustration using image URL
const HeroIllustration = () => (
  <div className="relative w-full max-w-[620px] aspect-[16/10] flex items-center justify-center">

    {/* Background */}
    <div className="absolute inset-y-0 right-0 w-[88%] bg-purple-100/75 rounded-t-full rounded-b-[180px] -z-10 overflow-hidden">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-100/60 rounded-full blur-xl" />
    </div>

    {/* Female Learner */}
    <img
      src={heroFemale}
      alt="Female learner using laptop"
      className="w-1/2 h-full object-contain drop-shadow-xl z-10"
    />

    {/* Male Learner */}
    <img
      src={heroMale}
      alt="Male learner thinking"
      className="w-1/2 h-full object-contain drop-shadow-xl z-10"
    />

  </div>
);


export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#F7F8FC] text-slate-800 font-sans antialiased flex flex-col justify-between">
      
      <div>
        {/* ----------------- NAVBAR ----------------- */}
        <header className="bg-[#F7F8FC] border-b border-slate-200/60 sticky top-0 z-50 backdrop-blur-md bg-white/70">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
            
            {/* Logo */}
            <OctoByteLogo />

            {/* Navigation links */}
            <nav className="hidden md:flex items-center gap-10 font-semibold text-sm">
              <a href="#home" className="text-[#7056ED] relative py-1 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2.5px] after:bg-[#7056ED] after:rounded-full">
                Home
              </a>
              <a href="#how-it-works" className="text-slate-600 hover:text-[#7056ED] transition-colors">
                How it works
              </a>
              <a href="#features" className="text-slate-600 hover:text-[#7056ED] transition-colors">
                Features
              </a>
            </nav>

            {/* Auth options / Get Started / Sign Up */}
            <div className="flex items-center gap-4 sm:gap-6">
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-semibold text-slate-700 hover:text-[#7056ED] transition-colors hidden sm:block"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="bg-[#7056ED] hover:bg-[#5f44e2] text-white font-semibold text-sm px-6 py-2.5 rounded-full shadow-md shadow-purple-500/20 hover:shadow-lg transition-all flex items-center gap-1.5"
              >
                <span>Get started / Sign Up</span>
              </button>
            </div>
          </div>
        </header>

        {/* ----------------- HERO SECTION ----------------- */}
        <section id="home" className="pt-12 pb-16 md:pt-16 md:pb-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 sm:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Left Column Text */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                  Diagnose your gaps, <br />
                  build real skills with{' '}
                  <span className="text-[#7056ED]">octoByte</span>
                </h1>

                <p className="text-base sm:text-lg text-slate-600 max-w-xl font-normal leading-relaxed">
                  Stop guessing what to learn. Learn in a structured &amp; organised way.
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => navigate('/signup')}
                    className="bg-[#7056ED] hover:bg-[#5f44e2] text-white font-semibold text-base px-7 py-3.5 rounded-full shadow-lg shadow-purple-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
                  >
                    <span>Start for free</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-slate-500 font-medium pt-1">
                  Free for learners • Seeded with 56 skills
                </p>
              </div>

              {/* Right Column Illustration */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <HeroIllustration />
              </div>

            </div>
          </div>
        </section>

        {/* ----------------- HOW IT WORKS SECTION ----------------- */}
        <section id="how-it-works" className="py-16">
          <div className="max-w-7xl mx-auto px-6 sm:px-10">
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 text-center mb-12 tracking-tight">
              How it works
            </h2>

            {/* 5 Horizontal row cards strictly matching layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              
              {/* Card 01 */}
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-purple-100 shadow-sm hover:border-purple-300 hover:shadow-md transition-all">
                <span className="text-2xl font-bold text-[#7056ED] block mb-3">01</span>
                <h3 className="text-base font-bold text-slate-900 mb-1.5 leading-snug">
                  Take diagnostic test
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  Adaptive AI assessment to accurately pinpoint your knowledge gaps.
                </p>
              </div>

              {/* Card 02 */}
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-purple-100 shadow-sm hover:border-purple-300 hover:shadow-md transition-all">
                <span className="text-2xl font-bold text-[#7056ED] block mb-3">02</span>
                <h3 className="text-base font-bold text-slate-900 mb-1.5 leading-snug">
                  Check your skill graph
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  Visual graph highlighting your strengths and missing prerequisites.
                </p>
              </div>

              {/* Card 03 */}
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-purple-100 shadow-sm hover:border-purple-300 hover:shadow-md transition-all">
                <span className="text-2xl font-bold text-[#7056ED] block mb-3">03</span>
                <h3 className="text-base font-bold text-slate-900 mb-1.5 leading-snug">
                  Get your roadmap
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  Structured learning DAG mapped step-by-step to your goals.
                </p>
              </div>

              {/* Card 04 */}
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-purple-100 shadow-sm hover:border-purple-300 hover:shadow-md transition-all">
                <span className="text-2xl font-bold text-[#7056ED] block mb-3">04</span>
                <h3 className="text-base font-bold text-slate-900 mb-1.5 leading-snug">
                  Learn &amp; verify
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  Complete interactive modules and verify project code quality.
                </p>
              </div>

              {/* Card 05 */}
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-purple-100 shadow-sm hover:border-purple-300 hover:shadow-md transition-all">
                <span className="text-2xl font-bold text-[#7056ED] block mb-3">05</span>
                <h3 className="text-base font-bold text-slate-900 mb-1.5 leading-snug">
                  Match to jobs
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  Connect directly with opportunities based on verified skill proof.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* ----------------- FEATURES SECTION ----------------- */}
        <section id="features" className="py-16 relative">
          <div className="max-w-7xl mx-auto px-6 sm:px-10">
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 text-center mb-12 tracking-tight">
              Features
            </h2>

            {/* 2-Column List with Purple Bullet Dots matching image */}
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8 mb-14">
              
              {/* Left Column Features */}
              <div className="space-y-7">
                
                <div className="flex items-start gap-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#7056ED] mt-2 shrink-0"></span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">Adaptive Assessment</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      IRT engine dynamic testing that automatically scales difficulty to reveal real skills.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#7056ED] mt-2 shrink-0"></span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">Personalized roadmap</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Custom structured learning graph skipping concepts you have already mastered.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#7056ED] mt-2 shrink-0"></span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">Visual skill graph</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Clear topological views of topic dependencies and domain mastery levels.
                    </p>
                  </div>
                </div>

              </div>

              {/* Right Column Features */}
              <div className="space-y-7">
                
                <div className="flex items-start gap-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#7056ED] mt-2 shrink-0"></span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">Project verification</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Automated code audits ensuring hands-on project work meets engineering standards.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#7056ED] mt-2 shrink-0"></span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">Job Match score</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Real-time readiness index matching verified knowledge against hiring role criteria.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#7056ED] mt-2 shrink-0"></span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">Progress Analytics</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Granular metrics tracking study velocity, retention rate, and target readiness.
                    </p>
                  </div>
                </div>

              </div>

            </div>

            {/* Centered Outline "Get started" button from image */}
            <div className="flex justify-center pb-12">
              <button className="border-2 border-[#7056ED] text-[#7056ED] hover:bg-[#7056ED] hover:text-white font-semibold text-sm px-10 py-3 rounded-full transition-all duration-200 bg-white/50 backdrop-blur-sm">
                Get started
              </button>
            </div>

          </div>

          {/* Soft Bottom Background Curve Waves matching image corners */}
          <div className="absolute bottom-0 left-0 w-72 h-40 bg-amber-100/40 rounded-tr-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 right-0 w-80 h-44 bg-purple-100/50 rounded-tl-full blur-3xl -z-10"></div>
        </section>
      </div>

      {/* ----------------- FOOTER ----------------- */}
      <footer className="bg-white border-t border-slate-200/80 pt-14 pb-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-100">
            
            {/* Brand column */}
            <div className="md:col-span-5 space-y-4">
              <OctoByteLogo />
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                Diagnose your skill gaps, follow AI-driven topological roadmaps, and verify project code for real job readiness.
              </p>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Navigation</h4>
              <ul className="space-y-2 text-xs text-slate-600 font-medium">
                <li><a href="#home" className="hover:text-[#7056ED] transition-colors">Home</a></li>
                <li><a href="#how-it-works" className="hover:text-[#7056ED] transition-colors">How it works</a></li>
                <li><a href="#features" className="hover:text-[#7056ED] transition-colors">Features</a></li>
                <li><button onClick={() => navigate('/login')} className="hover:text-[#7056ED] transition-colors text-left">Sign In</button></li>
              </ul>
            </div>

            {/* Platform Features */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Platform Capabilities</h4>
              <ul className="space-y-2 text-xs text-slate-600 font-medium">
                <li>Adaptive IRT Diagnostic Engine</li>
                <li>Topological DAG Roadmaps</li>
                <li>Automated Code Auditing</li>
                <li>Verified Job Match Score</li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright & Policy */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <p>© {new Date().getFullYear()} octoByte. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#privacy" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
              <a href="#terms" className="hover:text-slate-600 transition-colors">Terms of Service</a>
              <a href="#cookies" className="hover:text-slate-600 transition-colors">Cookie Settings</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}