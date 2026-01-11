import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-center md:text-left">
          
          {/* Column 1 */}
          <div>
            <p className="text-2xl font-semibold mb-3 text-indigo-600 dark:text-indigo-400">
              Your Company
            </p>
            <p className="text-sm leading-relaxed">
              Providing high-quality services and products <br />
              since 2024.
            </p>
          </div>

          {/* Column 2 */}
          <div>
            <p className="text-2xl font-semibold mb-3">Company Services</p>
            <ul className="space-y-2 text-sm">
              {["Home", "About", "Services", "Contact"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <p className="text-2xl font-semibold mb-3">Useful Links</p>
            <ul className="space-y-2 text-sm">
              {["Company", "Stores", "Careers", "Support"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <p className="text-2xl font-semibold mb-3">Contact</p>
            <p className="text-sm">Email: support@yourcompany.com</p>
            <p className="text-sm mt-2">Phone: +1 (123) 456-7890</p>
            <p className="text-sm mt-2">Location: Toronto, Canada</p>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 pt-4 text-center border-t border-gray-300 dark:border-gray-700">
          <p className="text-sm">
            © 2025 Your Company — All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;