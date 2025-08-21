import type { FunctionComponent } from "react";
import { useCallback } from "react";

const PrivacyPolicy: FunctionComponent = () => {
  const onDepth4FrameClick = useCallback(() => {}, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-100 to-primary-300 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-primary-700 mb-6">
          Privacy Policy
        </h1>
        <section className="mb-6">
          <p className="text-gray-700 mb-4">
            This Privacy Policy describes how WanderNest collects, uses, and
            protects your personal information when you use our website and
            services.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-primary-600 mb-2">
            Information Collection
          </h2>
          <p className="text-gray-700">
            We collect information you provide directly to us, such as when you
            create an account, book a trip, or contact support. We may also
            collect information automatically through cookies and similar
            technologies.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-primary-600 mb-2">
            Use of Information
          </h2>
          <p className="text-gray-700">
            We use your information to provide and improve our services, process
            bookings, communicate with you, and comply with legal obligations.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-primary-600 mb-2">
            Your Choices
          </h2>
          <p className="text-gray-700">
            You can update your account information, opt out of marketing
            communications, and manage cookie preferences in your browser
            settings.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
