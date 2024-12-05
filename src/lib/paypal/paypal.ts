import { BadRequestException } from '@nestjs/common';
import { CreateOrderRequestBody, OrderResponseBody } from '@paypal/paypal-js';

const CLIENT_ID = 'AdLw3OKJsdNjokAp5ddMCfCEnz9nxpTKOI5jpKYsaxdO1hpvedFdcmO-SaL-04-Mbz7oPlDRUVfwu_sK';
const APP_SECRET = 'EKxmvjMkfUUNv2MVyGA4-9JVDIX0rFMLeF8vWurI6eefqjFIUcT3NjXxms1gWygKmckLWoWbtqVR0V4s';
const PAYPAL_SANDBOX_URL = 'https://api-m.sandbox.paypal.com';

const auth = Buffer.from(`${CLIENT_ID}:${APP_SECRET}`).toString('base64');

const generateAccessToken = async () => {
  try {
    const auth = Buffer.from(`${CLIENT_ID}:${APP_SECRET}`).toString('base64');
    const response = await fetch(`${PAYPAL_SANDBOX_URL}/v1/oauth2/token`, {
      method: 'POST',
      body: 'grant_type=client_credentials',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!response.ok) {
      const data = await response.text();
      return undefined;
    }
    const data = await response.json();
    return {
      accessToken: data.access_token,
      expiresIn: data.expires_in,
    };
  } catch (err) {
    return undefined;
  }
};

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
}
