import React from 'react';
import { observer } from 'mobx-react';

import { CarPurchase } from './screens/car-purchase/components/CarPurchase';
import { appVm } from './App.VM';

import './App.css';

const App = observer(() => {
  return <div id='app-root'>

    <div className='car-purchase-main-logo'>
      Welcome to Crazy Ivan Motors
    </div>

    <div className='tabs'>
      <button
        className='button-add-new-deal'
        onClick={appVm.addNewDeal}
      >
        Add deal
      </button>
      {
        appVm.capPurchaseVMs.map(x => (
          <div
            className={`deal-tab-header ${x === appVm.activeCapPurchaseVM ? 'active' : ''}`}
            key={x.id}
            onClick={() => appVm.setActiveDeal(x)}
          >
            {x.id}
          </div>
        ))
      }
    </div>

    {
      appVm.activeCapPurchaseVM &&
      <>
        <CarPurchase vm={appVm.activeCapPurchaseVM}></CarPurchase>
        <button
          className='button-close-active-deal'
          onClick={appVm.closeActiveDeal}
        >
          Close this deal
      </button>
      </>
    }



  </div>

});

export default App;