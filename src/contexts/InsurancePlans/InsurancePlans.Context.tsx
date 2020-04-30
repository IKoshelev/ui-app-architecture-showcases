import React, { createContext, useContext, useState, useEffect } from 'react';
import { defaultInsurancePlansContext } from './defaultInsurancePlans';
import { useDeal } from '../Deal/Deal.Context';
import { InsurancePlan, carInsuranceClient } from '../../api/CarInsurance.Client';
import { useEffectOnce } from '../../util/useEffectOnce';

export type IInsurancePlansContext = {
    insurancePlans: InsurancePlan[],
    isLoading: boolean,
    setIsLoading: (value: boolean) => void,
    reloadAvailableInsurancePlans: () => void
}

export const InsurancePlansContext = createContext<IInsurancePlansContext>(defaultInsurancePlansContext);

interface IInsurancePlansContextProps {
    children: React.ReactNode;
}

export const InsurancePlansProvider: React.FC<IInsurancePlansContextProps> = (props) => {
    const [insurancePlans, setInsurancePlans] = useState<InsurancePlan[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const deal = useDeal();

    useEffectOnce(reloadAvailableInsurancePlans);
    async function reloadAvailableInsurancePlans() {
        setIsLoading(true);
        deal.setIsLoading(true);
        try {
            const result: InsurancePlan[] = await carInsuranceClient.getAvaliableInsurancePlans();
            setInsurancePlans(result);
        } finally {
            setIsLoading(false);
            deal.setIsLoading(false);
        }
    }

    return <InsurancePlansContext.Provider
        value={{
            isLoading,
            setIsLoading,
            insurancePlans,
            reloadAvailableInsurancePlans
        }}
    >
        {props.children}
    </InsurancePlansContext.Provider>
}

export const useInsurancePlans = () => useContext(InsurancePlansContext);