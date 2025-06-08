"use client";

import React, { useState, useEffect } from 'react';
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrderContext"; 
import Image from 'next/image';

// Types
interface Address {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const FinalCheckoutPage: React.FC = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { addOrder } = useOrders(); // Use the orders context
  const [step, setStep] = useState<'address' | 'bill' | 'payment'>('address');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  
  const [address, setAddress] = useState<Address>({
    fullName: '',
    phone: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Calculate totals
  const subtotal = totalPrice;
  const shippingCost = subtotal === 0 ? 0:(subtotal > 500 ? 0 : 50);
  const taxRate = 0.18; // 18% GST
  const taxAmount = subtotal * taxRate;
  const finalTotal = subtotal + shippingCost + taxAmount;

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAddress()) {
      setStep('bill');
    }
  };

  const validateAddress = () => {
    const required = ['fullName', 'phone', 'email', 'addressLine1', 'city', 'state', 'pincode'];
    return required.every(field => address[field as keyof Address].trim() !== '');
  };

  const handleAddressChange = (field: keyof Address, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const initiatePayment = async () => {
    try {
      setIsProcessing(true);
      
      // Create order on your backend
      const orderResponse = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(finalTotal * 100), // Amount in paise
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
          items: items,
          address: address
        })
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error('Failed to create order');
      }

      // Initialize Razorpay payment
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Your Razorpay key
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'Your Store Name',
        description: 'Purchase from Your Store',
        order_id: orderData.order.id,
        handler: async (response: RazorpayResponse) => {
          // Verify payment on your backend
          const verifyResponse = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              address: address,
              items: items
            })
          });

          const verifyData = await verifyResponse.json();

          if (verifyData.success) {
            // Save order to context/localStorage
            const orderToSave = {
              items: items.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                variant: item.variant,
                image: item.image
              })),
              address: address,
              subtotal: subtotal,
              shippingCost: shippingCost,
              taxAmount: taxAmount,
              totalAmount: finalTotal,
              estimatedDelivery: new Date(Date.now() + (Math.floor(Math.random() * 4) + 4) * 24 * 60 * 60 * 1000), // 4-7 days
              status: 'confirmed' as const,
              paymentId: response.razorpay_payment_id
            };

            addOrder(orderToSave);
            setOrderDetails(orderToSave);
            setOrderSuccess(true);
            clearCart();
          } else {
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: address.fullName,
          email: address.email,
          contact: address.phone
        },
        theme: {
          color: '#000000'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Successful!</h2>
          <p className="text-gray-600 mb-4">Thank you for your purchase. You will receive a confirmation email shortly.</p>
          {orderDetails && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
              <h3 className="font-semibold mb-2">Order Details:</h3>
              <p className="text-sm text-gray-600">
                Total Amount: ₹{orderDetails.totalAmount.toFixed(2)}<br/>
                Expected Delivery: {orderDetails.estimatedDelivery.toLocaleDateString()}<br/>
                Payment ID: {orderDetails.paymentId}
              </p>
            </div>
          )}
          <div className="flex gap-3">
            <button 
              onClick={() => window.location.href = '/profile/order'}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
            >
              Track Order
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 text-sm"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className={`flex items-center ${step === 'address' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'address' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="ml-2 font-medium">Address</span>
            </div>
            <div className={`flex items-center ${step === 'bill' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'bill' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="ml-2 font-medium">Review</span>
            </div>
            <div className={`flex items-center ${step === 'payment' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'payment' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="ml-2 font-medium">Payment</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: step === 'address' ? '33%' : step === 'bill' ? '66%' : '100%' 
              }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 'address' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={address.fullName}
                        onChange={(e) => handleAddressChange('fullName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={address.phone}
                        onChange={(e) => handleAddressChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={address.email}
                      onChange={(e) => handleAddressChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.addressLine1}
                      onChange={(e) => handleAddressChange('addressLine1', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="House number and street name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      value={address.addressLine2}
                      onChange={(e) => handleAddressChange('addressLine2', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Apartment, suite, etc. (optional)"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={address.city}
                        onChange={(e) => handleAddressChange('city', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        required
                        value={address.state}
                        onChange={(e) => handleAddressChange('state', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={address.pincode}
                        onChange={(e) => handleAddressChange('pincode', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 font-medium"
                  >
                    Continue to Review
                  </button>
                </form>
              </div>
            )}

            {step === 'bill' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Order Review</h2>
                  <button
                    onClick={() => setStep('address')}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Edit Address
                  </button>
                </div>

                {/* Shipping Address */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Shipping Address</h3>
                  <p className="text-sm text-gray-700">
                    {address.fullName}<br />
                    {address.addressLine1}<br />
                    {address.addressLine2 && `${address.addressLine2}`}<br />
                    {address.city}, {address.state} {address.pincode}<br />
                    {address.country}<br />
                    Phone: {address.phone}<br />
                    Email: {address.email}
                  </p>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-md"
                            width={500} // <-- Add a default width
                            height={500}
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No Image</span>
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.name}</h4>
                          {item.variant && (
                            <p className="text-sm text-gray-500">{item.variant}</p>
                          )}
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-sm">Qty: {item.quantity}</span>
                            <span className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setStep('payment')}
                  className="w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 font-medium"
                >
                  Proceed to Payment
                </button>
              </div>
            )}

            {step === 'payment' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6">Payment</h2>
                <div className="mb-6">
                  <div className="flex items-center p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
                    <div className="flex-1">
                      <h3 className="font-semibold text-blue-900">Razorpay Payment Gateway</h3>
                      <p className="text-sm text-blue-700">Secure payment via Razorpay. Supports cards, UPI, netbanking, and wallets.</p>
                    </div>
                    <div className="ml-4">
                      <Image 
                        src="https://razorpay.com/assets/razorpay-logo.svg" 
                        alt="Razorpay" 
                        className="h-8"
                        width={500} // <-- Add a default width
                        height={500}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep('bill')}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-50 font-medium"
                  >
                    Back to Review
                  </button>
                  <button
                    onClick={initiatePayment}
                    disabled={isProcessing}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Processing...' : `Pay ₹${finalTotal.toFixed(2)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="text-xl font-bold mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal ({items.length} items)</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `₹${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (GST 18%)</span>
                  <span>₹{taxAmount.toFixed(2)}</span>
                </div>
                <hr />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {shippingCost === 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-green-800">🎉 You got free shipping!</p>
                </div>
              )}

              <div className="text-xs text-gray-500 mt-4">
                <p>• Secure checkout with SSL encryption</p>
                <p>• 30-day return policy</p>
                <p>• Customer support available 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalCheckoutPage;
