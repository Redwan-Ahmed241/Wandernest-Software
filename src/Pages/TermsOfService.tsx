import type { FunctionComponent } from "react";
import { useCallback } from "react";
import Layout from "../App/Layout";

const TermsOfService: FunctionComponent = () => {
  const onDepth4FrameClick = useCallback(() => {
    // Add your code here
  }, []);
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
      </div>
    </Layout>
  );
};

export default TermsOfService;
