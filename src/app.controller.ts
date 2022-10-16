import { Controller, Get, Query, Param, Post, Body } from '@nestjs/common';
import { AppService, ClaimPaymentDTO } from './app.service';
import { PaymentOrderDto } from './dto/payment-order.dto';

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
  claimPayment(@Body() body: ClaimPaymentDTO) {
    this.appService.claimPayment(body);
  }
}
