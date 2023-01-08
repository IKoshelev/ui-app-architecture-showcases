import { Component, createMemo, For } from 'solid-js';
import './App.component.scss';
import { ClockStoreRoot, start } from './stores/clock.store';
import { SubStore } from './util/subStore';
import { diffSeconds } from './util/diffSeconds';
import { approvalsStore, clockStore, dealsStore } from './App.stores';
import { DealsStoreRoot, loadNewDeal, loadNewDealForeignCurrency, removeDeal, getDealSubstoreById, isDealForeignCurrencyStore, getActiveDealSubstore } from './stores/deals.store';
import { Deal, getDealProgressState, getHeaderAdditionalDescription } from './stores/deals/Deal/Deal.pure';
import { ApprovalsStoreRoot, getLatestMatchingApproval } from './stores/approval.store';
import { DealWithForeignCurrencyComponent } from './stores/deals/DealForeignCurrency/DealForeignCurrency.component';
import { DealComponent } from './stores/deals/Deal/Deal.component';
import { getDealForeignCurrencyVM } from './stores/deals/DealForeignCurrency/DealForeignCurrency.vm';
import { getDealVM } from './stores/deals/Deal/Deal.vm';
import { unwrap } from 'solid-js/store';

(window as any).getDealsStore = () => console.log(
  unwrap(dealsStore[0]())
);

start(clockStore);

const App: Component = () => {

  const [getDeals, setDeals] = dealsStore;

  return <div id='app-root'>

    <div class='main-logo'>
      Hetman Motors (SolidJS)
    </div>

    <div class='screens'>
      <div class='tabs'>
        <button
          class='button-add-new-deal'
          disabled={getDeals().newDealIsLoading}
          onClick={() => loadNewDeal(dealsStore)}
        >
          Add deal
        </button>

        <button
          class="button-add-new-deal"
          disabled={getDeals().newDealIsLoading}
          onClick={() => loadNewDealForeignCurrency(dealsStore)}
        >
          Add foreign currency deal
        </button>

        <For each={getDeals().deals.filter(x => !x.isClosed)}>{(deal) => (<TabHeader
          dealStore={getDealSubstoreById(dealsStore, deal.businessParams.dealId)}
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

    const [getDeal, setDeal] = dealStore;

    if (typeof getDeal()?.businessParams.dealId === 'undefined') {
      return <></>;
    }

    if (isDealForeignCurrencyStore(dealStore)) {
      const vm = getDealForeignCurrencyVM(
        dealStore,
        dealsStore,
        approvalsStore,
        clockStore
      );
      return <DealWithForeignCurrencyComponent vm={vm} />;
    }

    const vm = getDealVM(
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

  const [getDeal, setDeal] = props.dealStore;
  const [getDeals, setDeals] = props.dealsStore;
  const [getApprovals, setApprovals] = props.approvalsStore;
  const [getClock, setClock] = props.clockStore;

  const headerText = createMemo(() => {
    const deatState = getDeal();
    const progressState = getDealProgressState(
      getDeal(),
      getLatestMatchingApproval(getApprovals(), getDeal()),
      getClock().currentDate,
    )

    if (!deatState.businessParams.carModelSelected) {
      return `blank deal`
    }

    let text: string = '';
    if (progressState === 'deal-finalized') {
      text = 'done';
    } else if (progressState === 'approval-perpetual') {
      text = 'approved'
    } else if (typeof progressState !== 'string') {
      text = `${diffSeconds(progressState.approvalExpiresAt, getClock().currentDate)} sec`;
    }

    return `${deatState.businessParams.carModelSelected.committedValue?.description ?? "No model selected"} ` +
      `${getHeaderAdditionalDescription(getDeal())}${text}`;
  });

  return <div
    classList={{
      'deal-tab-header': true,
      'active': getDeal().businessParams.dealId === getDeals().activeDealId
    }}
  >
    <div
      class='header-text'
      onClick={() => setDeals(x => x.activeDealId = getDeal().businessParams.dealId)}
    >
      {headerText}
    </div>

    <button
      class='close-button'
      onClick={() => setDeals((x) => removeDeal(x, getDeal().businessParams.dealId))}
    >
      X
    </button>
  </div>;
};

export default App;
