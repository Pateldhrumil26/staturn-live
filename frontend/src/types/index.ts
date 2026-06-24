export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'Admin' | 'User';
  phone?: string;
  companyName?: string;
  token?: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  createdAt?: string;
}

export interface Specification {
  key: string;
  value: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  images: string[];
  category: Category | string; // Can be populated object or string ID
  specifications: Specification[];
  status: 'Active' | 'Inactive';
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  _id: string;
  title: string;
  description?: string;
  image: string;
  location?: string;
  year?: string;
  client?: string;
  createdAt?: string;
}

export interface ContactInquiry {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: 'Pending' | 'Replied' | 'Archived';
  adminNotes?: string;
  createdAt: string;
}

export interface DealerInquiry {
  _id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  website?: string;
  businessType?: string;
  message?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  adminNotes?: string;
  createdAt: string;
}

export interface InvoiceProduct {
  product?: string | Product;
  name: string;
  quantity: number;
  unitPrice: number;
  discount: number;
}

export interface Invoice {
  _id: string;
  invoiceNumber: string;
  customerName: string;
  mobile?: string;
  address?: string;
  gstNumber?: string;
  invoiceDate: string;
  products: InvoiceProduct[];
  subtotal: number;
  gstPercentage: number;
  gstAmount: number;
  grandTotal: number;
  status: 'Paid' | 'Pending' | 'Cancelled';
  createdAt: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

