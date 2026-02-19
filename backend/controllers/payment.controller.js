const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_your_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_key_secret'
});

// Create payment order
const createPaymentOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', orderId, userId } = req.body;

    const options = {
      amount: amount * 100, // Razorpay expects amount in paisa
      currency,
      receipt: `order_${orderId}`,
      notes: {
        orderId,
        userId
      }
    };

    const order = await razorpay.orders.create(options);

    // Emit real-time payment order created
    const io = req.app.get('io');
    io.to(`user_${userId}`).emit('payment-order-created', {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Payment order creation error:', error);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
};

// Verify payment
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = require('crypto')
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Payment verified successfully
      // Update order status in database here

      // Emit real-time payment success
      const io = req.app.get('io');
      io.to('role_admin').emit('payment-verified', {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        status: 'success'
      });

      res.json({ status: 'success', message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ status: 'failure', message: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
};

// Get payment details
const getPaymentDetails = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await razorpay.payments.fetch(paymentId);

    res.json(payment);
  } catch (error) {
    console.error('Get payment details error:', error);
    res.status(500).json({ error: 'Failed to fetch payment details' });
  }
};

// Refund payment
const refundPayment = async (req, res) => {
  try {
    const { paymentId, amount } = req.body;

    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount * 100 // Convert to paisa
    });

    // Emit real-time refund notification
    const io = req.app.get('io');
    io.to('role_admin').emit('payment-refunded', {
      paymentId,
      refundId: refund.id,
      amount: refund.amount
    });

    res.json(refund);
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({ error: 'Refund failed' });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
  getPaymentDetails,
  refundPayment
};