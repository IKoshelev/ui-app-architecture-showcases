
import React from "react";
import { getCachedSelectorDealForeignCurrencyDerrivations, isDealForeignCurrency } from "./DealForeignCurrency.pure";
import './DealForeignCurrency.component.css';
import { DealCmpBare } from "../Deal/Deal.component";
import { SelectDropdown } from "../../../generic-components/SelectDropdown.component";
import { useDispatch, useSelector } from "react-redux";
import type { Dispatch, RootState } from "../../store";

export const CarPurchaseWithForeignCurrencyCmp = (props: { dealId: number }) => {

    const dealState = useSelector((state: RootState) => getCachedSelectorDealForeignCurrencyDerrivations(props.dealId)(state));

    const dispatch = useDispatch<Dispatch>();

    return <div className='car-purchase-deal car-purchase-deal-with-foreign-currency'>
        <DealCmpBare dealId={props.dealId} />

        <div className='car-purchase-downpayment-currency-label'>
            Please select currency
    </div>

        <SelectDropdown
            selectAttributes={{ className: 'car-purchase-downpayment-currency' }}
            hasEmptyOption={false}
            availableItems={dealState.deal.currenciesAvailable}
            modelState={dealState.deal.businessParams.downpaymentCurrency}
            disabled={dealState.isLoadingAny || dealState.deal.businessParams.isDealFinalized}
            onSelect={(currency) => dispatch.deals.setCurrncyAndReloadExchangeRate([props.dealId, currency])}
        />

    </div>;
};

