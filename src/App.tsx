import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Provider } from 'react-redux';
import { RootState, Dispatch, store } from './models/store'

import './App.css';
import classNames from 'classnames';
import { DealTag, getCachedSelectorDealDerrivations } from './models/deals/Deal/Deal';
import { DealCmp } from './models/deals/Deal/Deal.component';
import { diffSeconds } from './util/diffSeconds';
import { CarPurchaseWithForeignCurrencyCmp } from './models/deals/DealForeignCurrency/DealForeignCurrency.component';
import { DealForeignCurrency } from './models/deals/DealForeignCurrency/DealForeignCurrency';

const AppRoot = () => {

  const dealsState = useSelector((state: RootState) => state.deals);
  const activeDealType = useSelector((state: RootState) => state.deals.deals.find(x => x.businessParams.dealId === state.deals.activeDealId)?.type);
  const dispatch = useDispatch<Dispatch>();

  return <div id='app-root'>

    <div className='main-logo'>
      Crazy Ivan Motors (Rematch 2)
    </div>

    <div className='screens'>
      <div className='tabs'>
        <button
          className='button-add-new-deal'
          disabled={dealsState.newDealIsLoading}
          onClick={dispatch.deals.loadNewDeal}
        >
          Add deal
        </button>

        <button
          className="button-add-new-deal"
          onClick={dispatch.deals.loadNewDealForeignCurrency}
        >
          Add foreign currency deal
        </button>

        { dealsState.deals.filter(x => !x.isClosed).map(x => (<TabHeader 
              key={x.businessParams.dealId} 
              dealId={x.businessParams.dealId}
            />))}
      </div>

      <div className={`active-tab`}>
        {
          renderDealTab(dealsState.activeDealId, activeDealType)
        }
      </div>
    </div>
  </div>;

  function renderDealTab(dealId: number | undefined, dealType: typeof DealTag | undefined) {

    if(typeof dealId === 'undefined') {
      return <></>;
    }

    // todo investigate why typescript 
    if((dealType as string) === DealForeignCurrency) {
      return <CarPurchaseWithForeignCurrencyCmp dealId={dealId} />;
    }

    //default - most basic deal
    return <DealCmp dealId={dealId} />;
  }

};

const TabHeader = (props: {dealId: number}) => {

  const headerText = useSelector((state: RootState) => {
      const deatState = getCachedSelectorDealDerrivations(props.dealId)(state);

      if (!deatState.deal.businessParams.carModelSelected) {
        return `blank deal`
      }
  
      let text: string = '';
      if (deatState.dealProgressState === 'deal-finalized') {
        text = 'done';
      } else if (deatState.dealProgressState === 'approval-perpetual') {
        text = 'approved'
      } else if (typeof deatState.dealProgressState !== 'string') {
        text = `${diffSeconds(deatState.dealProgressState.approvalExpiresAt, state.clock.currentDate)} sec`;
      }
  
      return `${deatState.deal.businessParams.carModelSelected.description}  ${text}`; //${this.headerAdditionalDescription()}
  });

  const dispatch = useDispatch<Dispatch>();

  return <div
    className={classNames({
      'deal-tab-header': true,
      'active': props.dealId === useSelector((state: RootState) => state.deals.activeDealId)
    })}
    key={props.dealId}
  >
    <div
      className='header-text'
      onClick={() => dispatch.deals.set({ activeDealId: props.dealId})}
    >
      {headerText}
    </div>

    <button
      className='close-button'
      onClick={() => dispatch.deals.removeDeal(props.dealId)}
    >
      X
    </button>
  </div>;
}

export const App = () => (
  <Provider store={store}>
    <AppRoot />
  </Provider>
);