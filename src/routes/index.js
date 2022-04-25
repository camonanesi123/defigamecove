import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Cronos, DAppProvider } from '@usedapp/core';
import DashBoardPage from '../pages/dashboard';
import CardPage from '../pages/card';
import LotteryPage from '../pages/lottery';
import ManagePage from '../pages/manage';
const ErrorPage = lazy(() => import('../pages/error'));

const config = {
  readOnlyChainId: Cronos.chainId,
  readOnlyUrls: {
    [Cronos.chainId]: `https://evm-t3.cronos.org`,
  },
};

const AppRoutes = () => {
  return (
    <DAppProvider config={config}>
      <Routes>
        <Route path='/' element={<DashBoardPage />} />
        <Route path='/card-flip' element={<CardPage />} />
        <Route path='/lottery' element={<LotteryPage />} />
        <Route path='/manage' element={<ManagePage />} />
        <Route component={ErrorPage} />
      </Routes>
      <ToastContainer
        position='top-center'
        autoClose={8000}
        autoDismiss={true}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        icon={true}
        theme={'colored'}
        pauseOnHover={false}
        rtl={false}
      />
    </DAppProvider>
  );
};

export default AppRoutes;
