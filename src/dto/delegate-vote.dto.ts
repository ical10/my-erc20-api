import { ApiProperty } from '@nestjs/swagger';

export class DelegateVoteDTO {
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  delegateeAddress: string;
}
