/**
 * Payment API Service
 * Centralized payment integration for SSLCommerz
 * 
 * Backend Endpoint: POST /api/payments/sslc/initiate/
 * Author: Updated based on backend standardization
 * Date: October 15, 2025
 */

const API_BASE = "https://wander-nest-ad3s.onrender.com";

// TypeScript interfaces matching backend expectations
export interface PaymentInitiateRequest {
  amount: number | string;           // Required: Positive value (backend expects Decimal)
  currency?: string;                 // Optional: Default is 'BDT'
  booking_id: string;                // Required: Must belong to authenticated user and exist in DB
  service_type: 'hotel' | 'flight' | 'package' | 'trip';  // Required
  service_name?: string;             // Optional
  service_details?: string;          // Optional
  service_data?: Record<string, unknown>; // Optional: JSON object
  customer_name?: string;            // Optional: Default is 'Customer'
  customer_email?: string;           // Optional: Default is 'customer@example.com'
  customer_phone?: string;           // Optional: Default is '01700000000'
}

export interface PaymentInitiateResponse {
  status: 'SUCCESS' | 'FAILED';
  tran_id: string;
  GatewayPageURL: string;
}

export interface PaymentErrorResponse {
  error: string;
  details?: string;
  detail?: string;
  message?: string;
}

/**
 * Initiate payment with SSLCommerz
 * @param paymentData - Payment request data
 * @param token - Authentication token (optional, will use localStorage if not provided)
 * @returns Payment response with gateway URL
 * @throws Error with user-friendly message
 */
export async function initiatePayment(
  paymentData: PaymentInitiateRequest,
  token?: string
): Promise<PaymentInitiateResponse> {
  
  // Get token from parameter or localStorage
  const authToken = token || localStorage.getItem("token");
  
  if (!authToken) {
    throw new Error("Authentication required. Please login to continue.");
  }

  // Validate required fields
  if (!paymentData.booking_id) {
    throw new Error("Booking ID is required");
  }

  if (!paymentData.amount || Number(paymentData.amount) <= 0) {
    throw new Error("Valid payment amount is required");
  }

  if (!paymentData.service_type) {
    throw new Error("Service type is required");
  }

  // Ensure amount is properly formatted
  // Send as number (Decimal) to match backend expectations
  const amount = typeof paymentData.amount === 'string' 
    ? parseFloat(paymentData.amount) 
    : Number(paymentData.amount);

  const requestBody: Record<string, unknown> = {
    service_type: paymentData.service_type,
    service_name: paymentData.service_name,
    service_details: paymentData.service_details,
    amount: amount,
    booking_id: paymentData.booking_id,  // Always include booking_id (required by backend)
    currency: paymentData.currency || 'BDT',
    customer_name: paymentData.customer_name,
    customer_email: paymentData.customer_email,
    customer_phone: paymentData.customer_phone,
    service_data: paymentData.service_data,
  };

  // Remove undefined values
  Object.keys(requestBody).forEach(key => {
    if (requestBody[key] === undefined) {
      delete requestBody[key];
    }
  });

  console.debug("[Payment API] Initiating payment:", {
    booking_id: requestBody.booking_id,
    amount: requestBody.amount,
    service_type: requestBody.service_type,
  });
  console.debug("[Payment API] Full request body:", requestBody);

  try {
    const response = await fetch(`${API_BASE}/api/payments/sslc/initiate/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Token ${authToken}`,
      },
      body: JSON.stringify(requestBody),
    });

    const responseText = await response.text();
    console.debug("[Payment API] Response status:", response.status);
    console.debug("[Payment API] Raw response:", responseText);

    let data: PaymentInitiateResponse | PaymentErrorResponse;
    
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("[Payment API] Failed to parse response:", parseError);
      console.error("[Payment API] Response was:", responseText);
      throw new Error("Invalid response from payment gateway. Please try again.");
    }

    if (!response.ok) {
      const errorData = data as PaymentErrorResponse;
      
      // Log full error for debugging
      console.error("[Payment API] Error response:", errorData);
      console.error("[Payment API] Status code:", response.status);
      
      const errorMessage =
        errorData.detail ||
        errorData.message ||
        errorData.error ||
        `Payment initiation failed with status ${response.status}`;
      
      throw new Error(errorMessage);
    }

    const successData = data as PaymentInitiateResponse;

    // Validate response structure
    if (!successData.GatewayPageURL) {
      throw new Error("Payment gateway URL not received. Please try again.");
    }

    console.log("[Payment API] Payment initiated successfully:", {
      tran_id: successData.tran_id,
      status: successData.status,
    });

    return successData;

  } catch (error) {
    if (error instanceof Error) {
      throw error; // Re-throw with original message
    }
    throw new Error("Failed to connect to payment gateway. Please check your connection.");
  }
}

/**
 * Helper function to create booking_id
 * @returns Unique booking ID with timestamp
 */
export function generateBookingId(prefix: string = 'booking'): string {
  return `${prefix}_${Date.now()}`;
}

/**
 * Validate payment data before submission
 * @param data - Payment data to validate
 * @returns Validation error message or null if valid
 */
export function validatePaymentData(data: Partial<PaymentInitiateRequest>): string | null {
  if (!data.amount || Number(data.amount) <= 0) {
    return "Payment amount must be greater than zero";
  }

  if (!data.booking_id || data.booking_id.trim() === '') {
    return "Booking ID is required";
  }

  if (!data.service_type) {
    return "Service type is required";
  }

  const validServiceTypes = ['hotel', 'flight', 'package', 'trip'];
  if (!validServiceTypes.includes(data.service_type)) {
    return "Invalid service type";
  }

  if (data.customer_email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.customer_email)) {
      return "Invalid email address";
    }
  }

  if (data.customer_phone && data.customer_phone.length < 10) {
    return "Invalid phone number";
  }

  return null;
}

export default {
  initiatePayment,
  generateBookingId,
  validatePaymentData,
};
