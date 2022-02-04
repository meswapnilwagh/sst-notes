import Stripe from 'stripe';
import handler from './util/handler';
import { calculateCost } from './util/cost';
import { APIGatewayProxyEvent } from 'aws-lambda';

export const charge = handler(async (event: APIGatewayProxyEvent) => {
    const { storage, source } = JSON.parse(event.body || '{}');
    const amount = calculateCost(storage);
    const description = 'Test Charges';

    console.log(' process?.env?.STRIPE_SECRET_KEY :', process?.env?.STRIPE_SECRET_KEY);
    const stripe = new Stripe(process?.env?.STRIPE_SECRET_KEY || '', {});
    await stripe.charges.create({
        source,
        amount,
        description,
        currency: 'usd'
    });

    return { status: true };
})