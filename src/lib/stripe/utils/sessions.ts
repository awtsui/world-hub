import { z } from 'zod';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import Order from '@/lib/mongodb/models/Order';
import Big from 'big.js';
import { ClientSession } from 'mongoose';
import { StripeSessionDataRequestBodySchema } from '@/lib/zod/apischema';
import Ticket from '@/lib/mongodb/models/Ticket';

const { STRIPE_SECRET_KEY } = process.env;
if (!STRIPE_SECRET_KEY) throw new Error('STRIPE_SECRET_KEY not defined');

const stripe = new Stripe(STRIPE_SECRET_KEY);

type StripeSessionDataRequestBody = z.infer<typeof StripeSessionDataRequestBodySchema>;

export async function createStripeSession(
  data: StripeSessionDataRequestBody,
  tokenId: string,
  session?: ClientSession,
) {
  try {
    const { tickets, userId, email } = data;

    if (tokenId !== userId) {
      throw Error('Not authorized to create this stripe session');
    }

    const newTicketPromises: Promise<any>[] = [];

    const lineItems: any[] = [];
    let totalPrice = Big('0.0');
    let amount = 0;
    tickets.forEach((item: any) => {
      // TODO: convert price field to Big
      const ticketAmount = Big(item.price).times(item.unitAmount);
      totalPrice = totalPrice.add(ticketAmount);
      amount += item.unitAmount;
      lineItems.push({
        quantity: item.unitAmount,
        price_data: {
          currency: item.currency,
          product_data: {
            name: item.eventTitle,
            metadata: { eventId: item.eventId, label: item.label },
          },
          unit_amount: Big(item.price).times(100).toNumber(),
        },
      });
      newTicketPromises.push(
        Ticket.create(
          Array(item.unitAmount)
            .fill('_')
            .map((_) => ({
              eventId: item.eventId,
              label: item.label,
              hash: '',
              hasValidated: false,
              isExpired: false,
            })),
          { session },
        ),
      );
    });

    const newTicketResults = await Promise.allSettled(newTicketPromises);
    const newTickets: any[] = [];
    newTicketResults.forEach((result) => {
      if (result.status === 'rejected') {
        throw Error('Failed to create all tickets');
      } else {
        newTickets.push(result.value);
      }
    });

    const newTicketIds = newTickets.flat().map((ticket: any) => ticket._id.toString());

    const order = await Order.create(
      [
        {
          userId,
          isPaid: false,
          amount,
          totalPrice: totalPrice.toNumber(),
          ticketData: tickets,
          email: '',
          tickets: newTicketIds,
        },
      ],
      {
        session,
      },
    );

    const headerList = headers();
    const originUrl = headerList.get('origin');

    const stripeSession = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: lineItems,
      mode: 'payment',
      return_url: `${originUrl}/checkout/success?sessionId={CHECKOUT_SESSION_ID}`,
      metadata: { orderId: order[0]._id.toString() },
      customer_email: email || undefined,
    });

    return { success: true, clientSecret: stripeSession.client_secret };
  } catch (error) {
    return { success: false, error: JSON.stringify(error) };
  }
}
