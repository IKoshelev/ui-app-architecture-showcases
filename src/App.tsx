import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Provider } from 'react-redux';
import { RootState, Dispatch, store } from './store'

import './App.css';

function getSecondsDvividedBy3(date: Date){
  return Math.round(date.getSeconds() / 3);
}

const ClockCmp = () => {
  //with this selector, even though model updates every second, component only redraws every 3 serconds
  const currentDate = useSelector((state: RootState) => getSecondsDvividedBy3(state.clock.currentDate)); 

  return <div>
      {currentDate.toString()}
    </div>;
}

const AppRoot = () => {

  const dispatch = useDispatch<Dispatch>();

  return <div id='app-root'>

    <div className='main-logo'>
      Welcome to Crazy Ivan Motors
    </div>

    <div className='screens'>
      <ClockCmp/>
      <button
        onClick={() => dispatch.clock.start()}
      >
        start
      </button>
      <button
        onClick={() => dispatch.clock.stop()}
      >
        stop
      </button>    
    </div>
  </div>

};

export const App = () => (
	<Provider store={store}>
		<AppRoot />
	</Provider>
);