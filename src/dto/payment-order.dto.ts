import { ApiProperty } from '@nestjs/swagger';

export class PaymentOrderDto {
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  id: string;

  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  secret: string;

  @ApiProperty({
    type: Number,
    description: 'This is a required property',
  })
  amount: number;
}
