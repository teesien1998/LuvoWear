# Payment Integration Guide - Stripe & PayPal

## Overview
This e-commerce application now supports both **PayPal** and **Stripe** payment methods, allowing customers to choose their preferred payment option during checkout.

## Features
- ✅ Dual payment method support (PayPal & Stripe)
- ✅ User-friendly payment method selection interface
- ✅ Secure payment processing
- ✅ Real-time payment status updates
- ✅ Comprehensive error handling

## Setup Instructions

### Prerequisites
1. PayPal Developer Account
2. Stripe Account
3. Node.js and npm installed

### Environment Configuration

#### Frontend (.env)
Create a `.env` file in the `/frontend` directory:
```env
# PayPal Configuration
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id_here

# Stripe Configuration  
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here

# API Configuration
VITE_API_URL=http://localhost:5000
```

#### Backend (.env)
Create a `.env` file in the `/backend` directory:
```env
# Database Configuration
MONGO_URI=your_mongodb_connection_string

# JWT Configuration
JWT_SECRET=your_jwt_secret_here

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here

# Other configurations...
```

### Getting API Keys

#### PayPal
1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Create a new app or use existing one
3. Copy the Client ID from the app credentials

#### Stripe
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to Developers → API keys
3. Copy the Publishable key (for frontend)
4. Copy the Secret key (for backend)

## User Flow

1. **Add to Cart**: Users add products to their shopping cart
2. **Checkout**: Navigate to the checkout page
3. **Shipping Info**: Fill in shipping address details
4. **Payment Method Selection**: Choose between:
   - PayPal - Fast & secure payment via PayPal account
   - Credit/Debit Card - Powered by Stripe
5. **Payment Processing**: Complete payment using selected method
6. **Order Confirmation**: Receive order confirmation upon successful payment

## Payment Components

### Frontend Components

#### `Checkout.jsx`
- Main checkout component
- Handles shipping form
- Payment method selection UI
- Manages checkout state

#### `StripePayment.jsx`
- Stripe Elements integration
- Credit card form
- Payment intent creation
- Card payment processing

#### `PayPalButton.jsx`
- PayPal buttons integration
- PayPal order creation
- Payment capture

### Backend Routes

#### `/api/checkout`
- `POST /` - Create new checkout session
- `PUT /:id/pay` - Mark checkout as paid
- `PUT /:id/finalize` - Finalize checkout and create order
- `POST /create-payment-intent` - Create Stripe payment intent

## Testing

### Test Cards (Stripe)
Use these test card numbers in development:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Authentication Required**: 4000 0025 0000 3155

Use any future date for expiry and any 3-digit CVC.

### Test Accounts (PayPal)
Create sandbox accounts in PayPal Developer Dashboard for testing.

## Security Considerations

1. **Never commit `.env` files** to version control
2. **Use HTTPS** in production
3. **Validate payment amounts** on the backend
4. **Implement webhook verification** for production
5. **Use Stripe's webhook endpoints** to verify payment status
6. **Enable 3D Secure** for card payments in production

## Troubleshooting

### Common Issues

1. **"Stripe is not configured" error**
   - Ensure `VITE_STRIPE_PUBLISHABLE_KEY` is set in frontend `.env`

2. **Payment intent creation fails**
   - Verify `STRIPE_SECRET_KEY` is set in backend `.env`
   - Check if user is authenticated

3. **PayPal buttons not showing**
   - Verify `VITE_PAYPAL_CLIENT_ID` is set correctly
   - Check browser console for errors

4. **CORS errors**
   - Ensure backend CORS configuration allows frontend origin
   - Check API URL configuration

## Production Deployment

1. **Update environment variables** with production keys
2. **Enable HTTPS** on both frontend and backend
3. **Set up Stripe webhooks** for payment verification
4. **Configure PayPal webhooks** for order updates
5. **Implement proper logging** for payment transactions
6. **Set up monitoring** for failed payments

## Support

For payment-related issues:
- Stripe: [Stripe Support](https://support.stripe.com/)
- PayPal: [PayPal Developer Support](https://developer.paypal.com/support/)

## License
This integration follows the terms of service for both Stripe and PayPal.