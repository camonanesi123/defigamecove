import React, { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import { useEthers } from '@usedapp/core';
import { toast } from 'react-toastify';
import { utils } from 'ethers';
import './ManagePage.scss';
import { useDeposit, useGetBalance, useWithdraw } from 'hooks';
import 'react-toastify/dist/ReactToastify.css';
import AppLayout from '../AppLayout';

const ManagePage = () => {
  const balance = useGetBalance();
  const { account, deactivate, chainId } = useEthers();
  const { state: depositState, send: deposit } = useDeposit();
  const { state: withdrawState, send: withdraw } = useWithdraw();
  const [loading, setLoading] = useState(false);
  const [depositValue, setDepositValue] = useState(0);
  const [withdrawValue, setWithdrawValue] = useState(0);

  useEffect(() => {
    if (depositState.status === 'Exception') {
      setLoading(false);
      toast.error(depositState.errorMessage);
    }

    if (depositState.status === 'Fail') {
      setLoading(false);
      toast.error(depositState.errorMessage);
    }

    depositState.status === 'Mining' && toast.info('Please wait 10-20sec');
    if (depositState.status === 'Success') {
      setLoading(false);
      toast.info('Success!');
    }
  }, [depositState]);
  useEffect(() => {
    if (withdrawState.status === 'Exception') {
      setLoading(false);
      toast.error(withdrawState.errorMessage);
    }

    if (withdrawState.status === 'Fail') {
      setLoading(false);
      toast.error(withdrawState.errorMessage);
    }

    withdrawState.status === 'Mining' && toast.info('Please wait 10-20sec');
    if (withdrawState.status === 'Success') {
      setLoading(false);
      toast.info('Success!');
    }
  }, [withdrawState]);
  const handleDeposit = () => {
    setLoading(true);

    if (!account) {
      toast.error('Please connect on Cronos network.');
      setLoading(false);
      return;
    }

    if (chainId) {
      if (chainId !== 25) {
        toast.error('Please connect on Cronos network.');
        deactivate();
        setLoading(false);
        return;
      }
    }

    deposit({
      value: utils.parseEther(depositValue.toString()),
    });
  };
  const handleWithdraw = () => {
    setLoading(true);

    if (!account) {
      toast.error('Please connect on Cronos network.');
      setLoading(false);
      return;
    }

    if (chainId) {
      if (chainId !== 25) {
        toast.error('Please connect on Cronos network.');
        deactivate();
        setLoading(false);
        return;
      }
    }

    withdraw(utils.parseEther(withdrawValue.toString()), {});
  };
  return (
    <>
      <AppLayout showItems='true'>
        <div className='manageboard'>
          <div className='banner text-[50px] font-extrabold text-white py-12 text-center'>
            Manage Page
          </div>
          <div className='lg:w-[50rem] w-5/6 h-[20rem] rounded-xl mx-auto p-16 bg-[#000000b0] text-black text-lg text-center'>
            <div className='manage-item'>
              <div
                className='text-white font-bold text-xl manage-button py-2'
                // onClick={useGetBalance()}
              >
                Balance :
              </div>
              <div className='manage-input bg-white align-middle py-2'>
                {balance ? (parseInt(balance._hex) / 10 ** 18).toFixed(2) : ''}
              </div>
              <div className='text-white'>CRO</div>
            </div>
            <div className='manage-item'>
              <button className='connect manage-button' onClick={handleDeposit}>
                Deposit
              </button>
              <input
                type='number'
                step={50}
                min={0}
                className='manage-input'
                value={depositValue}
                onChange={(e) => setDepositValue(e.target.value)}
              ></input>
              <div className='text-white'>CRO</div>
            </div>
            <div className='manage-item'>
              <button
                className='connect manage-button'
                onClick={handleWithdraw}
              >
                Withdraw
              </button>
              <input
                type='number'
                step={50}
                min={0}
                className='manage-input'
                value={withdrawValue}
                onChange={(e) => setWithdrawValue(e.target.value)}
              ></input>
              <div className='text-white'>CRO</div>
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

export default ManagePage;
