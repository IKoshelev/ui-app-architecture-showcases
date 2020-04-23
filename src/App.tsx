import React from 'react';
import { observer, Observer } from 'mobx-react';

import { CarPurchase } from './screens/car-purchase/components/CarPurchase';
import { appVm } from './App.VM';

import './App.css';

export const App = observer(() => {
  return <div id='app-root'>

    <div className='main-logo'>
      Welcome to Crazy Ivan Motors
    </div>

    <div className='screens'>
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
            >
              <Observer>
                {() => {
                  console.log(`rendering header for ${x.id}`);
                  return (<>
                    <div
                      className='header-text'
                      onClick={() => appVm.setActiveDeal(x)}
                    >
                      {x.tabHeader}
                    </div>
                  </>);
                }}
              </Observer>
              <button
                className='close-button'
                onClick={x.close}
              >
                X
                </button>
            </div>
          ))
        }
      </div>

      <div className={`active-tab`}>
        {
          appVm.activeCapPurchaseVM &&
          <CarPurchase vm={appVm.activeCapPurchaseVM} />
        }
      </div>

    </div>
  </div>

});