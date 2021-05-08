
import React from "react";
import { DealForeignCurrency } from "./DealForeignCurrency";
import './DealForeignCurrency.component.css';
import { DealCmpBare } from "../Deal/Deal.component";
import { SelectDropdown } from "../../../generic-components/SelectDropdown.component";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

export const CarPurchaseWithForeignCurrencyCmp = (props: { dealId: number }) => {

    //todo get with type validation
    const dealState = useSelector((state: RootState) => state.deals.deals.find(x => x.businessParams.dealId === props.dealId))! as DealForeignCurrency;

    return <div className='car-purchase-deal car-purchase-deal-with-foreign-currency'>
        <DealCmpBare dealId={props.dealId} />

        <div className='car-purchase-downpayment-currency-label'>
            Please select currency
    </div>

        <div className="car-purchase-downpayment-currency">Currency selector {dealState.currencyiesAvailable}</div>
        <SelectDropdown
            selectAttributes={{ className: 'car-purchase-downpayment-currency' }}
            hasEmptyOption={false}
            availableItems={dealState.currencyiesAvailable}
            modelState={dealState.businessParams.downpaymentCurrency}
            disabled={false} // {isLoading || dealState.businessParams.isDealFinalized}
            onSelect={(item) => /* dispatch.deals.setInBusinessParams(
                props.dealId,
                {
                    carModelSelected: item
                }) */(undefined)}
        />

    </div>;
};