import { type FunctionComponent, useCallback, useState } from "react";
import { Search, Phone, Mail, HelpCircle, ChevronDown } from "react-feather";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
// Tailwind CSS used for all styling. Centralized color theme via tailwind.config.js

const HelpCenter: FunctionComponent = () => {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const toggleFAQ = useCallback((faqId: string) => {
    setExpandedFAQ(prev => prev === faqId ? null : faqId);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Hero Section with Search */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How can we help you?</h1>
          <p className="text-lg text-gray-600 mb-8">Search our knowledge base or contact support</p>
          
          {/* Main Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for help or topics..."
                className="block w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Emergency Contacts Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Emergency Contacts</h2>
            <p className="text-lg text-gray-600">Reach out to the right team for assistance.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Technical Support */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                <HelpCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Technical Support</h3>
              <div className="flex items-center text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                <span className="text-sm">+123 456 7890</span>
              </div>
            </div>

            {/* Medical Assistance */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mb-4">
                <Phone className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Medical Assistance</h3>
              <div className="flex items-center text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                <span className="text-sm">+987 654 3210</span>
              </div>
            </div>

            {/* Customer Service */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer Service</h3>
              <div className="flex items-center text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                <span className="text-sm">support@wandernest.com</span>
              </div>
            </div>

            {/* IT Helpdesk */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                <HelpCircle className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">IT Helpdesk</h3>
              <div className="flex items-center text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                <span className="text-sm">+555 678 1234</span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {/* FAQ Item 1 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <button
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors duration-200"
                onClick={() => toggleFAQ('password-reset')}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary-light rounded-lg">
                    <HelpCircle className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    How to reset my password?
                  </h3>
                </div>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                    expandedFAQ === 'password-reset' ? 'transform rotate-180' : ''
                  }`} 
                />
              </button>
              {expandedFAQ === 'password-reset' && (
                <div className="px-6 pb-6 pt-0">
                  <p className="text-gray-600 leading-relaxed">
                    Find out how to securely reset your password. You can reset your password by visiting the login page and clicking "Forgot Password", then following the instructions sent to your email.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ Item 2 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <button
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors duration-200"
                onClick={() => toggleFAQ('contact-support')}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary-light rounded-lg">
                    <HelpCircle className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    How to contact support?
                  </h3>
                </div>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                    expandedFAQ === 'contact-support' ? 'transform rotate-180' : ''
                  }`} 
                />
              </button>
              {expandedFAQ === 'contact-support' && (
                <div className="px-6 pb-6 pt-0">
                  <p className="text-gray-600 leading-relaxed">
                    Learn about different ways to reach us. You can contact our support team through email, phone, or live chat. Check the Emergency Contacts section above for specific contact information.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ Item 3 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <button
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors duration-200"
                onClick={() => toggleFAQ('emergency')}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary-light rounded-lg">
                    <HelpCircle className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    What to do in case of emergency?
                  </h3>
                </div>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                    expandedFAQ === 'emergency' ? 'transform rotate-180' : ''
                  }`} 
                />
              </button>
              {expandedFAQ === 'emergency' && (
                <div className="px-6 pb-6 pt-0">
                  <p className="text-gray-600 leading-relaxed">
                    Steps to take during urgent situations. In case of emergency, contact our 24/7 emergency hotline immediately. For medical emergencies, also contact local emergency services (911 or your local equivalent).
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HelpCenter;
