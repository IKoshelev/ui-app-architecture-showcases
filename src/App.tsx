import React from 'react';
import { CarPurchase } from './screens/car-purchase/components/CarPurchase';
import { DealProvider } from './contexts/Deal/Deal.Context';
import { useApp } from './useApp';
import './App.css';
import { CarModelsProvider } from './contexts/CarModels/CarModels.Context';
import {InsurancePlansProvider } from './contexts/InsurancePlans/InsurancePlans.Context';


export const App = () => {

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
        hook.dealIds.map(id => (
            <div
              key={id}
              className={`deal-tab-header ${id === hook.activeDealId ? 'active' : ''}`}
              onClick={() => hook.handleSelectDealClick(id)}
            >
              Deal {id}
            </div>
        ))
      }
    </div>

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
)};