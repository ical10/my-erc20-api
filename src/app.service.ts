import { Injectable, HttpException } from '@nestjs/common';
import { ethers } from 'ethers';
import { PaymentOrderDto } from './dto/payment-order.dto';
import { ClaimPaymentDto } from './dto/claim-payment.dto';
import * as TokenJson from './assets/MyToken.json';
import * as dotenv from 'dotenv';
dotenv.config();

//const TOKENISED_BALLOT_CONTRACT_ADDRESS =
//'0xCf9d8A1B61b4F3f10161294fE2fD229D1cdd22E8';
const ERC20_CONTRACT_ADDRESS = '0xdefE3Eb7407f22c6be1bd668C79f5a5874b79D27';

export class ClaimPaymentDTO {
  id: string;
  secret: string;
  address: string;
}

@Injectable()
export class AppService {
  provider: ethers.providers.Provider;
  contractWithSigner: ethers.Contract;
  deployer: ethers.Wallet;

  database: PaymentOrderDto[];

  constructor() {
    this.provider = ethers.getDefaultProvider('goerli');
    this.deployer = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
    this.contractWithSigner = new ethers.Contract(
      ERC20_CONTRACT_ADDRESS,
      TokenJson.abi,
      this.deployer,
    );
    this.database = [];
  }

  async getTotalSupply() {
    const totalSupplyBN = await this.contractWithSigner.totalSupply();
    const totalSupply = ethers.utils.formatEther(totalSupplyBN);
    return totalSupply;
  }

  async getAllowance(from: string, to: string) {
    const allowanceBN = await this.contractWithSigner.allowance(from, to);
    const allowance = ethers.utils.formatEther(allowanceBN);
    return allowance;
  }

  getTransactionByHash(hash: string) {
    return this.provider.getTransaction(hash);
  }

  async getTransactionReceiptByHash(hash: string) {
    const tx = await this.getTransactionByHash(hash);
    return await tx.wait();
  }

  createPaymentOrder(body: PaymentOrderDto) {
    this.database.push(body);
  }

  getPaymentOrderById(id: string) {
    const element = this.database.find((entry) => entry.id === id);
    if (!element) return false;
    return { id: element.id, amount: element.amount };
  }

  listPaymentOrders() {
    const filteredDatabase = [];

    this.database.forEach((element) => {
      filteredDatabase.push({ id: element.id, amount: element.amount });
    });

    return filteredDatabase;
  }

  async claimPayment(body: ClaimPaymentDto) {
    const element = this.database.find((entry) => entry.id === body.id);
    if (!element) throw new HttpException('Not Found', 404);
    if (body.secret != element.secret) return false;

    const tx = await this.contractWithSigner.mint(
      body.address,
      ethers.utils.parseEther(String(element.amount)),
    );

    return tx;
  }
}
