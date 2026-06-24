import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api.js';
import { ContactInquiry, DealerInquiry } from '../types/index.js';
import { Check, X, Trash2, Mail, Building, Phone, FileSpreadsheet } from 'lucide-react';
import { AdminSidebar } from '../components/AdminSidebar.js';

export const InquiryManagement: React.FC = () => {
  const [contacts, setContacts] = useState<ContactInquiry[]>([]);
  const [dealers, setDealers] = useState<DealerInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dealers' | 'contacts'>('dealers');

  // Notes state
  const [noteId, setNoteId] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const [contactsRes, dealersRes] = await Promise.all([
        API.get('/contact'),
        API.get('/dealer'),
      ]);

      if (contactsRes.data.success) {
        setContacts(contactsRes.data.data);
      }
      if (dealersRes.data.success) {
        setDealers(dealersRes.data.data);
      }
    } catch (err) {
      console.error('Error fetching inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleUpdateDealerStatus = async (id: string, status: 'Approved' | 'Rejected') => {
    try {
      const response = await API.put(`/dealer/${id}`, { status });
      if (response.data.success) {
        fetchInquiries();
      }
    } catch (err) {
      console.error('Error updating dealer status:', err);
    }
  };

  const handleUpdateContactStatus = async (id: string, status: 'Replied' | 'Archived') => {
    try {
      const response = await API.put(`/contact/${id}`, { status });
      if (response.data.success) {
        fetchInquiries();
      }
    } catch (err) {
      console.error('Error updating contact status:', err);
    }
  };

  const handleDeleteDealer = async (id: string) => {
    if (!window.confirm('Delete this dealer application record permanently?')) return;
    try {
      const response = await API.delete(`/dealer/${id}`);
      if (response.data.success) {
        fetchInquiries();
      }
    } catch (err) {
      console.error('Error deleting dealer request:', err);
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (!window.confirm('Delete this contact message permanently?')) return;
    try {
      const response = await API.delete(`/contact/${id}`);
      if (response.data.success) {
        fetchInquiries();
      }
    } catch (err) {
      console.error('Error deleting contact message:', err);
    }
  };

  const handleSaveNotes = async (id: string, type: 'dealer' | 'contact') => {
    try {
      const endpoint = type === 'dealer' ? `/dealer/${id}` : `/contact/${id}`;
      const response = await API.put(endpoint, { adminNotes });
      if (response.data.success) {
        fetchInquiries();
        setNoteId(null);
        setAdminNotes('');
      }
    } catch (err) {
      console.error('Error saving admin notes:', err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-[#FAF9F6] min-h-screen">
      {/* Persistent Admin Sidebar */}
      <AdminSidebar />

      {/* Main Inquiries Console Area */}
      <div className="flex-1 p-6 md:p-10 max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-gray-200 pb-5">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Inquiries Desk</h1>
            <p className="text-xs text-gray-500 mt-0.5 font-medium">Review and process partnership applications and client product quotes requests.</p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('dealers')}
            className={`font-display text-sm font-bold pb-3 border-b-2 transition-colors uppercase tracking-wider cursor-pointer ${
              activeTab === 'dealers'
                ? 'border-brand text-brand font-extrabold'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Dealer Applications ({dealers.length})
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`font-display text-sm font-bold pb-3 border-b-2 transition-colors uppercase tracking-wider cursor-pointer ${
              activeTab === 'contacts'
                ? 'border-brand text-brand font-extrabold'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Contact Messages ({contacts.length})
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent"></div>
          </div>
        ) : activeTab === 'dealers' ? (
          
          /* DEALER APPLICATIONS LIST */
          dealers.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
              <p className="text-gray-500 text-sm">No dealer applications received.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {dealers.map((dealer) => (
                <div key={dealer._id} className="bg-white rounded-3xl p-6 border border-gray-150 shadow-sm flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-gray-100 pb-3">
                    <div>
                      <h3 className="font-display text-lg font-bold text-gray-900 uppercase tracking-tight flex items-center gap-1.5">
                        <Building className="h-4.5 w-4.5 text-brand shrink-0" />
                        <span>{dealer.companyName}</span>
                      </h3>
                      <p className="text-xs text-gray-400 mt-1 font-semibold uppercase tracking-wider">
                        Contact: {dealer.contactName} • Type: {dealer.businessType}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] rounded-full px-2.5 py-0.5 font-bold uppercase ${
                        dealer.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : dealer.status === 'Rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800 animate-pulse'
                      }`}>
                        {dealer.status}
                      </span>
                    </div>
                  </div>

                  {/* Business Coordinates details */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold text-gray-600 bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-brand shrink-0" />
                      <span>{dealer.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-brand shrink-0" />
                      <span>{dealer.email}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:col-span-1">
                      <FileSpreadsheet className="h-4 w-4 text-brand shrink-0" />
                      <span>Location: {dealer.city}, {dealer.state} {dealer.zipCode}</span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 leading-relaxed bg-white p-3 rounded-lg border border-gray-100">
                    <span className="font-bold text-gray-800">Business Remarks:</span> {dealer.message || 'No additional remarks provided.'}
                  </div>

                  {/* Admin notes box */}
                  <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    {noteId === dealer._id ? (
                      <div className="flex-1 flex gap-2 w-full">
                        <input
                          type="text"
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                          placeholder="Add comments / follow-up schedules..."
                          className="flex-1 rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-1.5 text-xs focus:outline-none"
                        />
                        <button
                          onClick={() => handleSaveNotes(dealer._id, 'dealer')}
                          className="rounded-xl bg-gray-900 px-4 py-1.5 text-xs font-bold text-white uppercase hover:bg-black cursor-pointer"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setNoteId(null)}
                          className="rounded-xl border border-gray-350 px-3 py-1.5 text-xs font-bold text-gray-500 uppercase hover:bg-gray-50 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="text-xs text-brand bg-brand/5 border border-brand/10 p-2.5 rounded-xl flex-1">
                        <span className="font-bold">Follow-up Remarks:</span> {dealer.adminNotes || 'None.'}
                        <button
                          onClick={() => {
                            setNoteId(dealer._id);
                            setAdminNotes(dealer.adminNotes || '');
                          }}
                          className="text-[10px] font-bold underline ml-2 cursor-pointer uppercase"
                        >
                          [Edit Notes]
                        </button>
                      </div>
                    )}

                    {/* Approvals buttons */}
                    <div className="flex gap-2 self-end sm:self-center">
                      {dealer.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateDealerStatus(dealer._id, 'Approved')}
                            className="flex h-8 items-center gap-1.5 rounded-full bg-emerald-600 px-4 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm cursor-pointer"
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleUpdateDealerStatus(dealer._id, 'Rejected')}
                            className="flex h-8 items-center gap-1.5 rounded-full bg-rose-600 px-4 text-xs font-bold text-white hover:bg-rose-700 shadow-sm cursor-pointer"
                          >
                            <X className="h-3.5 w-3.5" />
                            <span>Reject</span>
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDeleteDealer(dealer._id)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer shadow-xs border border-gray-200"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          
          /* CONTACT MESSAGES LIST */
          contacts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
              <p className="text-gray-500 text-sm">No contact messages received.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {contacts.map((contact) => (
                <div key={contact._id} className="bg-white rounded-3xl p-6 border border-gray-150 shadow-sm flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-gray-100 pb-3">
                    <div>
                      <h3 className="font-display text-base font-bold text-gray-900 uppercase">
                        {contact.subject || 'General Inquiry'}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1 font-semibold uppercase tracking-wider">
                        Sender: {contact.name} • Email: {contact.email} {contact.phone && `• Phone: ${contact.phone}`}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] rounded-full px-2.5 py-0.5 font-bold uppercase ${
                        contact.status === 'Replied'
                          ? 'bg-emerald-100 text-emerald-800'
                          : contact.status === 'Archived'
                          ? 'bg-gray-200 text-gray-700'
                          : 'bg-amber-100 text-amber-800 animate-pulse'
                      }`}>
                        {contact.status}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 leading-relaxed bg-white p-3 rounded-lg border border-gray-100">
                    <span className="font-bold text-gray-800">Message:</span> {contact.message}
                  </div>

                  {/* Admin notes */}
                  <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    {noteId === contact._id ? (
                      <div className="flex-1 flex gap-2 w-full">
                        <input
                          type="text"
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                          placeholder="Add details of replies or quotes sent..."
                          className="flex-1 rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-1.5 text-xs focus:outline-none"
                        />
                        <button
                          onClick={() => handleSaveNotes(contact._id, 'contact')}
                          className="rounded-xl bg-gray-900 px-4 py-1.5 text-xs font-bold text-white uppercase hover:bg-black cursor-pointer"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setNoteId(null)}
                          className="rounded-xl border border-gray-350 px-3 py-1.5 text-xs font-bold text-gray-500 uppercase hover:bg-gray-50 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="text-xs text-brand bg-brand/5 border border-brand/10 p-2.5 rounded-xl flex-1">
                        <span className="font-bold">Follow-up Remarks:</span> {contact.adminNotes || 'None.'}
                        <button
                          onClick={() => {
                            setNoteId(contact._id);
                            setAdminNotes(contact.adminNotes || '');
                          }}
                          className="text-[10px] font-bold underline ml-2 cursor-pointer uppercase"
                        >
                          [Edit Notes]
                        </button>
                      </div>
                    )}

                    {/* Actions buttons */}
                    <div className="flex gap-2 self-end sm:self-center">
                      {contact.status === 'Pending' && (
                        <button
                          onClick={() => handleUpdateContactStatus(contact._id, 'Replied')}
                          className="flex h-8 items-center gap-1.5 rounded-full bg-emerald-600 px-4 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm cursor-pointer"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Mark Replied</span>
                        </button>
                      )}
                      {contact.status !== 'Archived' && (
                        <button
                          onClick={() => handleUpdateContactStatus(contact._id, 'Archived')}
                          className="flex h-8 items-center gap-1.5 rounded-full border border-gray-300 bg-white px-4 text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-xs cursor-pointer"
                        >
                          <span>Archive</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteContact(contact._id)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer shadow-xs border border-gray-200"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};
export default InquiryManagement;
