import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { SelectDropdown } from "../../../generic-components/SelectDropdown.component";
import type { Dispatch, RootState } from "../../store";
import { getCachedSelectorDealDerrivations } from "./Deal";

export const CarModelsSelector = (props: {
    dealId: number
}) => {

    const dispatch = useDispatch<Dispatch>();
    
    const dealState = useSelector((state: RootState) => getCachedSelectorDealDerrivations(props.dealId)(state));

    return <>
        {
            dealState.deal.isLoadingItemized.carModelsAvailable
                ? <div className='car-model-selector-select'>Loading</div>
                : <SelectDropdown
                    selectAttributes={{ className: 'car-model-selector-select' }}
                    emptyPlaceholder='Please select model'

                    hasEmptyOption={true}
                    availableItems={dealState.deal.carModelsAvailable}
                    modelState={dealState.deal.businessParams.carModelSelected}
                    getKeyValue={(item) => item.id.toString()}
                    getDescription={(item) => item.description}
                    disabled={dealState.isLoadingAny
                                || dealState.deal.businessParams.isDealFinalized}
                    onSelect={(item) => dispatch.deals.setInBusinessParams(
                        props.dealId,
                        {
                            carModelSelected: item
                        })}
                />
        }

        <button
            className='car-model-selector-refresh-btn'
            onClick={() => dispatch.deals.reloadAvailableCarModels(dealState.deal.businessParams.dealId)}
            disabled={dealState.isLoadingAny || dealState.deal.businessParams.isDealFinalized}
        >
            Refresh available models
        </button>
    </>
};