import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api.js';
import { Product, Category, Project } from '../types/index.js';
import { ProductCard } from '../components/ProductCard.js';
import { ProjectCard } from '../components/ProjectCard.js';
import { ArrowRight, Lightbulb, Shield, Zap, Award, Compass, HeartHandshake, PhoneCall } from 'lucide-react';

export const Home: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const [catsRes, prodsRes, projsRes] = await Promise.all([
          API.get('/categories'),
          API.get('/products?featured=true'),
          API.get('/projects'),
        ]);
        if (catsRes.data.success) setCategories(catsRes.data.data.slice(0, 4));
        if (prodsRes.data.success) setProducts(prodsRes.data.data.slice(0, 4));
        if (projsRes.data.success) setProjects(projsRes.data.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching landing data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLandingData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">

      {/* ===================== 1. HERO SECTION — Animated Premium ===================== */}
      <section
        className="relative bg-gray-950 text-white overflow-hidden"
        style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}
      >
        {/* Background image — slow-zoom animation */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1558211583-d26f610c1eb1?auto=format&fit=crop&q=80&w=1920')",
            opacity: 0.15,
            animation: 'heroZoom 20s ease-in-out infinite alternate',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/90 to-gray-900/60" />

        {/* Glowing orb — top right */}
        <div style={{
          position: 'absolute', top: '-120px', right: '-80px',
          width: '520px', height: '520px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(202,40,39,0.35) 0%, transparent 70%)',
          animation: 'orbFloat 8s ease-in-out infinite',
          filter: 'blur(40px)', pointerEvents: 'none',
        }} />

        {/* Glowing orb — bottom left */}
        <div style={{
          position: 'absolute', bottom: '-100px', left: '-60px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(202,40,39,0.2) 0%, transparent 70%)',
          animation: 'orbFloat 11s ease-in-out infinite reverse',
          filter: 'blur(50px)', pointerEvents: 'none',
        }} />

        {/* Small orb — center right */}
        <div style={{
          position: 'absolute', top: '30%', right: '18%',
          width: '180px', height: '180px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(202,40,39,0.22) 0%, transparent 70%)',
          animation: 'orbFloat 6s ease-in-out infinite 2s',
          filter: 'blur(20px)', pointerEvents: 'none',
        }} />

        {/* Animated dot grid */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          animation: 'gridPan 30s linear infinite',
        }} />

        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: `${3 + (i % 4)}px`, height: `${3 + (i % 4)}px`,
            borderRadius: '50%',
            background: i % 3 === 0 ? 'rgba(202,40,39,0.7)' : 'rgba(255,255,255,0.2)',
            top: `${10 + (i * 7) % 80}%`, left: `${5 + (i * 11) % 90}%`,
            animation: `particleFloat ${4 + (i % 5)}s ease-in-out infinite ${i * 0.5}s`,
            pointerEvents: 'none', filter: 'blur(0.5px)',
          }} />
        ))}

        {/* ---- Main hero content ---- */}
        <div className="relative w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-3xl flex flex-col gap-7">

            {/* Animated badge */}
            <div style={{ animation: 'slideInUp 0.7s cubic-bezier(0.22,1,0.36,1) both' }}>
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider"
                style={{
                  background: 'rgba(202,40,39,0.12)',
                  border: '1px solid rgba(202,40,39,0.4)',
                  color: '#e35555',
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 0 20px rgba(202,40,39,0.15)',
                }}
              >
                <Zap className="h-3.5 w-3.5" style={{ filter: 'drop-shadow(0 0 4px rgba(202,40,39,0.8))' }} />
                <span>Smart Energy-Saving LED Lighting</span>
                <span
                  className="h-1.5 w-1.5 rounded-full bg-green-400"
                  style={{ animation: 'pulse 1.5s ease-in-out infinite', boxShadow: '0 0 6px rgba(74,222,128,0.8)' }}
                />
                <span className="text-green-400" style={{ fontSize: '10px', fontWeight: 700 }}>LIVE</span>
              </div>
            </div>

            {/* Animated heading */}
            <div style={{ animation: 'slideInUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.15s both' }}>
              <h1
                className="font-display font-extrabold tracking-tight text-white"
                style={{ fontSize: 'clamp(2.4rem, 6vw, 4.2rem)', lineHeight: 1.08 }}
              >
                <span style={{ display: 'block', animation: 'slideInLeft 0.9s cubic-bezier(0.22,1,0.36,1) 0.2s both' }}>
                  Illuminating Spaces,
                </span>
                <span style={{
                  display: 'block', marginTop: '4px',
                  background: 'linear-gradient(90deg, #CA2827 0%, #ff6b6b 40%, #CA2827 80%, #ff4444 100%)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  animation: 'slideInLeft 0.9s cubic-bezier(0.22,1,0.36,1) 0.35s both, shimmerText 3s linear 1.2s infinite',
                  filter: 'drop-shadow(0 0 20px rgba(202,40,39,0.3))',
                }}>
                  Transforming Environments.
                </span>
              </h1>
            </div>

            {/* Animated description */}
            <p
              className="text-lg text-gray-300 max-w-2xl leading-relaxed"
              style={{ animation: 'slideInUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.5s both' }}
            >
              RentaLite is a premier LED lighting manufacturer in India. We design architectural solutions,
              linear profiles, and high-efficiency transformers that redefine aesthetics and cut energy costs.
            </p>

            {/* Stats row */}
            <div
              className="flex flex-wrap gap-6"
              style={{ animation: 'slideInUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.65s both' }}
            >
              {[
                { value: '500+', label: 'Projects Delivered' },
                { value: '50+', label: 'Product Lines' },
                { value: 'CRI >90', label: 'Color Fidelity' },
                { value: '15yr', label: 'Industry Legacy' },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col" style={{ animation: `fadeIn 0.5s ease both ${0.8 + i * 0.1}s` }}>
                  <span className="font-display font-black text-xl" style={{
                    background: 'linear-gradient(135deg, #fff 0%, #e35555 100%)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  }}>{stat.value}</span>
                  <span className="font-bold uppercase tracking-wider text-gray-400" style={{ fontSize: '11px' }}>{stat.label}</span>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div
              className="flex flex-wrap items-center gap-4"
              style={{ animation: 'slideInUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.85s both' }}
            >
              <Link
                to="/products"
                className="group flex items-center gap-2 rounded-full font-bold text-white"
                style={{
                  background: 'linear-gradient(135deg, #CA2827 0%, #e53e3e 100%)',
                  padding: '14px 32px',
                  boxShadow: '0 4px 30px rgba(202,40,39,0.45)',
                  transition: 'all 0.3s cubic-bezier(0.22,1,0.36,1)',
                  position: 'relative', overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = 'translateY(-2px) scale(1.03)';
                  el.style.boxShadow = '0 8px 40px rgba(202,40,39,0.6)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = 'translateY(0) scale(1)';
                  el.style.boxShadow = '0 4px 30px rgba(202,40,39,0.45)';
                }}
              >
                <span>Explore Products</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                {/* Shimmer sweep */}
                <span style={{
                  position: 'absolute', top: 0, left: '-100%', width: '60%', height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
                  animation: 'btnShimmer 2.5s ease-in-out infinite 1.5s',
                  pointerEvents: 'none',
                }} />
              </Link>

              <Link
                to="/become-dealer"
                className="flex items-center gap-2 rounded-full font-bold text-white"
                style={{
                  padding: '14px 32px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1.5px solid rgba(255,255,255,0.18)',
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.3s cubic-bezier(0.22,1,0.36,1)',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = 'rgba(255,255,255,0.14)';
                  el.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = 'rgba(255,255,255,0.06)';
                  el.style.transform = 'translateY(0)';
                }}
              >
                <span>Become a Dealer</span>
              </Link>
            </div>
          </div>

          {/* Floating feature cards — desktop only */}
          <div
            className="hidden lg:flex flex-col gap-4 absolute right-12 top-1/2"
            style={{ transform: 'translateY(-50%)', animation: 'slideInRight 1s cubic-bezier(0.22,1,0.36,1) 0.6s both' }}
          >
            {[
              { icon: '⚡', label: 'Energy Savings', value: 'Up to 70%' },
              { icon: '🏆', label: 'CRI Rating', value: '> 90 CRI' },
              { icon: '🌡️', label: 'Lifespan', value: '50,000 hrs' },
            ].map((feat, i) => (
              <div key={i} className="flex items-center gap-4 rounded-2xl px-5 py-4" style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(12px)',
                minWidth: '200px',
                animation: `floatCard ${3 + i * 0.8}s ease-in-out infinite ${i * 0.4}s`,
                boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
              }}>
                <span style={{ fontSize: '1.5rem' }}>{feat.icon}</span>
                <div>
                  <div className="font-bold uppercase tracking-wider text-gray-400" style={{ fontSize: '10px' }}>{feat.label}</div>
                  <div className="font-display font-bold text-white text-sm">{feat.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2"
          style={{ transform: 'translateX(-50%)', animation: 'fadeIn 1s ease 1.5s both' }}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="font-bold uppercase tracking-widest text-gray-500" style={{ fontSize: '10px' }}>Scroll</span>
            <div style={{
              width: '24px', height: '38px', borderRadius: '12px',
              border: '2px solid rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '4px',
            }}>
              <div style={{
                width: '4px', height: '8px', borderRadius: '2px',
                background: '#CA2827',
                animation: 'scrollDot 1.8s ease-in-out infinite',
                boxShadow: '0 0 6px rgba(202,40,39,0.8)',
              }} />
            </div>
          </div>
        </div>

        {/* CSS Keyframes */}
        <style>{`
          @keyframes heroZoom { from { transform: scale(1); } to { transform: scale(1.08); } }
          @keyframes orbFloat { 0%, 100% { transform: translateY(0px) scale(1); } 50% { transform: translateY(-30px) scale(1.05); } }
          @keyframes gridPan { from { background-position: 0 0; } to { background-position: 40px 40px; } }
          @keyframes particleFloat {
            0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.6; }
            33% { transform: translateY(-18px) translateX(8px); opacity: 1; }
            66% { transform: translateY(-8px) translateX(-6px); opacity: 0.8; }
          }
          @keyframes slideInUp { from { opacity: 0; transform: translateY(32px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes slideInLeft { from { opacity: 0; transform: translateX(-28px); } to { opacity: 1; transform: translateX(0); } }
          @keyframes slideInRight { from { opacity: 0; transform: translateX(40px) translateY(-50%); } to { opacity: 1; transform: translateX(0) translateY(-50%); } }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes shimmerText { 0% { background-position: 0% center; } 100% { background-position: 200% center; } }
          @keyframes btnShimmer { 0% { left: -100%; } 60% { left: 150%; } 100% { left: 150%; } }
          @keyframes floatCard { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
          @keyframes scrollDot { 0% { transform: translateY(0); opacity: 1; } 80% { transform: translateY(16px); opacity: 0; } 100% { transform: translateY(0); opacity: 0; } }
        `}</style>
      </section>

      {/* ===================== 2. ABOUT COMPANY BRIEF ===================== */}
      <section className="bg-white py-16 md:py-24 border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-5">
              <div className="text-xs font-bold text-brand uppercase tracking-wider">About RentaLite</div>
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl leading-tight">
                Crafting Light with Purpose &amp; Engineering Excellence
              </h2>
              <p className="text-gray-600 leading-relaxed">
                At RentaLite, we believe light is more than just visibility. It is about emotional warmth, visual precision,
                and sustainability. Over the years, we have emerged as India's leading trusted partner for architects,
                electrical contractors, and designers seeking cutting-edge lighting solutions.
              </p>
              <div className="grid grid-cols-2 gap-6 mt-4">
                <div className="flex gap-3">
                  <Shield className="h-10 w-10 text-brand shrink-0" />
                  <div>
                    <h4 className="font-display font-bold text-gray-900 text-sm">Quality Tested</h4>
                    <p className="text-xs text-gray-500 mt-1">100% components verified under rigorous voltage variances.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <HeartHandshake className="h-10 w-10 text-brand shrink-0" />
                  <div>
                    <h4 className="font-display font-bold text-gray-900 text-sm">Architect Preferred</h4>
                    <p className="text-xs text-gray-500 mt-1">Bespoke sizing, CCT flexibility, and superior color fidelity (CRI &gt;90).</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-xl border border-gray-100">
              <img
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800"
                alt="Lighting integration showcase"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-brand/10 mix-blend-multiply" />
            </div>
          </div>
        </div>
      </section>

      {/* ===================== 3. PRODUCT SECTORS ===================== */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-brand uppercase tracking-wider">Diverse Applications</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-3">Lighting Every Industry Sector</h2>
            <p className="text-gray-500 mt-3">From architectural ambient designs to heavy industrial highbay deployments.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Residential', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=400', desc: 'Luxury cove and decorative indoor systems' },
              { title: 'Commercial', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400', desc: 'Uniform glare-free office grid layouts' },
              { title: 'Outdoor', image: 'https://images.unsplash.com/photo-1558211583-d26f610c1eb1?auto=format&fit=crop&q=80&w=400', desc: 'IP67 rated landscape and pathway washes' },
              { title: 'Industrial', image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400', desc: 'Robust highbay and manufacturing shop lights' },
            ].map((sector) => (
              <div key={sector.title} className="group zoom-container relative rounded-2xl bg-white border border-gray-150 shadow-sm hover:shadow-md overflow-hidden transition-all duration-300">
                <div className="aspect-square relative">
                  <img src={sector.image} alt={sector.title} className="zoom-image w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <h3 className="text-xl font-bold tracking-tight uppercase">{sector.title}</h3>
                    <p className="text-xs text-gray-300 mt-1">{sector.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/categories" className="inline-flex items-center gap-1.5 text-sm font-bold text-brand hover:underline">
              <span>View All Product Categories</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== 4. FEATURED PRODUCTS ===================== */}
      <section className="bg-white py-16 md:py-24 border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold text-brand uppercase tracking-wider">Premium Selection</span>
              <h2 className="text-3xl font-extrabold text-gray-900 mt-3">Featured Lighting Solutions</h2>
              <p className="text-gray-500 mt-2">Discover our top-rated high efficiency products chosen by designers.</p>
            </div>
            <Link to="/products" className="mt-4 md:mt-0 flex items-center gap-2 rounded-full border border-gray-900 px-6 py-2.5 text-sm font-bold text-gray-900 hover:bg-gray-900 hover:text-white transition-all shrink-0">
              <span>View All Products</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-sm">No featured products available at this time. Run seeder script.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===================== 5. PROJECTS GALLERY ===================== */}
      <section className="bg-gray-950 text-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-brand uppercase tracking-wider">Case Studies</span>
            <h2 className="text-3xl font-extrabold text-white mt-3">Lighting That Transforms Spaces</h2>
            <p className="text-gray-400 mt-3">Browse visual case studies of recent luxury offices, showrooms, and hotel lobbies.</p>
          </div>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-sm">No projects gallery available.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          )}
          <div className="text-center mt-12">
            <Link to="/projects" className="inline-flex items-center gap-1.5 text-sm font-bold text-brand hover:underline">
              <span>Explore Full Project Portfolio</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== 6. PARTNER WITH RENTALITE CTA ===================== */}
      <section className="bg-white py-16 md:py-24 border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 flex flex-col gap-5">
              <div className="inline-flex items-center gap-1 text-xs font-bold text-brand uppercase tracking-wider">
                <Award className="h-4 w-4" />
                <span>Become a Dealer</span>
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">Partner with RentaLite, Grow with Us</h2>
              <p className="text-gray-600">
                Join one of India's fastest-growing premium LED lighting networks. Discover a robust B2B logistics model,
                custom product engineering, promotional materials, and priority technical assistance designed to help your enterprise win more bids.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {[
                  'Quality-tested architectural products',
                  'Marketing and promotional support',
                  'Dedicated regional supply networks',
                  'Trusted by architects and engineers',
                ].map((point, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-brand shrink-0" />
                    <span className="text-sm text-gray-700 font-semibold">{point}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link
                  to="/become-dealer"
                  className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3 text-sm font-bold text-white hover:bg-brand-hover shadow-md transition-all hover:scale-102"
                >
                  <span>Apply for Dealership</span>
                  <ArrowRight className="h-4.5 w-4.5" />
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5 relative aspect-square w-full rounded-2xl overflow-hidden shadow-xl border border-gray-100">
              <img
                src="https://images.unsplash.com/photo-1558211583-d26f610c1eb1?auto=format&fit=crop&q=80&w=800"
                alt="Dealer onboarding visual"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-brand/10 mix-blend-multiply" />
            </div>
          </div>
        </div>
      </section>

      {/* ===================== 7. CONTACT QUICK LAUNCH ===================== */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="flex flex-col justify-center">
              <div className="text-xs font-bold text-brand uppercase tracking-wider mb-2">Reach Out</div>
              <h2 className="text-3xl font-extrabold text-gray-900">Have an Architectural Project?</h2>
              <p className="text-gray-500 mt-4 leading-relaxed">
                Connect with our commercial project engineering cell. We offer photometric dialux simulation,
                layout planning, and custom light sizing to suit commercial and office spaces.
              </p>
              <div className="flex flex-col gap-4 mt-8">
                <a href="tel:+911204455778" className="flex items-center gap-4 hover:text-brand transition-colors text-gray-700">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm border border-gray-200 text-brand">
                    <PhoneCall className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Call Support</div>
                    <div className="font-display font-bold">+91 120 4455 778</div>
                  </div>
                </a>
                <Link to="/contact" className="flex items-center gap-4 hover:text-brand transition-colors text-gray-700">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm border border-gray-200 text-brand">
                    <Compass className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Enquiries Desk</div>
                    <div className="font-display font-bold">Launch Enquiry Form</div>
                  </div>
                </Link>
              </div>
            </div>
            {/* <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200 flex flex-col justify-between">
              <div className="flex flex-col gap-4">
                <h3 className="font-display text-xl font-bold text-gray-900">Corporate HQ Location</h3>
                <p className="text-sm text-gray-500">Sector 63, Noida, Uttar Pradesh, India - 201301</p>
                <div className="h-48 w-full rounded-2xl bg-gray-150 overflow-hidden relative border border-gray-200">
                  <div className="absolute inset-0 bg-sky-50 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-5 w-5 rounded-full bg-brand animate-ping absolute" />
                      <div className="h-5 w-5 rounded-full bg-brand border-2 border-white relative z-10 shadow-md" />
                      <span className="font-display text-xs font-bold text-gray-700 bg-white shadow-sm border border-gray-150 rounded px-2.5 py-1 z-10 mt-1">RentaLite Noida HQ</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Link to="/https://www.bing.com/maps/search?mepi=0%7E%7EEmbedded%7EAddress_Link&ty=18&v=2&sV=1&FORM=MPSRPL&q=SATURN+LIGHT&ss=id.ypid%3AYN625286086BF7B924&ppois=23.032787322998047_72.67881774902344_SATURN+LIGHT_YN625286086BF7B924%7E&cp=23.032787%7E72.678818&lvl=11&style=r" className="text-xs font-bold text-brand uppercase tracking-wider hover:underline">
                  Get Directions &amp; Map Info →
                </Link>
              </div>
            </div> */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200 flex flex-col justify-between">
  <div className="flex flex-col gap-4">
    <h3 className="font-display text-xl font-bold text-gray-900">
      Corporate HQ Location
    </h3>

    <p className="text-sm text-gray-500">
      Vishala Estate, East Kathwada GIDC,
      Ahmedabad, Gujarat 382430
    </p>

    <div className="h-64 w-full rounded-2xl overflow-hidden border border-gray-200">
      <iframe
        title="Saturn Light Location"
        src="https://www.google.com/maps?q=23.032787,72.678818&z=15&output=embed"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
      />
    </div>
  </div>

  <div className="mt-6 flex justify-end">
    <a
      href="https://www.bing.com/maps/search?mepi=0%7E%7EEmbedded%7EAddress_Link&ty=18&v=2&sV=1&FORM=MPSRPL&q=SATURN+LIGHT&ss=id.ypid%3AYN625286086BF7B924&ppois=23.032787322998047_72.67881774902344_SATURN+LIGHT_YN625286086BF7B924%7E&cp=23.032787%7E72.678818&lvl=11&style=r"
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-full bg-brand px-5 py-3 text-xs font-bold text-white uppercase tracking-wider hover:opacity-90 transition"
    >
      Get Directions →
    </a>
  </div>
</div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Home;
