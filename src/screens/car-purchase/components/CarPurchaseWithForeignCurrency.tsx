import { CarPurchaseWithForeignCurrencyVM } from "./CarPurchaseWithForeignCurrency.VM";
import { observer } from "mobx-react";
import React from "react";
import { CarPurchaseBare } from "./CarPurchase";
import { CurrencySelector } from "../../../generic-components/currency-selector/CurrencySelector";
import './CarPurchase.css';
import './CarPurchaseWithForeignCurrency.css';

export const CarPurchaseWithForeignCurrency: React.FunctionComponent<{
    vm: CarPurchaseWithForeignCurrencyVM
}> = observer(({ vm }) => (
    <div className='car-purchase-deal car-purchase-deal-with-foreign-currency'>
        <CarPurchaseBare vm={vm} />

        <div className='car-purchase-downpayment-currency-label'>
            Please select currency
    </div>
        <CurrencySelector
            selectAttributes={{ className: 'car-purchase-downpayment-currency' }}
            vm={vm.currencySelector}
        />

    </div>));