"use client";

import type { FunctionComponent } from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../App/Layout";
import Sidebar from "./Sidebar";
import {
  visaAPI,
  type Country,
  type VisaPurpose,
  type VisaRequirement,
  type CurrencyRate,
} from "../App/api";
import { useAuth } from "../Authentication/auth-context";

const VisaAssistance: FunctionComponent = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();

  // State management
  const [countries, setCountries] = useState<Country[]>([]);
  const [purposes, setPurposes] = useState<VisaPurpose[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedPurpose, setSelectedPurpose] = useState<string>("");
  const [visaRequirement, setVisaRequirement] =
    useState<VisaRequirement | null>(null);
  const [currencyRates, setCurrencyRates] = useState<CurrencyRate[]>([]);

  // Loading states
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const [isLoadingPurposes, setIsLoadingPurposes] = useState(true);
  const [isLoadingRequirements, setIsLoadingRequirements] = useState(false);
  const [isLoadingRates, setIsLoadingRates] = useState(true);

  // Error states
  const [, setError] = useState<string | null>(null);

  // Fetch initial data
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchCountries();
      fetchPurposes();
      fetchCurrencyRates();
    }
  }, [authLoading, isAuthenticated]);

  // Fetch visa requirements when country and purpose are selected
  useEffect(() => {
    if (selectedCountry && selectedPurpose) {
      fetchVisaRequirements(selectedCountry, selectedPurpose);
    }
  }, [selectedCountry, selectedPurpose]);

  const fetchCountries = async () => {
    try {
      setIsLoadingCountries(true);
      const data = await visaAPI.getCountries();
      setCountries(data.results || data);
    } catch (error) {
      console.error("Error fetching countries:", error);
      setError("Failed to load countries");
    } finally {
      setIsLoadingCountries(false);
    }
  };

  const fetchPurposes = async () => {
    try {
      setIsLoadingPurposes(true);
      const data = await visaAPI.getVisaPurposes();
      setPurposes(data.results || data);
    } catch (error) {
      console.error("Error fetching purposes:", error);
      setError("Failed to load visa purposes");
    } finally {
      setIsLoadingPurposes(false);
    }
  };

  const fetchVisaRequirements = async (
    countryCode: string,
    purpose: string
  ) => {
    try {
      setIsLoadingRequirements(true);
      const data = await visaAPI.getVisaRequirements(countryCode, purpose);
      setVisaRequirement(data);
    } catch (error) {
      console.error("Error fetching visa requirements:", error);
      setVisaRequirement(null);
    } finally {
      setIsLoadingRequirements(false);
    }
  };

  const fetchCurrencyRates = async () => {
    try {
      setIsLoadingRates(true);
      const data = await visaAPI.getCurrencyRates();
      setCurrencyRates(data.results || data);
    } catch (error) {
      console.error("Error fetching currency rates:", error);
    } finally {
      setIsLoadingRates(false);
    }
  };

  const handleStartApplication = () => {
    if (selectedCountry && selectedPurpose) {
      navigate(
        `/visa-application?country=${selectedCountry}&purpose=${selectedPurpose}`
      );
    } else {
      alert("Please select your country and purpose of visit first.");
    }
  };

  const getVisaTypeInfo = (type: string) => {
    switch (type) {
      case "visa_free":
        return {
          title: "Visa-Free",
          description: "No visa required for selected citizenship.",
          icon: "🆓",
          color: "#27ae60",
        };
      case "visa_on_arrival":
        return {
          title: "Visa-on-Arrival",
          description: "Get your visa upon arrival in Bangladesh.",
          icon: "✈️",
          color: "#f39c12",
        };
      case "evisa_required":
        return {
          title: "eVisa Required",
          description: "Apply online for an electronic visa.",
          icon: "💻",
          color: "#3498db",
        };
      case "visa_required":
        return {
          title: "Visa Required",
          description: "Apply at embassy or consulate.",
          icon: "📋",
          color: "#e74c3c",
        };
      default:
        return {
          title: "Unknown",
          description: "Please select country and purpose.",
          icon: "❓",
          color: "#95a5a6",
        };
    }
  };

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-primary-100 to-primary-300 py-8 px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
            <div className="text-center text-gray-500 py-4">Loading...</div>
          </div>
        </div>
      </Layout>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const usdToBdt = currencyRates.find(
    (rate) => rate.from_currency === "USD" && rate.to_currency === "BDT"
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-primary-100 to-primary-300 py-8 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-primary-700 mb-6">
            Visa Assistance
          </h1>
          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Country</label>
              <select
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-primary-400"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                disabled={isLoadingCountries}
              >
                <option value="">Select country</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Purpose</label>
              <select
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-primary-400"
                value={selectedPurpose}
                onChange={(e) => setSelectedPurpose(e.target.value)}
                disabled={isLoadingPurposes}
              >
                <option value="">Select purpose</option>
                {purposes.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {isLoadingRequirements && (
            <div className="text-center text-gray-500 py-4">
              Loading requirements...
            </div>
          )}
          {visaRequirement && (
            <div className="bg-primary-50 rounded p-4 mt-4">
              <h2 className="text-lg font-semibold text-primary-600 mb-2">
                Requirements
              </h2>
              <ul className="list-disc pl-6 text-gray-700">
                {visaRequirement.requirements.map(
                  (req: string, idx: number) => (
                    <li key={idx}>{req}</li>
                  )
                )}
              </ul>
            </div>
          )}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-primary-600 mb-2">
              Currency Rates
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {currencyRates.map((rate) => (
                <div
                  key={rate.code}
                  className="bg-white rounded shadow p-3 flex flex-col items-center"
                >
                  <span className="font-bold text-primary-700">
                    {rate.code}
                  </span>
                  <span className="text-green-600">{rate.rate}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VisaAssistance;
