import { ethers } from "ethers";
import { Contract } from "@ethersproject/contracts";
import { useContractCall, useContractFunction } from "@usedapp/core";
import ContractABI from "../abi/ContractABI.json";
import { ContractAddress } from "../contracts";

const ContractInterface = new ethers.utils.Interface(ContractABI);
const contract = new Contract(ContractAddress, ContractInterface);

export const usePlay = () => {
  const { state, send, events } = useContractFunction(contract, "play", {});
  return { state, send, events };
};

export const useWithdraw = () => {
  const { state, send, events } = useContractFunction(contract, "withdraw", {});
  return { state, send, events };
};

export const useDeposit = () => {
  const { state, send, events } = useContractFunction(contract, "deposit", {});
  return { state, send, events };
};

export const useGetBalance = () => {
  const [balance] =
    useContractCall({
      abi: ContractInterface,
      address: ContractAddress,
      method: "getBalance",
      args: [],
    }) ?? [];

  return balance;
};
