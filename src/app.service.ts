import { Injectable, HttpException } from '@nestjs/common';
import { ethers } from 'ethers';
import { PaymentOrderDto } from './dto/payment-order.dto';
import { ClaimPaymentDto } from './dto/claim-payment.dto';
import { DelegateVoteDTO } from './dto/delegate-vote.dto';
import { VoteDTO } from './dto/vote.dto';
import * as TokenJson from './assets/MyToken.json';
import * as BallotJson from './assets/Ballot.json';

//const TOKENISED_BALLOT_CONTRACT_ADDRESS =
const BALLOT_CONTRACT_ADDRESS = '0xCf9d8A1B61b4F3f10161294fE2fD229D1cdd22E8';
const ERC20_CONTRACT_ADDRESS = '0xdefE3Eb7407f22c6be1bd668C79f5a5874b79D27';

export class ClaimPaymentDTO {
  id: string;
  secret: string;
  address: string;
}

@Injectable()
export class AppService {
  provider: ethers.providers.Provider;
  erc20ContractWithSigner: ethers.Contract;
  ballotContractWithSigner: ethers.Contract;
  deployer: ethers.Wallet;

  database: PaymentOrderDto[];

  constructor() {
    this.provider = ethers.getDefaultProvider('goerli');
    this.deployer = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
    this.erc20ContractWithSigner = new ethers.Contract(
      ERC20_CONTRACT_ADDRESS,
      TokenJson.abi,
      this.deployer,
    );
    this.ballotContractWithSigner = new ethers.Contract(
      BALLOT_CONTRACT_ADDRESS,
      BallotJson.abi,
      this.deployer,
    );
    this.database = [];
  }

  async getTotalSupply() {
    const totalSupplyBN = await this.erc20ContractWithSigner.totalSupply();
    const totalSupply = ethers.utils.formatEther(totalSupplyBN);
    return totalSupply;
  }

  async getAllowance(from: string, to: string) {
    const allowanceBN = await this.erc20ContractWithSigner.allowance(from, to);
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

    const tx = await this.erc20ContractWithSigner.mint(
      body.address,
      ethers.utils.parseEther(String(element.amount)),
    );

    return tx;
  }

  async requestVotingTokens(body: any) {
    //todo
    return { result: true };
  }

  async castVotes(body: VoteDTO) {
    const proposalId = body.proposalId;
    const amountToVoteBN = body.amount;

    const amountToVote = ethers.utils.parseEther(amountToVoteBN);

    const txResponse = await this.ballotContractWithSigner.vote(
      proposalId,
      amountToVote,
    );
    const txReceipt = await txResponse.wait(1);
    const txHash = txReceipt.transactionHash;
    return { txHash: txHash };
  }

  async delegateVote(body: DelegateVoteDTO) {
    // should have an address to delegate
    const delegateeAddress: string = body.delegateeAddress;

    const txResponse = await this.erc20ContractWithSigner.delegate(
      delegateeAddress,
    );
    const txReceipt = await txResponse.wait(1);
    const txHash = txReceipt.transactionHash;
    return { txHash: txHash };
  }

  async getVotePower(address: string) {
    const votePowerBN = await this.ballotContractWithSigner.votePower(address);
    const votePower = ethers.utils.formatEther(votePowerBN);
    return { votingPower: votePower };
  }

  getVoteResult() {
    return 'vote result';
  }
}
