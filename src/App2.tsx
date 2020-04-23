import React from 'react';
import { observer } from 'mobx-react';
import { dealsStore } from './stores/Deals.Store';
import { CarPurchase2 } from './screens/car-purchase/components/CarPurchase2';

import './App.css';

export const App2 = observer(() => { 
  console.log('dealsStore', dealsStore);
  console.log('dealsStore.deals', dealsStore.deals);
  return <div id='app-root'>

    <div className='car-purchase-main-logo'>
      Welcome to Crazy Ivan Motors
    </div>

    <div className='tabs'>
      <button
        className='button-add-new-deal'
        onClick={dealsStore.addNewDeal}
      >
        Add deal
      </button>
      {
        dealsStore.deals.map(deal => (
          <div
            className={`deal-tab-header ${deal.id === dealsStore.activeDealId ? 'active' : ''}`}
            key={deal.id}
            onClick={() => dealsStore.setActiveDealId(deal.id)}
          >
            {deal.id}
          </div>
        ))
      }
    </div>

    {
      dealsStore.activeDealId &&
      <>
        <CarPurchase2 />
        <button
          className='button-close-active-deal'
          onClick={dealsStore.closeActiveDeal}
        >
          Close this deal
      </button>
      </>
    }

  </div>
});