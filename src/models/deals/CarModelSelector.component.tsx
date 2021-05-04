
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { SelectDropdown } from "../../generic-components/SelectDropdown.component";
import type { Dispatch, RootState } from "../../store";
import { isLoadingAny } from "../../util/isLoadingAny";

export const CarModelsSelector: React.FunctionComponent<{
    dealId: Number
}> = (props) => {

    const dispatch = useDispatch<Dispatch>();

    const dealState = useSelector((state: RootState) =>
        state.deals.deals.find(x => x.businessParams.dealId === props.dealId))!;

    const isLoading = isLoadingAny(dealState.isLoadingItemized);

    return <>
        {
            dealState.isLoadingItemized.carModelsAvailable
                ? <div className='car-model-selector-select'>Loading</div>
                : <SelectDropdown
                    selectAttributes={{ className: 'car-model-selector-select' }}
                    emptyPlaceholder='Please select model'

                    hasEmptyOption={true}
                    availableItems={dealState.carModelsAvailable}
                    modelState={dealState.businessParams.carModelSelected}
                    getKeyValue={(item) => item.id.toString()}
                    getDescription={(item) => item.description}
                    disabled={isLoading
                                || dealState.businessParams.isDealFinalized}
                    onSelect={(item) => dispatch.deals.setInBusinessParams(
                        dealState.businessParams.dealId,
                        {
                            carModelSelected: item
                        })}
                />
        }

        <button
            className='car-model-selector-refresh-btn'
            onClick={() => dispatch.deals.reloadAvailableCarModels(dealState.businessParams.dealId)}
            disabled={isLoading || dealState.businessParams.isDealFinalized}
        >
            Refresh available models
        </button>
    </>
};