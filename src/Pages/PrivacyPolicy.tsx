
import type { FunctionComponent } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const PrivacyPolicy: FunctionComponent = () => (
  <>
    <Navbar />
    <div className="min-h-screen bg-white py-12 px-4 mt-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-primary-700 mb-6">Privacy Policy</h1>
        <p className="mb-4 text-gray-700">
          <strong>Last updated: September 18, 2025</strong>
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-2">About this Privacy Notice</h2>
        <p className="mb-4 text-gray-700">
          We are Wandernest, a Bangladesh-based travel platform. This privacy notice is intended for travelers using or considering our products and services. Your privacy matters to us. By using Wandernest, you place your trust in us, and we are committed to protecting and safeguarding your personal data in accordance with Bangladesh law and international best practices.
        </p>
        <h2 className="text-xl font-semibold mt-8 mb-2">1. Information We Collect</h2>
        <ul className="list-disc ml-6 mb-4 text-gray-700">
          <li><strong>Personal Information:</strong> Name, email address, phone number, country, age, passport number, date of birth, profile image, and other information you provide when booking or registering.</li>
          <li><strong>Travel & Booking Data:</strong> Trip details, preferences, payment information, and communications with us.</li>
          <li><strong>Usage Data:</strong> Information about how you use our website and app, including pages visited, activities searched, device and browser info, and IP address.</li>
          <li><strong>Cookies & Tracking:</strong> We use cookies and similar technologies to enhance your experience and analyze usage.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-8 mb-2">2. Legal Basis for Processing</h2>
        <ul className="list-disc ml-6 mb-4 text-gray-700">
          <li>We process your data to fulfill our contract with you, comply with legal obligations in Bangladesh, and for our legitimate business interests (such as improving services and security).</li>
        </ul>
        <h2 className="text-xl font-semibold mt-8 mb-2">3. How We Use Your Information</h2>
        <ul className="list-disc ml-6 mb-4 text-gray-700">
          <li>To provide, personalize, and improve our services</li>
          <li>To process bookings, payments, and customer support requests</li>
          <li>To communicate with you about your account, trips, and offers</li>
          <li>To ensure security, prevent fraud, and comply with laws</li>
        </ul>
        <h2 className="text-xl font-semibold mt-8 mb-2">4. Sharing Your Information</h2>
        <ul className="list-disc ml-6 mb-4 text-gray-700">
          <li>We do not sell your personal information.</li>
          <li>We may share information with trusted third parties (e.g., hotels, guides, payment processors) to fulfill your bookings and improve our services, subject to confidentiality agreements.</li>
          <li>We may disclose information if required by Bangladeshi law, court order, or to protect our rights and users.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-8 mb-2">5. International Transfers</h2>
        <p className="mb-4 text-gray-700">
          If you use Wandernest from outside Bangladesh, your data may be transferred to and processed in Bangladesh. We take steps to ensure your data is protected according to applicable laws.
        </p>
        <h2 className="text-xl font-semibold mt-8 mb-2">6. Data Security</h2>
        <p className="mb-4 text-gray-700">
          We implement industry-standard security measures to protect your data. However, no method of transmission over the Internet or electronic storage is 100% secure. We encourage you to use strong passwords and keep your account information confidential.
        </p>
        <h2 className="text-xl font-semibold mt-8 mb-2">7. Your Rights</h2>
        <ul className="list-disc ml-6 mb-4 text-gray-700">
          <li>You can access, update, or delete your profile information at any time.</li>
          <li>You may opt out of marketing communications by adjusting your account settings.</li>
          <li>You may request a copy of your personal data or ask us to correct or erase it, subject to legal requirements.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-8 mb-2">8. Children's Privacy</h2>
        <p className="mb-4 text-gray-700">
          Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us data, please contact us for removal.
        </p>
        <h2 className="text-xl font-semibold mt-8 mb-2">9. Changes to This Policy</h2>
        <p className="mb-4 text-gray-700">
          We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date.
        </p>
        <h2 className="text-xl font-semibold mt-8 mb-2">10. Contact Us</h2>
        <p className="mb-4 text-gray-700">
          If you have any questions or concerns about this Privacy Policy, or wish to exercise your rights, please contact us at <a href="mailto:support@wandernest.com" className="text-primary-600 underline">support@wandernest.com</a>.
        </p>
      </div>
    </div>
    <Footer />
  </>
);
// ...existing code...

export default PrivacyPolicy;
