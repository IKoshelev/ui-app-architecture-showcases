import './DealForeignCurrency.component.scss';
import { DealComponentBare } from "../Deal/Deal.component";
import { SelectDropdown } from "../../../generic-components/SelectDropdown.component";
import { DealForeignCurrencyVM } from "./DealForeignCurrency.vm";

export const DealWithForeignCurrencyComponent = (props: {
    vm: DealForeignCurrencyVM
}) => {

    return <div class='car-purchase-deal car-purchase-deal-with-foreign-currency'>

        <DealComponentBare vm={props.vm} />

        <div class='car-purchase-downpayment-currency-label'>
            Please select currency
        </div>

        <SelectDropdown
            selectAttributes={{ class: 'car-purchase-downpayment-currency' }}
            hasEmptyOption={false}
            availableItems={props.vm.state.currenciesAvailable}
            vm={props.vm.subVMS.downpaymentCurrency}
            disabled={props.vm.derivedState.isLoading() || props.vm.state.businessParams.isDealFinalized}
        />

    </div>;
};

