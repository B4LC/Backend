import ContractAbi from "../constants/TradeFinance.json";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../constants";

declare global {
  interface Window {
    ethereum: any;
  }
}
export default function getContract() {
  const provider = new ethers.providers.Web3Provider(window.ethereum as any);
  const signer = provider.getSigner();
  let contract = new ethers.Contract(CONTRACT_ADDRESS, ContractAbi.abi, signer);
  console.log(contract);
  return contract;
}
