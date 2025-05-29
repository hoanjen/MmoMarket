import { BadRequestException } from '@nestjs/common';
import { CreateOrderRequestBody, OrderResponseBody } from '@paypal/paypal-js';

const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const APP_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_SANDBOX_URL = process.env.PAYPAL_SANDBOX_URL;

const auth = Buffer.from(`${CLIENT_ID}:${APP_SECRET}`).toString('base64');

export interface InfoPayment {
  invoiceId: string;
  amount: number;
  discount?: number;
  link?: string[];
  nameBuyer?: string;
  mailBuyer?: string;
  phone?: string;
}

export async function createOrder(paymentInfo: InfoPayment) {
  const url = `${PAYPAL_SANDBOX_URL}/v2/checkout/orders`;

  const orderData: CreateOrderRequestBody = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'USD',
          value: paymentInfo.amount.toFixed(2),
        },
        invoice_id: paymentInfo.invoiceId,
      },
    ],
  };
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify(orderData),
  });

  const data: OrderResponseBody = await response.json();

  if (!response.ok || (response.status !== 201 && response.status !== 200)) {
    throw new BadRequestException('Error createOrder');
  }
  return data;
}

export async function captureOrder(orderId: string) {
  const url = `${PAYPAL_SANDBOX_URL}/v2/checkout/orders/${orderId}/capture`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
    });

    const data: OrderResponseBody = await response.json();

    if (!response.ok) {
      throw new BadRequestException('Error capturing order');
    }

    let isCompleted = data.status === 'COMPLETED';
    if (!data.purchase_units?.length) {
      throw new BadRequestException('Error capturing order');
    }

    for (const purchase_unit of data.purchase_units) {
      for (const capture of purchase_unit.payments?.captures ?? []) {
        if (capture.status !== 'COMPLETED') {
          isCompleted = false;
        }
      }
    }

    if (!isCompleted) {
      throw new BadRequestException('Error capturing order, capture is not completed');
    }
    return data;
  } catch (error) {
    throw new BadRequestException('Error capturing order');
  }
}

export async function getAccessTokenPaypalAppMMO() {
  const url = 'https://api-m.sandbox.paypal.com/v1/oauth2/token';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
}

export async function withdrawPaypayByUser(paypal_email: string, amount: number, transaction_id: string) {
  const access_token = await getAccessTokenPaypalAppMMO();

  const res = await fetch('https://api-m.sandbox.paypal.com/v1/payments/payouts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({
      sender_batch_header: {
        sender_batch_id: `${transaction_id}`,
        email_subject: 'Bạn nhận được khoản thanh toán từ mmo market',
        email_message: 'You have received a payout! Thanks for using our service!',
      },
      items: [
        {
          recipient_type: 'EMAIL',
          amount: {
            value: `${amount}`,
            currency: 'USD',
          },
          note: 'Cảm ơn đã sử dụng dịch vụ',
          receiver: `${paypal_email}`,
        },
      ],
    }),
  });
  if (res.status == 201) {
    return true;
  }
  return false;
}
