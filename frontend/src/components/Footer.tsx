import { Link, useLocation } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { pathname } = useLocation();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
<footer className="bg-gray-900 text-gray-400 border-t border-gray-800">
  <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

      {/* Brand Info */}
      <div className="flex flex-col gap-4">
        <span className="font-display text-2xl font-extrabold tracking-tight text-white">
          Saturn Light<span className="text-brand">.</span>
        </span>

        <p className="text-sm leading-relaxed">
          Premium LED lighting manufacturer delivering innovative,
          energy-efficient lighting solutions for residential,
          commercial, industrial, and architectural projects.
        </p>

        <div className="flex items-center gap-4 mt-2">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand transition-colors"
          >
            <Facebook className="h-5 w-5" />
          </a>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand transition-colors"
          >
            <Instagram className="h-5 w-5" />
          </a>

          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand transition-colors"
          >
            <Linkedin className="h-5 w-5" />
          </a>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h3 className="font-display text-sm font-bold tracking-wider text-white uppercase mb-4">
          Quick Links
        </h3>

        <ul className="space-y-2">
          <li>
            <Link to="/" className="hover:text-brand transition-colors">
              Home
            </Link>
          </li>

          <li>
            <Link to="/about" className="hover:text-brand transition-colors">
              About Us
            </Link>
          </li>

          <li>
            <Link to="/categories" className="hover:text-brand transition-colors">
              Categories
            </Link>
          </li>

          <li>
            <Link to="/products" className="hover:text-brand transition-colors">
              Products
            </Link>
          </li>

          <li>
            <Link to="/projects" className="hover:text-brand transition-colors">
              Projects
            </Link>
          </li>

          <li>
            <Link to="/contact" className="hover:text-brand transition-colors">
              Contact Us
            </Link>
          </li>
        </ul>
      </div>

      {/* Business Portals */}
      <div>
        <h3 className="font-display text-sm font-bold tracking-wider text-white uppercase mb-4">
          Portals
        </h3>

        <ul className="space-y-2">
          <li>
            <Link
              to="/become-dealer"
              className="hover:text-brand transition-colors"
            >
              Become Dealer
            </Link>
          </li>

          <li>
            <Link
              to="/contact"
              className="hover:text-brand transition-colors"
            >
              Support & Inquiry
            </Link>
          </li>

          <li>
            <Link
              to="/catalogue"
              className="hover:text-brand transition-colors"
            >
              Download Catalogue
            </Link>
          </li>
        </ul>
      </div>

      {/* Contact Info */}
      <div>
        <h3 className="font-display text-sm font-bold tracking-wider text-white uppercase mb-4">
          Contact Info
        </h3>

        <ul className="space-y-4">

          {/* Address */}
          <li className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-brand shrink-0 mt-1" />

            <a
              href="https://www.bing.com/maps/search?mepi=0%7E%7EEmbedded%7EAddress_Link&ty=18&v=2&sV=1&FORM=MPSRPL&q=SATURN+LIGHT&ss=id.ypid%3AYN625286086BF7B924&ppois=23.032787322998047_72.67881774902344_SATURN+LIGHT_YN625286086BF7B924%7E&cp=23.032787%7E72.678818&lvl=11&style=r"
              target="_blank"
              rel="noopener noreferrer"
              className="group hover:text-brand transition-colors"
            >
              SATURN LIGHT,
              <br />
              Vishala Estate,
              <br />
              East Kathwada GIDC,
              <br />
              Ahmedabad, Gujarat 382430
              <span className="ml-1 inline-block transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </a>
          </li>

          {/* Phone */}
          <li className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-brand shrink-0" />

            <a
              href="tel:+919904629717"
              className="group hover:text-brand transition-colors inline-flex items-center"
            >
              +91 99046 29717
              <span className="ml-1 transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </a>
          </li>

          {/* Email */}
          <li className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-brand shrink-0" />

            <a
              href="mailto:info@saturnlight.com"
              className="group hover:text-brand transition-colors inline-flex items-center"
            >
              info@saturnlight.com
              <span className="ml-1 transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </a>
          </li>
        </ul>
      </div>
    </div>

    {/* Bottom Footer */}
    <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">

      <p>
        © {new Date().getFullYear()} Saturn Light. All Rights Reserved.
      </p>

      <div className="flex gap-5">
        <Link
          to="/privacy-policy"
          className="hover:text-brand transition-colors"
        >
          Privacy Policy
        </Link>

        <Link
          to="/terms"
          className="hover:text-brand transition-colors"
        >
          Terms & Conditions
        </Link>
      </div>
    </div>
  </div>
</footer>
  );
};
