import React, { useState } from 'react';
import API from '../services/api.js';
import { Award, Briefcase, FileText, CheckCircle } from 'lucide-react';

export const BecomeDealer: React.FC = () => {
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [website, setWebsite] = useState('');
  const [businessType, setBusinessType] = useState('Retailer');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !contactName || !email || !phone) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      const response = await API.post('/dealer', {
        companyName,
        contactName,
        email,
        phone,
        address,
        city,
        state,
        zipCode,
        website,
        businessType,
        message,
      });

      if (response.data.success) {
        setSuccess(true);
        setCompanyName('');
        setContactName('');
        setEmail('');
        setPhone('');
        setAddress('');
        setCity('');
        setState('');
        setZipCode('');
        setWebsite('');
        setMessage('');
      } else {
        setError(response.data.message || 'Dealer application failed to submit.');
      }
    } catch (err: any) {
      console.error('Dealer application error:', err);
      setError(err.response?.data?.message || 'Error communicating with server.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Banner */}
        <div className="rounded-3xl bg-gray-950 text-white p-8 md:p-12 mb-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558211583-d26f610c1eb1?auto=format&fit=crop&q=80&w=800')" }}></div>
          <div className="relative z-10 max-w-3xl">
            <span className="text-xs font-bold text-brand uppercase tracking-wider">Business Partnerships</span>
            <h1 className="text-4xl font-extrabold tracking-tight mt-2 sm:text-5xl text-white">Partner with RentaLite</h1>
            <p className="mt-4 text-sm text-gray-450 leading-relaxed">
              Illuminating projects across India. We invite distributors, lighting retailers, contractors, and design cells to join our network. Gain priority stock fulfillment, marketing support, and design-in trade margins.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left panel: partnership terms / details */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-150 shadow-sm">
              <h3 className="font-display font-bold text-gray-900 text-sm mb-4 uppercase tracking-wide border-b border-gray-100 pb-2">
                Dealer Benefits
              </h3>
              
              <ul className="space-y-4 text-xs text-gray-500">
                <li className="flex items-start gap-2.5">
                  <Award className="h-5 w-5 text-brand shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-gray-800">Trade Margins:</span> Direct-factory dealer tiers with outstanding margin schemes.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <Briefcase className="h-5 w-5 text-brand shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-gray-800">Technical Support:</span> Full priority dialux layout simulations and custom wiring plans.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <FileText className="h-5 w-5 text-brand shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-gray-800">Promotions support:</span> Catalog binders, cut-out boards, product sample arrays for showrooms.
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Right panel: Application Form */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-8 border border-gray-150 shadow-sm">
            <h2 className="font-display text-xl font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6">
              Dealership Application Form
            </h2>

            {success ? (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-250 p-6 flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-display font-bold text-emerald-800">Application Submitted!</h4>
                  <p className="text-xs text-emerald-600 mt-1">
                    Thank you. A RentaLite corporate development officer will review your business credentials and schedule an introductory onboarding meeting.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="mt-4 text-xs font-bold text-brand uppercase hover:underline"
                  >
                    Submit Another Application
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="text-xs font-bold text-brand">{error}</div>}

                {/* Contact Names */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Company / Firm Name *</label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Lumina Lights LLP"
                      className="w-full rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-2 text-xs focus:ring-1 focus:ring-brand focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Contact Person Name *</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-2 text-xs focus:ring-1 focus:ring-brand focus:outline-none"
                    />
                  </div>
                </div>

                {/* Email / Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="partner@company.com"
                      className="w-full rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-2 text-xs focus:ring-1 focus:ring-brand focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Phone Number *</label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Mobile / Office Line"
                      className="w-full rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-2 text-xs focus:ring-1 focus:ring-brand focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Website URL</label>
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://company.com"
                      className="w-full rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-2 text-xs focus:ring-1 focus:ring-brand focus:outline-none"
                    />
                  </div>
                </div>

                {/* Address grid */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Office / Showroom Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street Address, Area"
                    className="w-full rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-2 text-xs focus:ring-1 focus:ring-brand focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Noida"
                      className="w-full rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-2 text-xs focus:ring-1 focus:ring-brand focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">State</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="Uttar Pradesh"
                      className="w-full rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-2 text-xs focus:ring-1 focus:ring-brand focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">ZIP / PIN Code</label>
                    <input
                      type="text"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      placeholder="201301"
                      className="w-full rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-2 text-xs focus:ring-1 focus:ring-brand focus:outline-none"
                    />
                  </div>
                </div>

                {/* Business Type */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Business Nature</label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-2 text-xs focus:ring-1 focus:ring-brand focus:outline-none"
                  >
                    <option value="Retailer">Lighting Retailer</option>
                    <option value="Distributor">Regional Electrical Distributor</option>
                    <option value="Contractor">Electrical Installation Contractor</option>
                    <option value="Architect">Architect / Design Consultant</option>
                  </select>
                </div>

                {/* Details */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Business Experience & Remarks</label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Outline your years in business, main focus regions, and brands you currently represent..."
                    className="w-full rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-2 text-xs focus:ring-1 focus:ring-brand focus:outline-none"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-xs font-bold text-white hover:bg-brand-hover shadow-md disabled:bg-gray-400 transition-all hover:scale-102 cursor-pointer"
                  >
                    <span>{submitting ? 'Submitting Application...' : 'Submit Onboarding Form'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default BecomeDealer;
