"use client";

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// SSLCommerz Payment Success Interface
interface SSLCommerzPaymentData {
  status: string;
  tran_id: string;
  amount: string;
  currency: string;
  card_type?: string;
  bank_tran_id?: string;
  val_id?: string;
  booking_id: string;
}

const PaymentSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState<SSLCommerzPaymentData | null>(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const status = urlParams.get('status');
    
    if (status === 'success') {
      const tran_id = urlParams.get('tran_id');
      const amount = urlParams.get('amount');
      const currency = urlParams.get('currency');
      const booking_id = urlParams.get('booking_id');
      
      // Validate required parameters
      if (tran_id && amount && currency && booking_id) {
        // Additional validation for amount format
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
          console.error('❌ Invalid amount in payment success:', amount);
          navigate('/dashboard');
          return;
        }

        const data: SSLCommerzPaymentData = {
          status,
          tran_id,
          amount,
          currency,
          booking_id,
          card_type: urlParams.get('card_type') || undefined,
          bank_tran_id: urlParams.get('bank_tran_id') || undefined,
          val_id: urlParams.get('val_id') || undefined,
        };
        
        setPaymentData(data);
        console.log('✅ Payment success detected:', data);
        
        // Store payment data in sessionStorage to pass to dashboard
        sessionStorage.setItem('paymentSuccessData', JSON.stringify(data));
        
      } else {
        console.warn('⚠️ Payment success detected but missing required parameters');
        navigate('/dashboard');
      }
    } else if (status === 'fail' || status === 'cancel') {
      console.warn(`⚠️ Payment ${status} detected`);
      navigate('/dashboard?payment=failed');
    } else {
      // No valid payment status, redirect to dashboard
      navigate('/dashboard');
    }
  }, [location.search, navigate]);

  // Countdown effect
  useEffect(() => {
    if (paymentData && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      navigate('/dashboard');
    }
  }, [countdown, paymentData, navigate]);

  if (!paymentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing Payment</h2>
            <p className="text-gray-600">Please wait while we verify your payment...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full mx-4 border border-green-200">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-lg text-gray-600 mb-6">Your booking has been confirmed successfully.</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 mb-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">Transaction ID</span>
            <span className="text-sm font-mono bg-white px-2 py-1 rounded border text-gray-900">
              {paymentData.tran_id}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">Amount</span>
            <span className="text-lg font-bold text-green-600">
              {paymentData.amount} {paymentData.currency}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">Booking ID</span>
            <span className="text-sm font-mono bg-white px-2 py-1 rounded border text-gray-900">
              {paymentData.booking_id}
            </span>
          </div>
          
          {paymentData.card_type && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Payment Method</span>
              <span className="text-sm font-medium text-gray-900">
                {paymentData.card_type}
              </span>
            </div>
          )}

          {paymentData.bank_tran_id && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Bank Transaction ID</span>
              <span className="text-xs font-mono bg-white px-2 py-1 rounded border text-gray-900">
                {paymentData.bank_tran_id}
              </span>
            </div>
          )}
        </div>

        <div className="text-center space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Redirecting to dashboard in {countdown} seconds...</span>
            </p>
          </div>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105"
          >
            Go to Dashboard Now
          </button>
          
          <button
            onClick={() => navigate('/my-trips')}
            className="w-full bg-white text-gray-700 font-medium py-3 px-6 rounded-xl border border-gray-300 hover:bg-gray-50 transition-all duration-200"
          >
            View My Trips
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;