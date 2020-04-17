import React from 'react';
import { observer } from 'mobx-react';

import { CarPurchase } from './car-purchase/vm/CarPurchase';
import { appVm } from './App.VM';

const App = observer(() => {
  return <div id='app-root'>
    <CarPurchase vm={appVm.capPurchaseVM}></CarPurchase>
  </div>

});

export default App;