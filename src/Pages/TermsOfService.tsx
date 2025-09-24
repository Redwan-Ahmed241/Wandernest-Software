
import type { FunctionComponent } from "react";
import Layout from "../components/Layout";

const TermsOfService: FunctionComponent = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-primary-100 to-primary-300 py-8 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-primary-700 mb-6">
            Terms of Service
          </h1>
          <section className="mb-6">
            <p className="text-gray-700 mb-4">
              These Terms of Service (the 'Agreement') are an agreement between
              WanderNest, Inc. ('WanderNest' or 'us'), the owner and operator of
              wandernest.com (the 'Site'), the WanderNest software (the
              'Software'), and you ('you' or 'You'), a user of the Site or
              Software. This Agreement sets forth the general terms and
              conditions of your use of the Site and the Software.
            </p>
          </section>
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-primary-600 mb-2">
              Accounts
            </h2>
            <p className="text-gray-700">
              Account Creation. In order to use the Software, you must create an
              account on the Site (an 'Account'). You represent and warrant that
              all information you submit when you create your Account is
              accurate, current and complete, and that you will keep your
              Account information accurate, current or complete. If WanderNest
              believes that your information is not accurate, current or
              complete, we have the right to refuse you access to the Site and
              Software, and to terminate or suspend your Account.
            </p>
          </section>
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-primary-600 mb-2">
              Modifications
            </h2>
            <p className="text-gray-700">
              To the Agreement. WanderNest reserves the right to change this
              Agreement from time to time. The most current version of this
              Agreement will be located on the Site. You understand and agree
              that if you use the Software after the date on which the Agreement
              has changed, WanderNest will treat your use as acceptance of the
              updated Agreement.
            </p>
          </section>
        </div>
=======
import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const TermsOfService: React.FC = () => (
  <>
    <Navbar />
    <div className="min-h-screen bg-white py-12 px-4 mt-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-primary-700 text-center mb-2 tracking-tight">
          Terms of Service
        </h1>
        <p className="text-gray-700 text-base mb-8 text-center">
          These Terms of Service govern your use of WanderNest's platform and services. Please read them carefully.
        </p>
        
        <section className="mb-8">
          <h2 className="text-xl font-bold text-primary-700 mb-4">Agreement Overview</h2>
          <p className="text-gray-600 mb-4">
            These Terms of Service (the "Agreement") are an agreement between
            WanderNest, Inc. ("WanderNest" or "us"), the owner and operator of
            wandernest.com (the "Site"), the WanderNest software (the
            "Software"), and you ("you" or "You"), a user of the Site or
            Software. This Agreement sets forth the general terms and
            conditions of your use of the Site and the Software.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-primary-700 mb-4">User Accounts</h2>
          <h3 className="text-lg font-semibold text-primary-600 mb-2">Account Creation</h3>
          <p className="text-gray-600 mb-4">
            In order to use the Software, you must create an account on the Site (an "Account"). 
            You represent and warrant that all information you submit when you create your Account is
            accurate, current and complete, and that you will keep your Account information 
            accurate, current and complete.
          </p>
          <h3 className="text-lg font-semibold text-primary-600 mb-2">Account Security</h3>
          <p className="text-gray-600 mb-4">
            You are responsible for maintaining the confidentiality of your account credentials.
            If WanderNest believes that your information is not accurate, current or complete, 
            we have the right to refuse you access to the Site and Software, and to terminate 
            or suspend your Account.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-primary-700 mb-4">Service Usage</h2>
          <h3 className="text-lg font-semibold text-primary-600 mb-2">Permitted Use</h3>
          <p className="text-gray-600 mb-4">
            You may use our services for lawful purposes only. You agree not to use the platform
            for any unlawful or prohibited activities, including but not limited to fraudulent
            bookings, harassment of other users, or violation of third-party rights.
          </p>
          <h3 className="text-lg font-semibold text-primary-600 mb-2">Booking and Payments</h3>
          <p className="text-gray-600 mb-4">
            When making bookings through our platform, you agree to provide accurate payment
            information and authorize charges for your selected services. All bookings are
            subject to availability and confirmation by service providers.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-primary-700 mb-4">Privacy and Data</h2>
          <p className="text-gray-600 mb-4">
            Your privacy is important to us. Our collection and use of personal information
            is governed by our Privacy Policy, which is incorporated into these Terms by reference.
            By using our services, you consent to the collection and use of your information
            as described in our Privacy Policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-primary-700 mb-4">Modifications to Terms</h2>
          <p className="text-gray-600 mb-4">
            WanderNest reserves the right to change this Agreement from time to time. 
            The most current version of this Agreement will be located on the Site. 
            You understand and agree that if you use the Software after the date on which 
            the Agreement has changed, WanderNest will treat your use as acceptance of the
            updated Agreement.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-primary-700 mb-4">Limitation of Liability</h2>
          <p className="text-gray-600 mb-4">
            WanderNest shall not be liable for any indirect, incidental, special, consequential,
            or punitive damages, including without limitation, loss of profits, data, use,
            goodwill, or other intangible losses, resulting from your use of our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-primary-700 mb-4">Contact Information</h2>
          <p className="text-gray-600">
            If you have any questions about these Terms of Service, please contact us at:
          </p>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700 font-semibold">WanderNest Support</p>
            <p className="text-gray-600">Email: wandersupp@gmail.com</p>
            <p className="text-gray-600">Phone: 01940432541</p>
          </div>
        </section>

      </div>
    </div>
    <Footer />
  </>
);

export default TermsOfService;
