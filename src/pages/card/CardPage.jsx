import React, { useState, useEffect } from 'react';
import ReactLoading from 'react-loading';
import { useEthers, useEtherBalance } from '@usedapp/core';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3Modal from 'web3modal';
import { toast } from 'react-toastify';
import { utils } from 'ethers';
import { usePlay } from 'hooks';
import AppLayout from 'pages/AppLayout';
import { getHistory, addHistory } from 'utils/InfoManage';
import 'react-toastify/dist/ReactToastify.css';
import './CardPage.scss';

const CardPage = () => {
  const [card, setCard] = useState(0);
  const [betValue, setBetValue] = useState(10);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const { account, activate, deactivate, chainId } = useEthers();
  const etherBalance = useEtherBalance(account);
  const { state: playState, send: play } = usePlay();

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

  const selectCard = (e) => (e.target.id === 'red' ? setCard(0) : setCard(1));
  const selectBetValue = (e) => setBetValue(e.target.value);

  useEffect(() => {
    const interval = setInterval(() => {
      const a = async () => {
        var res = await getHistory();
        setHistory(res.data);
      };
      a();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (playState.status === 'Exception') {
      setLoading(false);
      console.log(playState);
      toast.error(playState.errorMessage);
    }

    if (playState.status === 'Fail') {
      setLoading(false);
      toast.error(playState.errorMessage);
    }

    playState.status === 'Mining' &&
      toast.info(
        'Placing bet, please wait 10-50 seconds while bet settles. If you close this page, your bet will still settle if it does not get rejected by the blockchain.'
      );
    if (playState.status === 'Success') {
      setLoading(false);
      let payout = parseInt(playState.receipt.events[0].data) / 10 ** 18;
      payout
        ? toast.info(
            `Successfully settled bet. Congratulations! You won ${payout}CRO!`
          )
        : toast.info(
            `Bet has settled, unfortunately you lost! Winning card is ${
              card ? 'red' : 'black'
            }. Better luck next time!`
          );
      let req = {
        player: account,
        txn: playState.receipt.transactionHash,
        amount: betValue,
        choice: card ? 'black' : 'red',
        result: payout ? (card ? 'black' : 'red') : card ? 'red' : 'black',
        payout: payout,
      };
      const a = async () => {
        var res = await addHistory(req);
        setHistory(res.data);
      };
      a();
    }
  }, [playState]);

  const handleBet = async () => {
    setLoading(true);
    if (chainId) {
      if (chainId !== 25) {
        toast.error('Please connect on Cronos network.');
        deactivate();
        setLoading(false);
        return;
      }
    }
    const ethPrice = betValue;
    play(card ? false : true, {
      value: utils.parseEther(ethPrice.toString()),
    });
  };

  const setMax = () => {
    let balance;
    if (etherBalance) balance = parseInt(etherBalance._hex / 10 ** 18);
    setBetValue(balance > 200 ? 200 : balance);
  };

  const shorten = (address) => address.slice(0, 6) + '...';

  const historyItems = history.map((item) => (
    <a
      href={`https://cronos.org/explorer/tx/${item.txn}`}
      target='_blank'
      className='history-grid'
      key={item.no}
      rel='noreferrer'
    >
      <div>{shorten(item.player)}</div>
      <div>{shorten(item.txn)}</div>
      <div>{item.amount}CRO</div>
      <div>{item.choice}</div>
      <div>{item.result}</div>
      <div>{item.payout}CRO</div>
    </a>
  ));

  const redRate = () => {
    let count = 0;
    let winCount = 0;
    for (let x in history) {
      count += 1;
      if (history[x].result === 'red') winCount += 1;
    }
    let result = ((winCount / count) * 100).toFixed(2);
    return result;
  };

  return (
    <>
      <AppLayout showItems='true'>
        <div className='card flex justify-center items-center gap-8 py-12 lg:flex-row flex-col px-5'>
          <div className='game-panel lg:w-[30rem] w-full h-[37rem] flex bg-[#000000b0] rounded-3xl justify-center items-center flex-col text-white px-8'>
            <div className='text-4xl font-bold pt-4'>Card Flip</div>
            <div className='text-sm'>Guess correctly & Double your money</div>
            <div className='text-2xl font-bold pt-8'>Select Red or Black</div>
            <div className='cards flex flex-row py-4 lg:gap-6 gap-12'>
              <img
                id='red'
                src='assets/Red_Card.png'
                alt='red card'
                className={`${
                  card ? '' : 'selected'
                } rounded-lg cursor-pointer`}
                onClick={selectCard}
              ></img>
              <img
                id='black'
                src='assets/Black_Card.png'
                alt='black card'
                className={`${
                  card ? 'selected' : ''
                } rounded-lg cursor-pointer`}
                onClick={selectCard}
              ></img>
            </div>
            <div className='flex flex-row justify-center items-center text-2xl text-black gap-2 py-2 text-center w-full'>
              <div className='w-3/12  bg-white rounded-md py-4 cursor-pointer duration-200 hover:bg-gray-400 hover:bg-opacity-60 hover:text-white'>
                CRO
              </div>
              <input
                type='number'
                placeholder='10'
                value={betValue}
                step='30'
                min='10'
                onChange={selectBetValue}
                className='w-6/12  bg-white rounded-md py-4 text-center hover:outline-none'
              />
              <div
                className='w-3/12  bg-white rounded-md py-4 cursor-pointer duration-200 hover:bg-gray-400 hover:bg-opacity-60 hover:text-white'
                onClick={setMax}
              >
                MAX
              </div>
            </div>
            <div className='w-full'>
              {account ? (
                <div className='flex flex-row jsutify-center items-center gap-3'>
                  Your balance:{' '}
                  {etherBalance ? (
                    `${(parseInt(etherBalance._hex) / 10 ** 18).toFixed(5)}CRO`
                  ) : (
                    <ReactLoading
                      type='spinningBubbles'
                      color='#fff'
                      height='1.5rem'
                      width='1.5rem'
                    />
                  )}
                </div>
              ) : (
                ''
              )}
            </div>
            <div className='flex flex-row justify-between text-2xl w-full font-semibold py-2'>
              <div>Your Odds</div>
              <div>1.98x</div>
            </div>
            <div className='flex flex-row justify-between text-xl w-full font-semibold py-2 lg:text-2xl'>
              <div>Winning Payout</div>
              <div>{(betValue * 1.98).toFixed(2)} CRO</div>
            </div>
            <button
              className='connect w-full text-xl py-2 font-thin rounded-xl mt-5'
              onClick={account ? handleBet : handleConnect}
            >
              {account ? 'Place Bet' : 'Connect your wallet'}
            </button>
          </div>
          <div className='game-info lg:w-[15rem] w-full flex flex-col justify-start gap-8'>
            <div className='game-info-item'>
              <div className='info-title'>
                {card ? 'Black' : 'Red'} Win Rate
              </div>
              <div className='info-per'>
                {!card
                  ? isNaN(redRate())
                    ? 0
                    : redRate()
                  : isNaN(redRate())
                  ? 0
                  : (100 - redRate()).toFixed(2)}
                %
              </div>
              <div className='info-text'>Win Rate Based on PastBets</div>
            </div>
          </div>
          <div className='history-panel lg:w-[30rem] w-full h-[37rem] bg-[#000000b0] rounded-3xl text-center text-white px-4'>
            <div className='text-4xl font-bold py-8'>Last 100 Games</div>
            <div className='border-2 border-[#aaaaaa] rounded-xl overflow-hidden'>
              <div className='history-grid pr-2'>
                <div>Player</div>
                <div>Txn</div>
                <div>Amount</div>
                <div>Choice</div>
                <div>Result</div>
                <div>Payout</div>
              </div>
              <div className='history overflow-y-auto  h-[25.5rem]'>
                {historyItems}
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
      {loading ? (
        <div className='loading-bg w-full h-full bg-opacity-50 bg-black absolute left-0 top-0 flex justify-center items-center'>
          <ReactLoading
            type='spinningBubbles'
            color='white'
            height='10rem'
            width='10rem'
          ></ReactLoading>
        </div>
      ) : (
        ''
      )}
    </>
  );
};

export default CardPage;
