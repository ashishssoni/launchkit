import { ApiProperty } from '@nestjs/swagger';

export class StripeWebhookAckDto {
  @ApiProperty({ example: true })
  received!: boolean;

  @ApiProperty({ example: 'customer.subscription.updated' })
  type!: string;
}
