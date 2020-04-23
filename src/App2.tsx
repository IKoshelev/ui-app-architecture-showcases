import React from 'react';
import { observer } from 'mobx-react';
import { CarPurchase2 } from './screens/car-purchase/components/CarPurchase2';
import { useApp } from './useApp';

import './App.css';

export const App2 = observer(() => {

  const {
      deals,
      activeDealId,
      handleAddNewDealClick,
      handleSelectDealClick,
      handleCloseDealClick
  } = useApp();
  
  return ( 

  <div id='app-root'>
    <div className='car-purchase-main-logo'>
      Welcome to Crazy Ivan Motors
    </div>

    <div className='tabs'>
      <button
        className='button-add-new-deal'
        onClick={handleAddNewDealClick}
      >
        Add deal
      </button>
      {
        deals.map(deal => (
          <div
            className={`deal-tab-header ${deal.id === activeDealId ? 'active' : ''}`}
            key={deal.id}
            onClick={() => handleSelectDealClick(deal.id)}
          >
            {deal.id}
          </div>
        ))
      }
    </div>

    {
      activeDealId &&
      <>
        <CarPurchase2 />
        <button
          className='button-close-active-deal'
          onClick={handleCloseDealClick}
        >
          Close this deal
      </button>
      </>
    }

  </div>
)})