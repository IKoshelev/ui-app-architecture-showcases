import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Provider } from 'react-redux';
import { RootState, Dispatch, store } from './store'

import './App.css';
import classNames from 'classnames';
import { Deal, getDealProgresssState } from './models/deals/deal';
import { DealCmp } from './models/deals/Deal.component';
import { approvals, ApprovalsState, getLatestMatchingApproval } from './models/approval.store';

const AppRoot = () => {

  const dealsState = useSelector((state: RootState) => state.deals);
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

        {/* <button
          className="button-add-new-deal"
          onClick={appVm.addForeignCurrencyDeal}
        >
          Add foreign currency deal
        </button> */}

        { dealsState.deals.filter(x => !x.isClosed).map(x => (<TabHeader 
              key={x.businessParams.dealId} 
              dealId={x.businessParams.dealId}
            />))}
      </div>

      <div className={`active-tab`}>
        {
          renderDealTab(dealsState.activeDealId)
        }
      </div>
    </div>
  </div>;

  function renderDealTab(dealId: number | undefined) {

    if(typeof dealId === 'undefined') {
      return <></>;
    }

    return <DealCmp dealId={dealId} />;
  }

};


const TabHeader = (props: {dealId: number}) => {

  const dispatch = useDispatch<Dispatch>();

  const clockState = useSelector((state: RootState) => state.clock);
  const dealsState = useSelector((state: RootState) => state.deals);
  const approvalState = useSelector((state: RootState) => state.approvals);

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
      {getTabHeaderText(
          dealsState.deals.find(x => x.businessParams.dealId === props.dealId)!,
          approvalState,
          clockState.currentDate)}
    </div>

    <button
      className='close-button'
      onClick={() => dispatch.deals.removeDeal(props.dealId)}
    >
      X
    </button>
  </div>;

  function getTabHeaderText(deal: Deal, approvalsState: ApprovalsState, currentDate: Date) {

    const apprval = getLatestMatchingApproval(approvalsState, deal);

    const dealState = getDealProgresssState(deal, apprval, currentDate);

    if (!deal.businessParams.carModelSelected) {
      return `blank deal`
    }

    let state: string = '';
    if (dealState === 'deal-finalized') {
      state = 'done';
    } else if (dealState === 'approval-perpetual') {
      state = 'approved'
    } else if (typeof dealState !== 'string') {
      state = `${dealState.approvalExpiresInSeconds} sec`;
    }

    return `${deal.businessParams.carModelSelected.description}  ${state}`; //${this.headerAdditionalDescription()}
  }
}

export const App = () => (
  <Provider store={store}>
    <AppRoot />
  </Provider>
);