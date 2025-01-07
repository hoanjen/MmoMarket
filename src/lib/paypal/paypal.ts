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
    console.log(error);
    throw new BadRequestException('Error capturing order');
  }
}
