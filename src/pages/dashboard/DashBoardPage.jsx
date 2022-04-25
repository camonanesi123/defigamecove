import React from 'react';
import { Link } from 'react-router-dom';
import AppLayout from 'pages/AppLayout';
import './DashBoardPage.scss';

export default function DashBoardPage() {
  return (
    <AppLayout showItems='false'>
      <div className='dashboard'>
        <div className='banner text-[50px] font-extrabold text-white py-12 text-center'>
          Defi Game Cove
        </div>
        <div className='game-panel flex justify-center gap-8 items-center flex-wrap pb-48 flex-column'>
          <Link to='/card-flip'>
            <div className='game-item'>
              <div className='game-title'>Card Flip</div>
              <img
                className='w-20 h-20 bg-white shrink-0'
                src='assets/card-flip.png'
                alt='card-flip'
              />
              <p>
                Red or Black, with odds of winning at 50:50. Payouts are up to
                1.98x
              </p>
              <div className='game-tag'>
                <img
                  className='w-10 h-10 bg-white'
                  src='assets/boars.png'
                  alt='boars'
                />
                <p>Boars Gone Wild</p>
              </div>
            </div>
          </Link>
          <Link to='/lottery'>
            <div className='game-item'>
              <div className='game-title'>Lottery</div>
              <div className='w-20 h-20 bg-white shrink-0'></div>

              <p>Buy tickets, match the numbers, and win CRO</p>
              <div className='game-tag'>
                <div className='w-10 h-10 bg-white'></div>
                <p>Cronos Goats</p>
              </div>
            </div>
          </Link>
          <div className='game-item'></div>
          <div className='game-item'></div>
        </div>
      </div>
    </AppLayout>
  );
}
