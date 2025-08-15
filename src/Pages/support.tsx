import type { FunctionComponent } from "react";
import { useCallback } from "react";

const Support: FunctionComponent = () => {
  const onDepth7FrameClick = useCallback(() => {
    // Add your code here
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-100 to-primary-300 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-primary-700 mb-6">Support</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="flex flex-col gap-4">
            <div className="font-semibold text-primary-600">About</div>
            <div className="font-semibold text-primary-600">Help Center</div>
            <div className="font-semibold text-primary-600">Community</div>
            <div className="font-semibold text-primary-600">Trust & Safety</div>
            <div className="font-semibold text-primary-600">Support</div>
          </div>
          <div className="flex flex-col gap-4">
            <button className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600 transition font-semibold">
              Visit help center
            </button>
            <div className="font-bold text-primary-700">Support</div>
            <div className="flex items-center gap-2">
              <img className="h-8 w-8" alt="" src="/figma_photos/support.svg" />
              <span className="text-gray-700">Search for answers...</span>
            </div>
            <div className="font-semibold text-primary-600">Covid-19</div>
            <div className="font-semibold text-primary-600">
              Cancellation options
            </div>
            <div className="font-semibold text-primary-600">
              Security deposit
            </div>
            <div className="font-semibold text-primary-600">
              Payment options
            </div>
            <div className="font-semibold text-primary-600">Accessibility</div>
            <div className="font-semibold text-primary-600">More topics</div>
          </div>
        </div>
        <div className="mb-8">
          <div className="font-bold text-primary-700 mb-4">Most popular</div>
          <div className="flex flex-col gap-4">
            <div className="bg-gray-100 p-4 rounded-lg shadow">
              <div className="font-semibold text-primary-600">
                What is Airbnb's enhanced cleaning protocol?
              </div>
              <div className="text-gray-700">
                Find out more about our new cleaning protocol
              </div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow">
              <div className="font-semibold text-primary-600">
                How do I cancel a reservation?
              </div>
              <div className="text-gray-700">
                Learn how to cancel a reservation
              </div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow">
              <div className="font-semibold text-primary-600">
                What is a security deposit and how does it work?
              </div>
              <div className="text-gray-700">
                Read about the benefits of the security deposit
              </div>
            </div>
          </div>
        </div>
        <div className="mb-8">
          <div className="font-bold text-primary-700 mb-4">
            Get help from our community
          </div>
          <div className="flex flex-col gap-4">
            <div className="bg-gray-100 p-4 rounded-lg shadow">
              <div className="font-semibold text-primary-600">
                Visit our community
              </div>
              <div className="text-gray-700">
                Find answers and general info in our community
              </div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow">
              <div className="font-semibold text-primary-600">Host Q&A</div>
              <div className="text-gray-700">
                Ask questions and get help from other hosts
              </div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow">
              <div className="font-semibold text-primary-600">
                Urgent issues
              </div>
              <div className="text-gray-700">
                Discuss urgent issues with other hosts
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="font-bold text-primary-700 mb-4">Contact us</div>
          <div className="flex flex-col gap-4">
            <button className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600 transition font-semibold">
              Get in touch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
