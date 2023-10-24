import ContractAbi from "../constants/LoC.json";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../constants";
require('dotenv').config;

export default function getContract() {
  // const provider = new ethers.providers.Web3Provider(window.ethereum as any);
  // const signer = provider.getSigner();
  // let contract = new ethers.Contract(CONTRACT_ADDRESS, ContractAbi.abi, signer);
  // console.log(contract);
  // return contract;
  // Create a provider using an HTTP provider (replace with your Ethereum node URL)
  const provider = new ethers.providers.JsonRpcProvider(process.env.BLOCKCHAIN_NODE_URL);
  const privateKey = process.env.PRIVATE_KEY; 
  const wallet = new ethers.Wallet(privateKey, provider);
  const signer = wallet.connect(provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ContractAbi.abi, signer);

  // console.log(contract);
  return contract;
}
