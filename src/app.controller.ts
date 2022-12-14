import { Controller, Get, Query, Param, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { PaymentOrderDto } from './dto/payment-order.dto';
import { ClaimPaymentDto } from './dto/claim-payment.dto';
import { DelegateVoteDTO } from './dto/delegate-vote.dto';
import { VoteDTO } from './dto/vote.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('total-supply')
  getTotalSupply() {
    return this.appService.getTotalSupply();
  }

  @Get('allowance')
  getAllowance(@Query('from') from: string, @Query('to') to: string) {
    return this.appService.getAllowance(from, to);
  }

  @Get('transaction-by-hash/:hash')
  getTransactionByHash(@Param('hash') hash: string) {
    return this.appService.getTransactionByHash(hash);
  }

  @Get('transaction-receipt-by-hash/:hash')
  getTransactionReceiptByHash(@Param('hash') hash: string) {
    return this.appService.getTransactionReceiptByHash(hash);
  }

  @Get('list-payment-orders')
  listPaymentOrders() {
    return this.appService.listPaymentOrders();
  }

  @Get('get-payment-order')
  getPaymentOrder(@Param('id') id: string) {
    this.appService.getPaymentOrderById(id);
  }

  @Post('create-order')
  createOrder(@Body() body: PaymentOrderDto) {
    return this.appService.createPaymentOrder(body);
  }

  @Post('claim-payment')
  claimPayment(@Body() body: ClaimPaymentDto) {
    return this.appService.claimPayment(body);
  }

  @Post('request-voting-tokens')
  requestVotingTokens(@Body() body: any) {
    return this.appService.requestVotingTokens(body);
  }

  @Post('vote')
  castVotes(@Body() body: VoteDTO) {
    return this.appService.castVotes(body);
  }

  @Post('delegate-vote')
  delegateVote(@Body() body: DelegateVoteDTO) {
    return this.appService.delegateVote(body);
  }

  @Get('voting-result')
  getVoteResult() {
    return this.appService.getVoteResult();
  }

  @Get('vote-power/:address')
  getVotePower(@Param('address') address: string) {
    return this.appService.getVotePower(address);
  }

  //Finish the voting dApp to cast votes, delegate and query results on chain
}
