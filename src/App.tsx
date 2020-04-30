import React from 'react';
import { CarPurchase } from './screens/car-purchase/components/CarPurchase';
import { DealProvider } from './contexts/Deal/Deal.Context';
import { useApp } from './useApp';
import './App.css';
import { CarModelsProvider } from './contexts/CarModels/CarModels.Context';
import { InsurancePlansProvider } from './contexts/InsurancePlans/InsurancePlans.Context';


export const App = () => {

  const hook = useApp();

  return (

    <div id='app-root'>
      <div className='main-logo'>
        Crazy Ivan Motors (Hooks V3)
    </div>

      <div className='screens'>
        <div className='tabs'>
          <button
            className='button-add-new-deal'
            onClick={hook.handleAddNewDealClick}
          >
            Add deal
        </button>

          {
            hook.dealIds.map(id => (
              <div
                className={`deal-tab-header ${id === hook.activeDealId ? 'active' : ''}`}
                key={id}
              >
                <div
                  className='header-text'
                  onClick={() => hook.handleSelectDealClick(id)}
                >
                  {id}
                </div>
                <button
                  className='close-button'
                  onClick={() => hook.handleCloseDealClick(id)}
                >
                  X
                </button>
              </div>
            ))
          }
        </div>

        <div className={`active-tab`}>
          {
            hook.dealIds.map(id => (
              <DealProvider
                key={id}
                initialDealId={id}
                handleCloseDealClick={hook.handleCloseDealClick}
              >
                <CarModelsProvider>
                  <InsurancePlansProvider>
                    {hook.activeDealId === id && <CarPurchase />}
                  </InsurancePlansProvider>
                </CarModelsProvider>
              </DealProvider>
            ))}
        </div>
      </div>
    </div>
  )
};