import { FunctionComponent, useCallback } from "react";
// Tailwind CSS used for all styling. Centralized color theme via tailwind.config.js

const GiftCard: FunctionComponent = () => {
  const onDepth4FrameClick = useCallback(() => {
    // Add your code here
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex flex-col items-center font-sans">
      {/* Navbar */}
      <nav className="w-full bg-white shadow flex flex-col md:flex-row items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <img className="h-10 w-10" alt="" src="Depth 4, Frame 0.svg" />
          <button
            onClick={onDepth4FrameClick}
            className="text-xl font-bold text-blue-700"
          >
            WanderNest
          </button>
        </div>
        <div className="flex gap-6 mt-4 md:mt-0">
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
        </div>
        <div className="flex gap-4 items-center mt-4 md:mt-0">
          <button
            onClick={onDepth4FrameClick}
            className="bg-blue-600 text-white px-4 py-2 rounded font-semibold"
          >
            Sign up
          </button>
          <button
            onClick={onDepth4FrameClick}
            className="bg-gray-200 text-blue-600 px-4 py-2 rounded font-semibold"
          >
            Log in
          </button>
          <img className="h-8 w-8" alt="" src="Depth 5, Frame 2.svg" />
        </div>
      </nav>
      {/* Hero Section */}
      <section className="w-full flex flex-col items-center py-12 bg-blue-50">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4">
          Gift the Joy of Travel
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-8 text-center max-w-xl">
          Give your loved ones the gift of exploring Bangladesh with WanderNest.
        </p>
        <div className="flex gap-6 mb-8">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold shadow hover:bg-blue-700">
            Buy Gift Card
          </button>
          <button className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold shadow hover:bg-green-600">
            Redeem Gift Card
          </button>
        </div>
      </section>
      {/* How It Works */}
      <section className="w-full max-w-4xl px-4 py-8">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="flex flex-col items-center bg-white rounded-lg shadow p-6">
            <img className="h-16 w-16 mb-4" alt="" src="Depth 7, Frame 0.svg" />
            <h3 className="text-lg font-semibold text-blue-600 mb-2">
              Choose a Gift Card
            </h3>
            <p className="text-gray-600 text-center">
              Select a card value and design.
            </p>
          </div>
          {/* Step 2 */}
          <div className="flex flex-col items-center bg-white rounded-lg shadow p-6">
            <img className="h-16 w-16 mb-4" alt="" src="Depth 7, Frame 0.svg" />
            <h3 className="text-lg font-semibold text-blue-600 mb-2">
              Send to Recipient
            </h3>
            <p className="text-gray-600 text-center">
              Personalize and send it instantly.
            </p>
          </div>
          {/* Step 3 */}
          <div className="flex flex-col items-center bg-white rounded-lg shadow p-6">
            <img className="h-16 w-16 mb-4" alt="" src="Depth 7, Frame 0.svg" />
            <h3 className="text-lg font-semibold text-blue-600 mb-2">
              Redeem for Travel
            </h3>
            <p className="text-gray-600 text-center">
              Use the card for trips on WanderNest.
            </p>
          </div>
        </div>
      </section>
      {/* Why Choose WanderNest Gift Cards? */}
      <section className="w-full max-w-4xl px-4 py-8">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">
          Why Choose WanderNest Gift Cards?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Occasion */}
          <div className="flex flex-col items-center bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">
              Perfect for Any Occasion
            </h3>
            <p className="text-gray-600 text-center">
              Flexible, easy to use, and redeemable for travel packages, hotels,
              and more.
            </p>
          </div>
          {/* Flexible Amounts */}
          <div className="flex flex-col items-center bg-white rounded-lg shadow p-6">
            <img className="h-16 w-16 mb-4" alt="" src="Depth 8, Frame 0.svg" />
            <h3 className="text-lg font-semibold text-blue-600 mb-2">
              Flexible Amounts
            </h3>
            <p className="text-gray-600 text-center">
              Choose from multiple denominations.
            </p>
          </div>
          {/* No Expiry & Wide Usage */}
          <div className="flex flex-col items-center bg-white rounded-lg shadow p-6">
            <img className="h-16 w-16 mb-4" alt="" src="Depth 8, Frame 0.svg" />
            <h3 className="text-lg font-semibold text-blue-600 mb-2">
              No Expiry
            </h3>
            <p className="text-gray-600 text-center">
              Gift cards never expire.
            </p>
            <img
              className="h-16 w-16 mt-4 mb-4"
              alt=""
              src="Depth 8, Frame 0.svg"
            />
            <h3 className="text-lg font-semibold text-blue-600 mb-2">
              Wide Usage
            </h3>
            <p className="text-gray-600 text-center">
              Use for hotels, flights, and packages.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GiftCard;
