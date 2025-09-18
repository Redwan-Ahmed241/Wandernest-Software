import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const TrustSafety: React.FC = () => (
  <>
    <Navbar />
  <div className="min-h-screen bg-white py-12 px-4 mt-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-primary-700 mb-6">Trust & Safety</h1>
        <p className="mb-4 text-gray-700">
          At Wandernest, your safety and trust are our top priorities. We are committed to providing a secure, respectful, and reliable experience for all users.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-2">Our Safety Commitment</h2>
        <ul className="list-disc ml-6 mb-4 text-gray-700">
          <li>All guides and partners are verified for credentials and experience.</li>
          <li>Secure payment processing and data protection measures are in place.</li>
          <li>We monitor activity for fraud, abuse, and policy violations.</li>
        </ul>
        <h2 className="text-2xl font-semibold mt-8 mb-2">Community Guidelines</h2>
        <ul className="list-disc ml-6 mb-4 text-gray-700">
          <li>Respect all users and local cultures.</li>
          <li>No harassment, discrimination, or abusive behavior is tolerated.</li>
          <li>Report any suspicious or unsafe activity to our support team.</li>
        </ul>
        <h2 className="text-2xl font-semibold mt-8 mb-2">Reporting & Support</h2>
        <p className="mb-4 text-gray-700">
          If you encounter any issues, please contact us immediately at <a href="mailto:support@wandernest.com" className="text-primary-600 underline">support@wandernest.com</a> or visit our <a href="/help-center" className="text-primary-600 underline">Help Center</a>.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-2">Travel Safety Tips</h2>
        <ul className="list-disc ml-6 mb-4 text-gray-700">
          <li>Keep your valuables secure and be aware of your surroundings.</li>
          <li>Follow local laws and customs.</li>
          <li>Save emergency contacts and embassy information before you travel.</li>
        </ul>
        <h2 className="text-2xl font-semibold mt-8 mb-2">Your Privacy</h2>
        <p className="mb-4 text-gray-700">
          We protect your personal data according to our <a href="/privacy-policy" className="text-primary-600 underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
    <Footer />
  </>
);

export default TrustSafety;
