import express, { Request, Response } from 'express';
import Stripe from 'stripe';
import { PaymentService } from '../services/PaymentService';

const router = express.Router();
const paymentService = new PaymentService();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-11-15'
});

/**
 * @route POST /api/v1/webhook/stripe
 * @desc Stripe Webhook处理
 * @access Public (Stripe only)
 */
router.post('/stripe', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    console.log('Stripe webhook event:', event.type);

    switch (event.type) {
      case 'payment_intent.succeeded':
        await paymentService.handleStripePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await paymentService.handleStripePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'charge.refunded':
        await paymentService.handleStripeRefund(event.data.object as Stripe.Charge);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error('Stripe webhook error:', error);
    res.status(400).json({
      error: 'Webhook error',
      message: error.message
    });
  }
});

/**
 * @route POST /api/v1/webhook/wechat
 * @desc 微信支付回调
 * @access Public (WeChat only)
 */
router.post('/wechat', async (req: Request, res: Response) => {
  try {
    // 微信支付回调处理逻辑
    const { out_trade_no, transaction_id, trade_state } = req.body;

    if (trade_state === 'SUCCESS') {
      await paymentService.handleWeChatPaymentSuccess({
        outTradeNo: out_trade_no,
        transactionId: transaction_id
      });
    }

    // 返回微信要求的XML格式
    res.set('Content-Type', 'text/xml');
    res.send(`<xml><return_code><![CDATA[SUCCESS]]></return_code></xml>`);
  } catch (error: any) {
    console.error('WeChat webhook error:', error);
    res.set('Content-Type', 'text/xml');
    res.send(`<xml><return_code><![CDATA[FAIL]]></return_code></xml>`);
  }
});

/**
 * @route POST /api/v1/webhook/alipay
 * @desc 支付宝回调
 * @access Public (Alipay only)
 */
router.post('/alipay', async (req: Request, res: Response) => {
  try {
    const { out_trade_no, trade_no, trade_status } = req.body;

    if (trade_status === 'TRADE_SUCCESS') {
      await paymentService.handleAlipayPaymentSuccess({
        outTradeNo: out_trade_no,
        tradeNo: trade_no
      });
    }

    res.send('success');
  } catch (error: any) {
    console.error('Alipay webhook error:', error);
    res.send('fail');
  }
});

export default router;


