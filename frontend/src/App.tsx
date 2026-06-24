import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import { ProtectedRoute } from './components/ProtectedRoute.js';

// Visual Layout Elements
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';

// Public Pages
import { Home } from './pages/Home.js';
import { About } from './pages/About.js';
import { Categories } from './pages/Categories.js';
import { Products } from './pages/Products.js';
import { ProductDetails } from './pages/ProductDetails.js';
import { Projects } from './pages/Projects.js';
import { Contact } from './pages/Contact.js';
import { BecomeDealer } from './pages/BecomeDealer.js';
import { Login } from './pages/Login.js';

// Portal Dashboards
import { UserDashboard } from './user/UserDashboard.js';
import { AdminDashboard } from './admin/AdminDashboard.js';
import { CategoryManagement } from './admin/CategoryManagement.js';
import { ProductManagement } from './admin/ProductManagement.js';
import { ProjectManagement } from './admin/ProjectManagement.js';
import { InquiryManagement } from './admin/InquiryManagement.js';
import { InvoiceList } from './admin/InvoiceList.js';
import { InvoiceForm } from './admin/InvoiceForm.js';
import { InvoiceDetails } from './admin/InvoiceDetails.js';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          {/* Main Header Menu */}
          <Navbar />

          {/* Main Routing Views */}
          <main className="flex-grow">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/become-dealer" element={<BecomeDealer />} />
              <Route path="/login" element={<Login />} />

              {/* Protected User Dashboard */}
              <Route
                path="/user/dashboard"
                element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin Console Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/categories"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <CategoryManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <ProductManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/projects"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <ProjectManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/inquiries"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <InquiryManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/invoices"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <InvoiceList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/invoices/new"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <InvoiceForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/invoices/edit/:id"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <InvoiceForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/invoices/:id"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <InvoiceDetails />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>


          {/* Footer branding */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
