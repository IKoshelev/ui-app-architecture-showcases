import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { SelectMultiple } from "../../generic-components/SelectMultiple.component";
import type { Dispatch, RootState } from "../store";
import { isLoadingAny } from "../../util/isLoadingAny";

export const InsurancePlanSelector = (props:{
    dealId: number
}) => {

    const dispatch = useDispatch<Dispatch>();

    const dealState = useSelector((state: RootState) =>
        state.deals.deals.find(x => x.businessParams.dealId === props.dealId))!;

    const isLoading = isLoadingAny(dealState.isLoadingItemized);

    return <>
        {dealState.isLoadingItemized.insurancePlansAvailable
            ? <div className='insurance-plan-selector-select'>Loading</div>
            : <SelectMultiple
                selectAttributes={{ className: 'insurance-plan-selector-select' }}
                availableItems={dealState.insurancePlansAvailable}
                modelState={dealState.businessParams.insurancePlansSelected}
                disabled={isLoading}
                getKeyValue={(item) => item.type.toString()}
                getDescription={(item) => item.description}
                onSelect={(items) => dispatch.deals.setInBusinessParams(props.dealId,
                    { insurancePlansSelected: items })}
            />
        }
        <button
            className='insurance-plan-selector-refresh-btn'
            onClick={() => dispatch.deals.reloadAvailableInsurancePlans(props.dealId)}
            disabled={isLoading || dealState.businessParams.isDealFinalized}
        >
            Refresh available plans
        </button>
    </>
}