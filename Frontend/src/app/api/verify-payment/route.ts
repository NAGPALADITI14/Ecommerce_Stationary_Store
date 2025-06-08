// api/verify-payment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      address,
      items,
    } = await request.json();

    // Verify the payment signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Payment is verified, save order to database
      const orderData = {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        items: items,
        address: address,
        status: 'paid',
        createdAt: new Date(),
        totalAmount: items.reduce((total: number, item: any) => 
          total + (item.price * item.quantity), 0
        ),
      };

      // Save to your database here
      // await saveOrderToDatabase(orderData);

      // Send confirmation email
      // await sendOrderConfirmationEmail(address.email, orderData);

      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully',
        orderId: razorpay_order_id,
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { success: false, error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}