import React, { createContext, useContext, useState } from 'react';
import { CarModel } from '../../api/CarInventory.Client';
import { InsurancePlan } from '../../api/CarInsurance.Client';
import { defaultDealContext } from './defaultDealContext';
import { ApprovalStatus } from './Deal.Types';

export type IDealContext = {
    id: number,
    carModel?: CarModel,
    setCarModel: (value: CarModel) => void,
    selectedInsurancePlans: InsurancePlan[],
    setSelectedInsurancePlans: (value: InsurancePlan[]) => void,
    downpayment: number,
    setDownpayment: (value: number) => void,
    isLoading: boolean,
    setIsLoading: (value: boolean) => void,
    approvalStatus: ApprovalStatus,
    setApprovalStatus: (value: ApprovalStatus) => void,
    isFinalized: boolean,
    setIsFinalized: (value: boolean) => void,
    isValid: boolean,
    setIsValid: (value: boolean) => void,
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
    const [selectedInsurancePlans, setSelectedInsurancePlans] = useState<InsurancePlan[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isValid, setIsValid] = useState<boolean>(false);
    const [isFinalized, setIsFinalized] = useState<boolean>(false);
    const [messages, setMessages] = useState<string[]>([]);
    const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus>({ isApproved: false });

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
            isValid,
            setIsValid,
            isFinalized,
            setIsFinalized,
            messages,
            setMessages,
            approvalStatus,
            setApprovalStatus,
            handleCloseDealClick: props.handleCloseDealClick
        }}
    >
        {props.children}
    </DealContext.Provider>
}

export const useDeal = () => useContext(DealContext);