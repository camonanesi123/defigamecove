import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const connectWallet = async (account, activate, deactivate) => {
  const providerOptions = {
    injected: {
      display: {
        name: 'Metamask',
        description: 'Connect with the provider in your Browser',
      },
      package: null,
    },
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        bridge: 'https://bridge.walletconnect.org',
        infuraId: process.env.REACT_APP_INFURA_ID,
      },
    },
  };

  if (!account) {
    const web3Modal = new Web3Modal({
      providerOptions,
    });
    const provider = await web3Modal.connect();
    provider.chainId !== 25
      ? await activate(provider)
      : toast.error('Please connect on Cronos network.');
  }
};

export default connectWallet;
