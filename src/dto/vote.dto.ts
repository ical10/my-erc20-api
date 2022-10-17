import { ApiProperty } from '@nestjs/swagger';

export class VoteDTO {
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  proposalId: string;

  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  amount: string;
}
