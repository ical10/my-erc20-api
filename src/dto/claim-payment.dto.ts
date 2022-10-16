import { ApiProperty } from '@nestjs/swagger';

export class ClaimPaymentDto {
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
    type: String,
    description: 'This is a required property',
  })
  address: string;
}
