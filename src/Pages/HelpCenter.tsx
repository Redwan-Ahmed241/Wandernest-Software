import React, { useState } from "react";
import { Mail, Phone, HelpCircle, MessageCircle } from "react-feather";
import Layout from "../components/Layout";

const HelpCenter: React.FC = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would integrate with backend or service
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-primary mb-4 text-center">
          Wandernest Support Center
        </h1>
        <p className="text-lg text-gray-600 mb-10 text-center">
          Need help? Our team is here for you. Browse resources, contact
          support, or report an issue.
        </p>
        <div>
          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow p-8 mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-primary" /> Contact Us
            </h2>
            {submitted ? (
              <div className="text-green-600 font-medium">
                Thank you! Your message has been sent.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    style={{ display: "block", backgroundColor: "#6ab187" }}
                    className="text-white font-semibold px-6 py-2 rounded-lg transition border-2 border-[#6ab187] hover:shadow-lg cursor-pointe"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Emergency Contacts */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary" /> Emergency Contacts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-primary-light p-6 rounded-xl flex items-center gap-4">
                <Phone className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    24/7 Hotline
                  </h3>
                  <p className="text-gray-700 text-sm">+880 1760818882</p>
                </div>
              </div>
              <div className="bg-primary-light p-6 rounded-xl flex items-center gap-4">
                <Mail className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Email Support
                  </h3>
                  <p className="text-gray-700 text-sm">
                    support@wandernest.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Knowledge Base Links */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" /> Knowledge Base
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a
                href="/faq"
                className="block bg-white rounded-xl shadow p-6 hover:shadow-md transition"
              >
                <h3 className="font-semibold text-primary mb-2">FAQs</h3>
                <p className="text-gray-600 text-sm">
                  Find answers to common questions about Wandernest.
                </p>
              </a>
              <a
                href="/community"
                className="block bg-white rounded-xl shadow p-6 hover:shadow-md transition"
              >
                <h3 className="font-semibold text-primary mb-2">
                  Community Forum
                </h3>
                <p className="text-gray-600 text-sm">
                  Connect with other travelers and share experiences.
                </p>
              </a>
              <a
                href="/blog"
                className="block bg-white rounded-xl shadow p-6 hover:shadow-md transition"
              >
                <h3 className="font-semibold text-primary mb-2">Travel Blog</h3>
                <p className="text-gray-600 text-sm">
                  Read tips, guides, and stories from our team.
                </p>
              </a>
            </div>
          </div>

          {/* Report an Issue */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" /> Report an Issue
            </h2>
            <p className="text-gray-600 mb-4">
              If you encounter a bug or problem, please let us know so we can
              fix it quickly.
            </p>
            <a
              href="mailto:support@wandernest.com?subject=Issue%20Report"
              className="inline-block text-white font-semibold px-6 py-2 rounded-lg transition border-2 border-[#6ab187] bg-[#6ab187] hover:bg-[#4a6b5b]"
            >
              Email Support
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HelpCenter;
