import type { FunctionComponent } from "react";
import { useCallback } from "react";

const TrustSafety: FunctionComponent = () => {
  const onDepth4FrameClick = useCallback(() => {
    // Add your code here
  }, []);
  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-8 px-2 md:px-8">
      {/* Navbar */}
      <nav className="w-full flex flex-row justify-between items-center mb-8">
        <div className="flex flex-row items-center gap-2">
          <img
            className="h-10 w-10"
            alt=""
            src="/figma_photos/wandernest.svg"
          />
          <button
            onClick={onDepth4FrameClick}
            className="text-xl font-bold text-blue-700"
          >
            WanderNest
          </button>
        </div>
        <div className="flex flex-row gap-6 items-center">
          <button
            onClick={onDepth4FrameClick}
            className="text-base text-gray-700 hover:text-blue-600"
          >
            Destinations
          </button>
          <button
            onClick={onDepth4FrameClick}
            className="text-base text-gray-700 hover:text-blue-600"
          >
            Hotels
          </button>
          <button
            onClick={onDepth4FrameClick}
            className="text-base text-gray-700 hover:text-blue-600"
          >
            Flights
          </button>
          <button
            onClick={onDepth4FrameClick}
            className="text-base text-gray-700 hover:text-blue-600"
          >
            Packages
          </button>
          <button
            onClick={onDepth4FrameClick}
            className="px-4 py-1 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
          >
            Sign up
          </button>
          <button
            onClick={onDepth4FrameClick}
            className="px-4 py-1 rounded bg-gray-200 text-blue-700 font-semibold hover:bg-gray-300"
          >
            Log in
          </button>
          <img className="h-8 w-8" alt="" src="/figma_photos/world.svg" />
        </div>
      </nav>
      {/* Main Content */}
      <main className="w-full max-w-3xl flex flex-col gap-8">
        <section className="bg-blue-50 rounded-lg shadow p-6 flex flex-col items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-700 mb-2">
            Trust & Safety
          </h1>
          <p className="text-gray-700 text-center mb-4">
            Your safety is our priority.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div className="flex flex-col gap-2">
              <b className="text-lg text-blue-700">Community Guidelines</b>
              <b className="text-lg text-blue-700">User Verification</b>
              <b className="text-lg text-blue-700">Content Moderation</b>
              <b className="text-lg text-blue-700">Emergency Support</b>
            </div>
            <div className="flex flex-col gap-2">
              <b className="text-lg text-blue-700">
                Frequently Asked Questions
              </b>
              <div className="flex items-center gap-2">
                <span className="text-gray-700">
                  What are the Community Guidelines?
                </span>
                <img className="h-6 w-6" alt="" src="/figma_photos/faq.svg" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-700">
                  How to contact emergency support?
                </span>
                <img className="h-6 w-6" alt="" src="/figma_photos/faq.svg" />
              </div>
            </div>
          </div>
        </section>
        <section className="bg-white rounded-lg shadow p-6 mt-8">
          <h2 className="text-xl font-bold text-blue-700 mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center">
              <img
                className="h-10 w-10 mb-2"
                alt=""
                src="/figma_photos/emergency.svg"
              />
              <span className="font-semibold text-blue-700">
                Emergency Contacts
              </span>
            </div>
            <div className="flex flex-col items-center">
              <img
                className="h-10 w-10 mb-2"
                alt=""
                src="/figma_photos/helpcenter.svg"
              />
              <span className="font-semibold text-blue-700">Help Center</span>
            </div>
            <div className="flex flex-col items-center">
              <img
                className="h-10 w-10 mb-2"
                alt=""
                src="/figma_photos/terms.svg"
              />
              <span className="font-semibold text-blue-700">
                Terms of Service
              </span>
            </div>
            <div className="flex flex-col items-center">
              <img
                className="h-10 w-10 mb-2"
                alt=""
                src="/figma_photos/privacy.svg"
              />
              <span className="font-semibold text-blue-700">
                Privacy Policy
              </span>
            </div>
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="w-full mt-12 py-6 bg-blue-50 text-center text-blue-700 text-sm">
        <div className="flex flex-row justify-center gap-4 mb-2">
          <button onClick={onDepth4FrameClick} className="hover:underline">
            About Us
          </button>
          <button onClick={onDepth4FrameClick} className="hover:underline">
            Contact
          </button>
          <button onClick={onDepth4FrameClick} className="hover:underline">
            Terms of Service
          </button>
          <button onClick={onDepth4FrameClick} className="hover:underline">
            Privacy Policy
          </button>
        </div>
        <div>@2025 WanderNest, All rights reserved.</div>
      </footer>
    </div>
  );
};

export default TrustSafety;
