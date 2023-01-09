import { Component, createMemo, For } from 'solid-js';
import './App.component.scss';
import { ClockStoreRoot, start } from './stores/clock.store';
import { SubStore } from './util/subStore';
import { diffSeconds } from './util/diffSeconds';
import { approvalsStore, clockStore, dealsStore } from './App.stores';
import { DealsStoreRoot, loadNewDeal, loadNewDealForeignCurrency, removeDeal, dealSubstoreById, isDealForeignCurrencyStore, getActiveDealSubstore } from './stores/deals.store';
import { Deal, getDealProgressState, getHeaderAdditionalDescription } from './stores/deals/Deal/Deal.pure';
import { ApprovalsStoreRoot, getLatestMatchingApproval } from './stores/approval.store';
import { DealWithForeignCurrencyComponent } from './stores/deals/DealForeignCurrency/DealForeignCurrency.component';
import { DealComponent } from './stores/deals/Deal/Deal.component';
import { dealForeignCurrencyVM } from './stores/deals/DealForeignCurrency/DealForeignCurrency.vm';
import { dealVM } from './stores/deals/Deal/Deal.vm';
import { unwrap } from 'solid-js/store';
import { cloneWithoutSymbols } from './util/walkers';

(window as any).dealsStore = () => console.log(
  unwrap(dealsStore[0])
);

(window as any).getApprovalsStore = () => console.log(
  unwrap(approvalsStore[0])
);

start(clockStore);

let savedStores: any = {};

const App: Component = () => {

  const [deals, setDeals] = dealsStore;

  return <div id='app-root'>

    <div class='main-logo'>
      Hetman Motors (SolidJS)
      <button
        onClick={() => {
          savedStores.deals = cloneWithoutSymbols(unwrap(dealsStore[0])),
          savedStores.approvals = cloneWithoutSymbols(unwrap(approvalsStore[0]))
        }}
      >Save stores</button>
      <button
        onClick={() => {
          dealsStore[1](x => Object.assign(x, cloneWithoutSymbols(savedStores.deals)));
          approvalsStore[1](x => Object.assign(x, cloneWithoutSymbols(savedStores.approvals)));
        }}
      >Load stores</button>
    </div>

    <div class='screens'>
      <div class='tabs'>
        <button
          class='button-add-new-deal'
          disabled={deals.newDealIsLoading}
          onClick={() => loadNewDeal(dealsStore)}
        >
          Add deal
        </button>

        <button
          class="button-add-new-deal"
          disabled={deals.newDealIsLoading}
          onClick={() => loadNewDealForeignCurrency(dealsStore)}
        >
          Add foreign currency deal
        </button>

        <For each={deals.deals.filter(x => !x.isClosed)}>{(deal) => (<TabHeader
          dealStore={dealSubstoreById(dealsStore, deal.businessParams.dealId)}
          dealsStore={dealsStore}
          approvalsStore={approvalsStore}
          clockStore={clockStore} 
        />)}
        </For>
      </div>

      <div class="active-tab">
        {
          renderDealTab(
            getActiveDealSubstore(dealsStore),
            dealsStore,
            approvalsStore,
            clockStore
          )
        }
      </div>
    </div>
  </div>;

  function renderDealTab(
    dealStore: SubStore<Deal>,
    dealsStore: SubStore<DealsStoreRoot>,
    approvalsStore: SubStore<ApprovalsStoreRoot>,
    clockStore: SubStore<ClockStoreRoot>) {

    const [deal, setDeal] = dealStore;

    if (typeof deal?.businessParams.dealId === 'undefined') {
      return <></>;
    }

    if (isDealForeignCurrencyStore(dealStore)) {
      const vm = dealForeignCurrencyVM(
        dealStore,
        dealsStore,
        approvalsStore,
        clockStore
      );
      return <DealWithForeignCurrencyComponent vm={vm} />;
    }

    const vm = dealVM(
      dealStore,
      dealsStore,
      approvalsStore,
      clockStore
    );

    //default - most basic deal
    return <DealComponent vm={vm} />;
  }

};

const TabHeader = (props: {
  dealStore: SubStore<Deal>,
  dealsStore: SubStore<DealsStoreRoot>,
  approvalsStore: SubStore<ApprovalsStoreRoot>,
  clockStore: SubStore<ClockStoreRoot> 
}) => {

  const [deal, setDeal] = props.dealStore;
  const [deals, setDeals] = props.dealsStore;
  const [approvals, setApprovals] = props.approvalsStore;
  const [clock, setClock] = props.clockStore;

  const headerText = createMemo(() => {
    const dealState = deal;
    const progressState = getDealProgressState(
      deal,
      getLatestMatchingApproval(approvals, deal),
      clock.currentDate,
    )

    if (!dealState.businessParams.carModelSelected) {
      return `blank deal`
    }

    let text: string = '';
    if (progressState === 'deal-finalized') {
      text = 'done';
    } else if (progressState === 'approval-perpetual') {
      text = 'approved'
    } else if (typeof progressState !== 'string') {
      text = `${diffSeconds(progressState.approvalExpiresAt, clock.currentDate)} sec`;
    }

    return `${dealState.businessParams.carModelSelected.committedValue?.description ?? "No model selected"} ` +
      `${getHeaderAdditionalDescription(deal)}${text}`;
  });

  return <div
    classList={{
      'deal-tab-header': true,
      'active': deal.businessParams.dealId === deals.activeDealId
    }}
  >
    <div
      class='header-text'
      onClick={() => setDeals(x => x.activeDealId = deal.businessParams.dealId)}
    >
      {headerText}
    </div>

    <button
      class='close-button'
      onClick={() => setDeals((x) => removeDeal(x, deal.businessParams.dealId))}
    >
      X
    </button>
  </div>;
};

export default App;
