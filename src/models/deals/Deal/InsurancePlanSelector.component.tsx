import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { SelectMultiple } from "../../../generic-components/SelectMultiple.component";
import type { Dispatch, RootState } from "../../store";
import { getCachedSelectorDealDerrivations } from "./Deal";

export const InsurancePlanSelector = (props:{
    dealId: number
}) => {

    const dispatch = useDispatch<Dispatch>();

    const dealState = useSelector((state: RootState) => getCachedSelectorDealDerrivations(props.dealId)(state));

    return <>
        {dealState.deal.isLoadingItemized.insurancePlansAvailable
            ? <div className='insurance-plan-selector-select'>Loading</div>
            : <SelectMultiple
                selectAttributes={{ className: 'insurance-plan-selector-select' }}
                availableItems={dealState.deal.insurancePlansAvailable}
                modelState={dealState.deal.businessParams.insurancePlansSelected}
                disabled={dealState.isLoadingAny}
                getKeyValue={(item) => item.type.toString()}
                getDescription={(item) => item.description}
                onSelect={(items) => dispatch.deals.setInBusinessParams(props.dealId,
                    { insurancePlansSelected: items })}
            />
        }
        <button
            className='insurance-plan-selector-refresh-btn'
            onClick={() => dispatch.deals.reloadAvailableInsurancePlans(props.dealId)}
            disabled={dealState.isLoadingAny || dealState.deal.businessParams.isDealFinalized}
        >
            Refresh available plans
        </button>
    </>
}