import { InjectedConnector } from '@web3-react/injected-connector';
import { DeFiWeb3Connector } from 'deficonnect'; // npm install deficonnect
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

// const POLLING_INTERVAL = 12000;
// const RPC_URLS = {
//   1: 'https://mainnet.infura.io/v3/9d001c94ec7c434dab3b0cc4d0bf4dc0',
//   4: 'https://ropsten.infura.io/v3/f88abc181a4a45a6bc47bdda05a94944',
// };

const CRONOS_URLS = {
  25: 'https://evm.cronos.org/',
  338: 'https://evm-t3.cronos.org/',
};

export const injected = new InjectedConnector({
  supportedChainIds: [25, 338],
});

export const cronos = new DeFiWeb3Connector({
  supportedChainIds: [1, 25],
  rpc: {
    1: 'https://mainnet.infura.io/v3/9d001c94ec7c434dab3b0cc4d0bf4dc0',
    25: 'https://evm.cronos.org/', // cronos mainet
  },
  pollingInterval: 15000,
});

// export const cronos = new WalletConnectConnector({
//   rpc: {
//     25: 'https://evm.cronos.org/',
//   },
//   chainId: 25,
// });
