import React, { createContext, useContext, useState } from 'react';
import { CarModel } from '../../api/CarInventory.Client';
import { EnsurancePlan } from '../../api/CarEnsurance.Client';
import { defaultDealContext } from './defaultDealContext';

export type IDealContext = {
    id: number,
    carModel?: CarModel,
    setCarModel: (value: CarModel) => void,
    selectedInsurancePlans: EnsurancePlan[],
    setSelectedInsurancePlans: (value: EnsurancePlan[]) => void,
    downpayment: number,
    setDownpayment: (value: number) => void,
    isLoading: boolean,
    setIsLoading: (value: boolean) => void,
    isApproved: boolean,
    setIsApproved: (value: boolean) => void,
    approvalToken?: string,
    setApprovalToken: (value: string) => void,
    isFinalized: boolean,
    setIsFinalized: (value: boolean) => void,
    expirationTimer: number,
    setExpirationTimer: (value: number) => void,
    messages: string[],
    setMessages: (value: string[]) => void,
    handleCloseDealClick: (id: number) => void;
}

export const DealContext = createContext<IDealContext>(defaultDealContext);

interface IDealContextProps {
    children: React.ReactNode;
    initialDealId: number;
    handleCloseDealClick: (id: number) => void;
}

export const DealProvider: React.FC<IDealContextProps> = (props) => {
    const [downpayment, setDownpayment] = useState<number>(0);
    const [carModel, setCarModel] = useState<CarModel>();
    const [selectedInsurancePlans, setSelectedInsurancePlans] = useState<EnsurancePlan[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isApproved, setIsApproved] = useState<boolean>(false);
    const [approvalToken, setApprovalToken] = useState<string>();
    const [isFinalized, setIsFinalized] = useState<boolean>(false);
    const [expirationTimer, setExpirationTimer] = useState<number>(0);
    const [messages, setMessages] = useState<string[]>([]);

    return <DealContext.Provider
                value={{
                    id: props.initialDealId,
                    downpayment,
                    setDownpayment,
                    carModel,
                    setCarModel,
                    selectedInsurancePlans,
                    setSelectedInsurancePlans,
                    isLoading,
                    setIsLoading,
                    isApproved,
                    setIsApproved,
                    approvalToken,
                    setApprovalToken,
                    isFinalized,
                    setIsFinalized,
                    expirationTimer,
                    setExpirationTimer,
                    messages,
                    setMessages,
                    handleCloseDealClick: props.handleCloseDealClick
                }}
            >
                {props.children}
            </DealContext.Provider>
} 

export const useDeal = () => useContext(DealContext);