import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { env } from '../config/env';

@Injectable()
export class StripeService {
  private readonly client = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-08-27.basil',
  });

  getClient() {
    return this.client;
  }

  isConfigured() {
    return !env.STRIPE_SECRET_KEY.startsWith('sk_test_xxx');
  }
}
