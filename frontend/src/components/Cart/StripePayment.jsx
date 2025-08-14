import React, { useState, useEffect } from "react";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

const CheckoutForm = ({ amount, checkoutId, shippingAddress, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Create payment intent when component mounts
    const createPaymentIntent = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/checkout/create-payment-intent`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${JSON.parse(localStorage.getItem("userInfo") || "{}").token}`,
            },
            body: JSON.stringify({
              amount: Math.round(amount * 100), // Convert to cents
              checkoutId,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to create payment intent");
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error("Error creating payment intent:", error);
        onError(error);
      }
    };

    if (amount > 0) {
      createPaymentIntent();
    }
  }, [amount, checkoutId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    try {
      // Confirm the payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
              email: shippingAddress.email,
              phone: shippingAddress.phone,
              address: {
                line1: shippingAddress.address,
                city: shippingAddress.city,
                state: shippingAddress.state,
                postal_code: shippingAddress.postalCode,
                country: shippingAddress.country.toLowerCase().substring(0, 2), // Convert to 2-letter country code
              },
            },
          },
        }
      );

      if (error) {
        console.error("Payment error:", error);
        toast.error(error.message || "Payment failed");
        onError(error);
      } else if (paymentIntent.status === "succeeded") {
        toast.success("Payment successful!");
        // Call the success callback with payment details
        onSuccess({
          id: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
          payment_method: paymentIntent.payment_method,
          created: paymentIntent.created,
        });
      }
    } catch (err) {
      console.error("Error processing payment:", err);
      toast.error("An error occurred during payment processing");
      onError(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
      },
      invalid: {
        color: "#9e2146",
        iconColor: "#9e2146",
      },
    },
    hidePostalCode: true, // We already collect this in the shipping form
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border rounded-lg bg-gray-50">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Information
        </label>
        <div className="p-3 bg-white border rounded">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      <div className="text-sm text-gray-600">
        <p className="flex items-center">
          <svg
            className="w-4 h-4 mr-2 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          Your payment information is secure and encrypted
        </p>
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing || !clientSecret}
        className={`w-full py-3 px-4 rounded font-medium text-white transition-colors ${
          isProcessing || !stripe || !clientSecret
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-black hover:bg-gray-800"
        }`}
      >
        {isProcessing ? (
          <span className="flex items-center justify-center">
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processing...
          </span>
        ) : (
          `Pay $${amount.toFixed(2)}`
        )}
      </button>

      <div className="flex justify-center space-x-2 text-xs text-gray-500">
        <span>Powered by</span>
        <svg
          className="h-4"
          viewBox="0 0 60 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.5 12.5C7.5 15.8137 10.1863 18.5 13.5 18.5C16.8137 18.5 19.5 15.8137 19.5 12.5C19.5 9.18629 16.8137 6.5 13.5 6.5C10.1863 6.5 7.5 9.18629 7.5 12.5ZM32.5 18.5C35.8137 18.5 38.5 15.8137 38.5 12.5C38.5 9.18629 35.8137 6.5 32.5 6.5C29.1863 6.5 26.5 9.18629 26.5 12.5C26.5 15.8137 29.1863 18.5 32.5 18.5ZM51.5 18.5C54.8137 18.5 57.5 15.8137 57.5 12.5C57.5 9.18629 54.8137 6.5 51.5 6.5C48.1863 6.5 45.5 9.18629 45.5 12.5C45.5 15.8137 48.1863 18.5 51.5 18.5Z"
            fill="#635BFF"
          />
        </svg>
      </div>
    </form>
  );
};

const StripePayment = ({ amount, checkoutId, shippingAddress, onSuccess, onError }) => {
  if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">
          Stripe is not configured. Please add your Stripe publishable key to continue.
        </p>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        amount={amount}
        checkoutId={checkoutId}
        shippingAddress={shippingAddress}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
};

export default StripePayment;