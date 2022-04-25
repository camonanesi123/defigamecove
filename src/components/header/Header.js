import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useEthers, shortenAddress } from '@usedapp/core';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3Modal from 'web3modal';
import { CSSTransition } from 'react-transition-group';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Header.scss';

const Header = (props) => {
  const [isNavVisible, setNavVisibility] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const { account, activate, deactivate } = useEthers();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 850px)');
    mediaQuery.addListener(handleMediaQueryChange);
    handleMediaQueryChange(mediaQuery);

    return () => {
      mediaQuery.removeListener(handleMediaQueryChange);
    };
  }, []);

  const handleMediaQueryChange = (mediaQuery) => {
    if (mediaQuery.matches) {
      setIsSmallScreen(true);
    } else {
      setIsSmallScreen(false);
    }
  };

  const toggleNav = () => {
    setNavVisibility(!isNavVisible);
  };

  const handleConnect = async () => {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          chainId: 25,
          rpc: {
            25: 'https://evm-cronos.crypto.org',
          },
          network: 'cronos',
        },
      },

      injected: {
        display: {
          logo: 'https://github.com/MetaMask/brand-resources/raw/master/SVG/metamask-fox.svg',
          name: 'MetaMask',
          description: 'Connect with MetaMask in your browser',
        },
        package: null,
      },
    };

    if (!account) {
      const web3Modal = new Web3Modal({
        cacheProvider: false, // optional
        providerOptions,
        theme: {
          background: 'rgb(39, 49, 56)',
          main: 'rgb(199, 199, 199)',
          secondary: 'rgb(136, 136, 136)',
          border: 'rgba(195, 195, 195, 0.14)',
          hover: 'rgb(16, 26, 32)',
        },
      });
      const provider = await web3Modal.connect();
      await activate(provider);
    }
  };

  return (
    <>
      <header className='header relative bg-black border-b-2 border-[#ff66c4] h-32'>
        <img
          src='assets/DEFI_Games_LOGO.png'
          className='logo h-28 pt-4 absolute right-1/2 translate-x-1/3'
          alt='logo'
        />
        <CSSTransition
          in={!isSmallScreen || isNavVisible}
          timeout={350}
          classNames='NavAnimation'
          unmountOnExit
        >
          <nav className='nav'>
            {props.showItems === 'true' ? (
              <>
                <Link to='/card-flip'>CARD FLIP</Link>
                <Link to='/lottery'>LOTTERY</Link>
              </>
            ) : (
              <>
                <div></div>
                <div></div>
              </>
            )}

            <div></div>
            {!account ? (
              <button
                className='connect w-48 h-12  mr-5'
                onClick={handleConnect}
              >
                <p>CONNECT</p>
                <p>WALLET</p>
              </button>
            ) : (
              <button
                className='connect w-48 h-12  mr-5'
                onClick={() => deactivate()}
              >
                {shortenAddress(account)}
              </button>
            )}
          </nav>
        </CSSTransition>
        <button onClick={toggleNav} className='burger h-fit my-auto mx-10'>
          {!isNavVisible ? (
            <FaBars className='text-white' />
          ) : (
            <FaTimes className='text-white' />
          )}
        </button>
      </header>
    </>
  );
};

export default Header;
