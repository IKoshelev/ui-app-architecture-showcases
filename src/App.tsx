import React from 'react';
import { observer } from 'mobx-react';

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
              onClick={() => appVm.setActiveDeal(x)}
            >
              {x.id}
            </div>
          ))
        }
      </div>

      <div
        className={`active-tab ${appVm.activeCapPurchaseVM?.cssClassName}`}
      >
        {
          appVm.activeCapPurchaseVM &&
          <>
            <CarPurchase
              vm={appVm.activeCapPurchaseVM}
              additionalElems={() => (
                /* This is just to show how to split React node definition
                  from its rendering, usually to place it deeper into the DOM tree;
                  This approach is to be used very sparringly, it is spaghettish;
                  Cleaner approach is - VM receives a callback function to request
                  its own closing or emits an appropriate event, defines and renders
                  a button to trigger it;
               */
                <button
                  className='button-close-active-deal'
                  onClick={appVm.closeActiveDeal}
                >
                  Close this deal
                </button>
              )}
            />

          </>
        }
      </div>

    </div>
  </div>

});