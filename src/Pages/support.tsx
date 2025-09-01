import type { FunctionComponent } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { FaQuestionCircle, FaUsers, FaShieldAlt, FaHandsHelping, FaChevronRight, FaMoneyBillWave, FaPhoneAlt, FaComments } from "react-icons/fa";

const Support: FunctionComponent = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-100 to-primary-300">
      <Navbar />
      <main className="flex-1 flex justify-center items-center px-4 py-8">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-10 flex flex-col gap-10">
          <h1 className="text-4xl font-extrabold text-primary-700 text-center mb-2 tracking-tight">Support Center</h1>
          <p className="text-center text-gray-500 mb-6">How can we help you today? Find answers, get support, or reach out to our team.</p>
          <section>
            <h2 className="text-xl font-bold text-primary-700 mb-4">Quick Links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button className="flex items-center gap-3 bg-primary-50 hover:bg-primary-100 transition p-4 rounded-lg shadow text-primary-700 font-semibold">
                <FaQuestionCircle className="text-primary-400 text-2xl" /> About
              </button>
              <button className="flex items-center gap-3 bg-primary-50 hover:bg-primary-100 transition p-4 rounded-lg shadow text-primary-700 font-semibold">
                <FaHandsHelping className="text-primary-400 text-2xl" /> Help Center
              </button>
              <button className="flex items-center gap-3 bg-primary-50 hover:bg-primary-100 transition p-4 rounded-lg shadow text-primary-700 font-semibold">
                <FaUsers className="text-primary-400 text-2xl" /> Community
              </button>
              <button className="flex items-center gap-3 bg-primary-50 hover:bg-primary-100 transition p-4 rounded-lg shadow text-primary-700 font-semibold">
                <FaShieldAlt className="text-primary-400 text-2xl" /> Trust & Safety
              </button>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-bold text-primary-700 mb-4">Popular Topics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-5 rounded-xl shadow flex flex-col items-center text-center">
                <FaShieldAlt className="text-primary-500 text-3xl mb-2" />
                <div className="font-semibold text-primary-600">Enhanced cleaning protocol</div>
                <div className="text-gray-700 text-sm">Learn about our new cleaning standards</div>
              </div>
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-5 rounded-xl shadow flex flex-col items-center text-center">
                <FaChevronRight className="text-primary-500 text-3xl mb-2" />
                <div className="font-semibold text-primary-600">Cancel a reservation</div>
                <div className="text-gray-700 text-sm">How to cancel your booking</div>
              </div>
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-5 rounded-xl shadow flex flex-col items-center text-center">
                <FaMoneyBillWave className="text-primary-500 text-3xl mb-2" />
                <div className="font-semibold text-primary-600">Security deposit</div>
                <div className="text-gray-700 text-sm">Benefits and process explained</div>
              </div>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-bold text-primary-700 mb-4">Get Help from Our Community</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-primary-50 p-5 rounded-xl shadow flex flex-col items-center text-center">
                <FaUsers className="text-primary-500 text-3xl mb-2" />
                <div className="font-semibold text-primary-600">Visit our community</div>
                <div className="text-gray-700 text-sm">Find answers and general info</div>
              </div>
              <div className="bg-primary-50 p-5 rounded-xl shadow flex flex-col items-center text-center">
                <FaComments className="text-primary-500 text-3xl mb-2" />
                <div className="font-semibold text-primary-600">Host Q&A</div>
                <div className="text-gray-700 text-sm">Ask questions and get help</div>
              </div>
              <div className="bg-primary-50 p-5 rounded-xl shadow flex flex-col items-center text-center">
                <FaPhoneAlt className="text-primary-500 text-3xl mb-2" />
                <div className="font-semibold text-primary-600">Urgent issues</div>
                <div className="text-gray-700 text-sm">Discuss urgent matters</div>
              </div>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-bold text-primary-700 mb-4">Contact Us</h2>
            <div className="flex flex-col items-center gap-2">
              <button className="bg-primary-500 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-primary-600 transition font-semibold flex items-center gap-2">
                <FaPhoneAlt className="text-white" /> Get in touch
              </button>
              <span className="text-gray-500 text-sm">Our support team is available 24/7 to assist you.</span>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Support;
