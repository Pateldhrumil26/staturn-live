import React from 'react';
import { Shield, Zap, Award, Compass } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      {/* 1. Page Header */}
      <section className="bg-gray-950 py-16 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=1200')" }}></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
          <span className="text-xs font-bold text-brand uppercase tracking-wider">Engineering Light</span>
          <h1 className="text-4xl font-extrabold tracking-tight mt-2 sm:text-5xl text-white">About RentaLite</h1>
          <p className="mt-4 max-w-2xl mx-auto text-base text-gray-400">
            A premier Indian lighting brand engineered to deliver energy efficiency, architectural precision, and unmatched aesthetic integration.
          </p>
        </div>
      </section>

      {/* 2. Main Narrative & Vision */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6">
              <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">
                Illuminating India's Progressive Landscapes
              </h2>
              <p className="text-gray-600 leading-relaxed">
                RentaLite was established with a singular objective: to deliver lighting products that bridge the gap between architectural beauty and electrical engineering safety. What began as a premium local fixture design cell has now expanded into a leading pan-India lighting manufacturer.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We design and manufacture linear strip light profiles, chip-on-board spots, recessed panel grids, and high-efficiency constant voltage power drivers. By leveraging grade-A components, advanced gold-plated FPC boards, and high-efficiency heat sinks, RentaLite products deliver up to 120 Lumens per Watt, slashing carbon footprints and grid costs.
              </p>
              
              <div className="border-l-4 border-brand pl-4 py-1.5 italic text-gray-800 font-medium">
                "Light is not merely static utility. It determines the mood of a home, the focus of an office, and the welcoming allure of a corporate brand."
              </div>
            </div>

            {/* Side Image grid showcasing testing facility or premium architecture */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-gray-150 bg-white">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"
                alt="Corporate showroom illustration"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-brand/5 mix-blend-multiply"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Technology Pillars */}
      <section className="bg-white py-16 md:py-24 border-y border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-brand uppercase tracking-wider text-gradient-red">Quality Standard</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-2">Why Designers Trust RentaLite</h2>
            <p className="text-gray-500 mt-2">Four core engineering pillars backing every lighting installation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: 'Voltage Tolerant', desc: 'Engineered to handle Indian power grids with standard input range AC 90-285V protecting against surges.' },
              { icon: Zap, title: 'Energy Efficiency', desc: 'Up to 120 Lm/W efficiency, generating brighter illumination with up to 50% lower energy demand.' },
              { icon: Award, title: 'Color Consistency', desc: 'Strict binning standards ensuring absolute chromaticity match across multiple production rolls.' },
              { icon: Compass, title: 'High CRI Value', desc: 'CRI >90 values representing colors exactly as they are meant to be seen under natural sun.' },
            ].map((pillar, idx) => (
              <div key={idx} className="flex flex-col gap-3.5 p-6 rounded-2xl bg-gray-50 border border-gray-150">
                <div className="h-12 w-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
                  <pillar.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display font-bold text-gray-900 text-lg uppercase tracking-wide">{pillar.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Quality Certifications & Sustainable Commitments */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gray-950 text-white p-8 md:p-12 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558211583-d26f610c1eb1?auto=format&fit=crop&q=80&w=800')" }}></div>
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <span className="text-xs font-bold text-brand uppercase tracking-wider">Certified Safe</span>
                <h2 className="text-3xl font-extrabold text-white mt-2 leading-tight">
                  Bureau of Indian Standards (BIS) Verified
                </h2>
                <p className="text-gray-400 mt-4 leading-relaxed text-sm">
                  Every product leaving our Noida facility complies with Indian Standard parameters. RentaLite products undergo safety validations, thermal overload loops, and IP moisture resistance trials to warrant long lifetime ratings (up to 50,000 burning hours). We stand behind our catalog with comprehensive 2 to 3-year warranties.
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-6 justify-center">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                  <div className="font-display text-4xl font-extrabold text-brand">50K+</div>
                  <div className="text-xs text-gray-300 font-medium uppercase mt-1">Burning Hours Lifetime</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                  <div className="font-display text-4xl font-extrabold text-brand">100%</div>
                  <div className="text-xs text-gray-300 font-medium uppercase mt-1">BIS Quality Compliant</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default About;
