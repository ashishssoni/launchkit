import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateApiKeyDto {
  @ApiProperty({ example: 'cmczworkspace123' })
  @IsString()
  workspaceId!: string;

  @ApiProperty({ example: 'Production Integration Key' })
  @IsString()
  @MinLength(3)
  name!: string;
}
