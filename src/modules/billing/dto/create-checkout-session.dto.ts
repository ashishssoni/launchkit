import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class CreateCheckoutSessionDto {
  @ApiProperty({ example: 'ws_demo_001' })
  @IsString()
  workspaceId!: string;

  @ApiProperty({ enum: ['FREE', 'PRO', 'TEAM'], example: 'PRO' })
  @IsIn(['FREE', 'PRO', 'TEAM'])
  plan!: 'FREE' | 'PRO' | 'TEAM';

  @ApiProperty({ example: 'https://app.launchkit.dev/billing/success', required: false })
  @IsOptional()
  @IsString()
  successUrl?: string;

  @ApiProperty({ example: 'https://app.launchkit.dev/billing/cancel', required: false })
  @IsOptional()
  @IsString()
  cancelUrl?: string;
}
