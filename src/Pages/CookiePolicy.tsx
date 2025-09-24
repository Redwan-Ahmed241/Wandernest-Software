import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CookiePolicy: React.FC = () => (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-100 to-primary-300">
    <Navbar />
    <main className="flex-1 flex justify-center items-center px-4 py-8">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-10 flex flex-col gap-8">
        <h1 className="text-4xl font-extrabold text-primary-700 text-center mb-2 tracking-tight">Cookie Policy</h1>
        <p className="text-gray-700 text-base mb-4 text-center">
          This Cookie Policy explains how WanderNest uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are, why we use them, and your rights to control our use of them.
        </p>
        <section>
          <h2 className="text-xl font-bold text-primary-700 mb-2">What are cookies?</h2>
          <p className="text-gray-600 mb-4">
            Cookies are small data files placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners to make their websites work, or to work more efficiently, as well as to provide reporting information.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-primary-700 mb-2">Why do we use cookies?</h2>
          <p className="text-gray-600 mb-4">
            We use cookies to improve your experience, remember your preferences, analyze site traffic, and deliver personalized content and ads.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-primary-700 mb-2">Types of cookies we use</h2>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li><span className="font-semibold text-primary-600">Essential Cookies:</span> Necessary for the website to function.</li>
            <li><span className="font-semibold text-primary-600">Performance Cookies:</span> Help us understand how visitors interact with our site.</li>
            <li><span className="font-semibold text-primary-600">Functionality Cookies:</span> Remember your preferences and settings.</li>
            <li><span className="font-semibold text-primary-600">Advertising Cookies:</span> Used to deliver relevant ads.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-bold text-primary-700 mb-2">Your choices</h2>
          <p className="text-gray-600 mb-4">
            You can set your browser to refuse cookies or to alert you when cookies are being sent. If you disable cookies, some features of our site may not function properly.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-primary-700 mb-2">Contact us</h2>
          <p className="text-gray-600">
            If you have any questions about our Cookie Policy, please contact us at support@wandernest.com.
          </p>
        </section>
      </div>
    </main>
    <Footer />
  </div>
);

export default CookiePolicy;
