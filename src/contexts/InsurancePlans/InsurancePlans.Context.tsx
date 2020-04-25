import React, { createContext, useContext, useState, useEffect } from 'react';
import { defaultInsurancePlansContext } from './defaultInsurancePlans';
import { useDeal } from '../Deal/Deal.Context';
import { EnsurancePlan, carEnsuranceClient } from '../../api/CarEnsurance.Client';

export type IInsurancePlansContext = {
    insurancePlans: EnsurancePlan[],
    isLoading: boolean,
    setIsLoading: (value: boolean) => void,
    reloadAvailableInsurancePlans: () => void
}

export const InsurancePlansContext = createContext<IInsurancePlansContext>(defaultInsurancePlansContext);

interface IInsurancePlansContextProps {
    children: React.ReactNode;
}

export const InsurancePlansProvider: React.FC<IInsurancePlansContextProps> = (props) => {
    const [insurancePlans, setInsurancePlans] = useState<EnsurancePlan[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const deal = useDeal();

    const reloadAvailableInsurancePlans = async () => {
        setIsLoading(true);
        deal.setIsLoading(true);
        try {
            const result: EnsurancePlan[] = await carEnsuranceClient.getAvaliableEnsurancePlans();
            setInsurancePlans(result);
        } finally {
            setIsLoading(false);
            deal.setIsLoading(false);
        }
    }

    useEffect(() => {
        reloadAvailableInsurancePlans();
    }, [])

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