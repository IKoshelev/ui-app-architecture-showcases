import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Provider } from 'react-redux';
import { RootState, Dispatch, store } from './store'

import './App.css';

const DealsCmp = () => {

  const dealsState = useSelector((state: RootState) => state.deals); 

  const dispatch = useDispatch<Dispatch>();

  return <div>
      {dealsState.deals.map(deal => <div key={deal.dealId}>
        {JSON.stringify(deal)}
      </div>)}
      <button
        onClick={() => dispatch.deals.loadNewDeal()}
        disabled={dealsState.newDealIsLoading}
      >
        Add new deal
      </button>
      {/* <div>{isLoading.toString()}</div> */}
    </div>;
}

const AppRoot = () => {

  return <div id='app-root'>

    <div className='main-logo'>
      Crazy Ivan Motors (Rematch 2)
    </div>

    <div className='screens'>
      <DealsCmp/>
    </div>
  </div>

};

export const App = () => (
	<Provider store={store}>
		<AppRoot />
	</Provider>
);