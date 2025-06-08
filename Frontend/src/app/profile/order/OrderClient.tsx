"use client";

import React, { useState, useEffect } from 'react';
import { useOrders } from "@/context/OrderContext";
import { ChevronRight, Package, Truck, CheckCircle, Clock, MapPin, Phone, Mail } from 'lucide-react';

// Helper function to safely parse dates
const parseDate = (dateValue: any): Date => {
  if (dateValue instanceof Date) return dateValue;
  if (typeof dateValue === 'string') return new Date(dateValue);
  return new Date(); // fallback
};

const ProfileOrdersClient: React.FC = () => {
  const { orders } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'delivered'>('all');
  const [mounted, setMounted] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Process orders to handle Date objects safely
  const processedOrders = React.useMemo(() => {
    if (!orders || !Array.isArray(orders)) return [];
    
    return orders.map(order => ({
      ...order,
      orderDate: parseDate(order.orderDate),
      estimatedDelivery: parseDate(order.estimatedDelivery),
      trackingSteps: order.trackingSteps?.map((step: any) => ({
        ...step,
        timestamp: parseDate(step.timestamp)
      })) || []
    }));
  }, [orders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'out_for_delivery': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <Clock className="w-4 h-4" />;
      case 'processing': return <Package className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'out_for_delivery': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const handleStartShopping = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  // Show loading state until client-side hydration is complete
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
            <p className="text-gray-600">Track and manage your orders</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  const filteredOrders = processedOrders.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return order.status !== 'delivered';
    if (activeTab === 'delivered') return order.status === 'delivered';
    return true;
  });

  const selectedOrderDetails = processedOrders.find(order => order.id === selectedOrder);

  if (selectedOrderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Back Button */}
          <button
            onClick={() => setSelectedOrder(null)}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
          >
            <ChevronRight className="w-4 h-4 rotate-180 mr-1" />
            Back to Orders
          </button>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Order Header */}
            <div className="bg-gray-50 px-6 py-4 border-b">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Order #{selectedOrderDetails.orderNumber}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Placed on {selectedOrderDetails.orderDate.toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrderDetails.status)}`}>
                    {getStatusIcon(selectedOrderDetails.status)}
                    <span className="ml-2 capitalize">{selectedOrderDetails.status.replace('_', ' ')}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Order Tracking */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-6">Order Tracking</h2>
                <div className="relative">
                  {selectedOrderDetails.trackingSteps.map((step: any, index: number) => (
                    <div key={index} className="flex items-start mb-6 relative">
                      {/* Timeline Line */}
                      {index < selectedOrderDetails.trackingSteps.length - 1 && (
                        <div className={`absolute left-4 top-8 w-0.5 h-16 ${step.completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      )}
                      
                      {/* Timeline Dot */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.completed ? 'bg-green-500' : 'bg-gray-300'
                      } relative z-10`}>
                        {step.completed ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>

                      {/* Timeline Content */}
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-semibold ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                            {step.status}
                          </h3>
                          <span className={`text-sm ${step.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                            {step.completed ? step.timestamp.toLocaleDateString('en-IN') : 'Pending'}
                          </span>
                        </div>
                        <p className={`text-sm mt-1 ${step.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Estimated Delivery */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                  <div className="flex items-center">
                    <Truck className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="font-semibold text-blue-900">
                      Estimated Delivery: {selectedOrderDetails.estimatedDelivery.toLocaleDateString('en-IN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-gray-600 mr-3 mt-0.5" />
                    <div>
                      <p className="font-semibold">{selectedOrderDetails.address.fullName}</p>
                      <p className="text-gray-600 mt-1">
                        {selectedOrderDetails.address.addressLine1}<br />
                        {selectedOrderDetails.address.addressLine2 && `${selectedOrderDetails.address.addressLine2}`}<br />
                        {selectedOrderDetails.address.city}, {selectedOrderDetails.address.state} {selectedOrderDetails.address.pincode}<br />
                        {selectedOrderDetails.address.country}
                      </p>
                      <div className="flex items-center mt-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-1" />
                        {selectedOrderDetails.address.phone}
                        <Mail className="w-4 h-4 ml-4 mr-1" />
                        {selectedOrderDetails.address.email}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                <div className="space-y-4">
                  {selectedOrderDetails.items.map((item: any) => (
                    <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.name}</h4>
                        {item.variant && (
                          <p className="text-sm text-gray-500">{item.variant}</p>
                        )}
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                          <span className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{selectedOrderDetails.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{selectedOrderDetails.shippingCost === 0 ? 'Free' : `₹${selectedOrderDetails.shippingCost.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (GST)</span>
                      <span>₹{selectedOrderDetails.taxAmount.toFixed(2)}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>₹{selectedOrderDetails.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-600">
                      Payment ID: {selectedOrderDetails.paymentId}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            {[
              { key: 'all', label: 'All Orders', count: processedOrders.length },
              { key: 'active', label: 'Active', count: processedOrders.filter(o => o.status !== 'delivered').length },
              { key: 'delivered', label: 'Delivered', count: processedOrders.filter(o => o.status === 'delivered').length }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h2>
            <p className="text-gray-600 mb-6">
              {activeTab === 'all' 
                ? "You haven't placed any orders yet." 
                : `No ${activeTab} orders found.`}
            </p>
            <button
              onClick={handleStartShopping}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedOrder(order.id)}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold mr-4">
                        Order #{order.orderNumber}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status.replace('_', ' ')}</span>
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-3">
                      <p>Placed on {order.orderDate.toLocaleDateString('en-IN')}</p>
                      <p>Total: ₹{order.totalAmount.toFixed(2)} • {order.items.length} item(s)</p>
                      <p>Estimated delivery: {order.estimatedDelivery.toLocaleDateString('en-IN')}</p>
                    </div>

                    {/* Order Items Preview */}
                    <div className="flex -space-x-2 mb-3">
                      {order.items.slice(0, 3).map((item: any, index: number) => (
                        <div key={index} className="relative">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 rounded-lg border-2 border-white object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-lg border-2 border-white flex items-center justify-center">
                              <Package className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0 md:ml-6">
                    <div className="flex items-center text-blue-600 hover:text-blue-800">
                      <span className="text-sm font-medium mr-2">View Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileOrdersClient;