import React, { useState } from 'react';
import API from '../services/api.js';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

export const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      const response = await API.post('/contact', {
        name,
        email,
        phone,
        subject: subject || 'General Inquiry',
        message,
      });

      if (response.data.success) {
        setSuccess(true);
        setName('');
        setEmail('');
        setPhone('');
        setSubject('');
        setMessage('');
      } else {
        setError(response.data.message || 'Failed to submit contact request.');
      }
    } catch (err: any) {
      console.error('Contact submit error:', err);
      setError(err.response?.data?.message || 'Error communicating with server.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">Contact Us</h1>
          <p className="mt-4 text-gray-550 text-sm">
            Have a question about our products, need specifications, or want to discuss a project layout? Send us a message below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Direct Contact Info cards */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-150 shadow-sm flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-gray-900 text-sm uppercase tracking-wide">Corporate HQ</h3>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                  Sector 63, Noida, <br />
                  Uttar Pradesh, India - 201301
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-150 shadow-sm flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-gray-900 text-sm uppercase tracking-wide">Call Support</h3>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                  <a href="tel:+911204455778" className="hover:text-brand font-semibold">+91 120 4455 778</a> <br />
                  <span className="text-[10px] text-gray-400 font-medium">Mon - Sat: 9:00 AM - 6:00 PM</span>
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-150 shadow-sm flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-gray-900 text-sm uppercase tracking-wide">Email Relations</h3>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                  <a href="mailto:info@rentalite.in" className="hover:text-brand font-semibold">info@rentalite.in</a> <br />
                  <a href="mailto:sales@rentalite.in" className="hover:text-brand font-semibold">sales@rentalite.in</a>
                </p>
              </div>
            </div>
          </div>

          {/* Right Columns: Structured inquiry contact form */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-gray-150 shadow-sm">
            <h2 className="font-display text-xl font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6">
              General / Project Inquiry Form
            </h2>

            {success ? (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-250 p-6 flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-display font-bold text-emerald-800">Inquiry Received</h4>
                  <p className="text-xs text-emerald-600 mt-1">
                    Thank you for reaching out. A RentaLite project coordinator will review your request and contact you shortly.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="mt-4 text-xs font-bold text-brand uppercase hover:underline"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="text-xs font-bold text-brand">{error}</div>}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter full name"
                      className="w-full rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-2 text-xs focus:ring-1 focus:ring-brand focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-2 text-xs focus:ring-1 focus:ring-brand focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-2 text-xs focus:ring-1 focus:ring-brand focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Subject</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="General Inquiry / Catalog Request"
                      className="w-full rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-2 text-xs focus:ring-1 focus:ring-brand focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type details of your inquiry, light quantities required, or architectural layout questions..."
                    className="w-full rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-2 text-xs focus:ring-1 focus:ring-brand focus:outline-none"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-xs font-bold text-white hover:bg-brand-hover shadow-md disabled:bg-gray-400 transition-all hover:scale-102 cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>{submitting ? 'Submitting...' : 'Send Message'}</span>
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
export default Contact;
