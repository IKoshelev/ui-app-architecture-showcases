import React from 'react';
import { observer } from 'mobx-react';
import { CarPurchase2 } from './screens/car-purchase/components/CarPurchase2';
import { useApp } from './useApp';

import './App.css';

export const App2 = observer(() => {

  const hook = useApp();
  
  return ( 

  <div id='app-root'>
    <div className='car-purchase-main-logo'>
      Welcome to Crazy Ivan Motors
    </div>

    <div className='tabs'>
      <button
        className='button-add-new-deal'
        onClick={hook.handleAddNewDealClick}
      >
        Add deal
      </button>
      {
        hook.deals.map(deal => (
          <div
            className={`deal-tab-header ${deal.id === hook.activeDealId ? 'active' : ''}`}
            key={deal.id}
            onClick={() => hook.handleSelectDealClick(deal.id)}
          >
            {deal.id}
          </div>
        ))
      }
    </div>

    {
      hook.activeDealId && <CarPurchase2 />
    }

  </div>
)})