import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Emergency: React.FC = () => (
  <>
    <Navbar />
    <div className="min-h-screen bg-white py-12 px-4 mt-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-primary-700 mb-6">
          Emergency Information
        </h1>
        <p className="mb-4 text-gray-700">
          If you are experiencing an emergency while traveling, please use the
          resources below for immediate assistance.
        </p>
        <h2 className="text-xl font-semibold mt-8 mb-2">Emergency Contacts</h2>
        <ul className="list-disc ml-6 mb-4 text-gray-700">
          <li>
            <strong>Police:</strong> 999
          </li>
          <li>
            <strong>Ambulance:</strong> 199
          </li>
          <li>
            <strong>Fire Service:</strong> 199
          </li>
          <li>
            <strong>Tourist Helpline:</strong> +880-1234-567890
          </li>
        </ul>
        <h2 className="text-xl font-semibold mt-8 mb-2">Travel Safety Tips</h2>
        <ul className="list-disc ml-6 mb-4 text-gray-700">
          <li>
            Keep your important documents and emergency contacts accessible.
          </li>
          <li>Stay aware of your surroundings and follow local laws.</li>
          <li>
            Contact your country's embassy for consular support if needed.
          </li>
        </ul>
        <h2 className="text-xl font-semibold mt-8 mb-2">Embassy Contacts</h2>
        <p className="mb-4 text-gray-700">
          For embassy contact details, please visit the official government
          website of your country or contact the local authorities for
          assistance.
        </p>
        <h2 className="text-xl font-semibold mt-8 mb-2">Wandernest Support</h2>
        <p className="mb-4 text-gray-700">
          If you need help from Wandernest, please email{" "}
          <a
            href="mailto:support@wandernest.com"
            className="text-primary-600 underline"
          >
            support@wandernest.com
          </a>{" "}
          or use our{" "}
          <a href="/help-center" className="text-primary-600 underline">
            Help Center
          </a>
          .
        </p>
      </div>
    </div>
    <Footer />
  </>
);

export default Emergency;
