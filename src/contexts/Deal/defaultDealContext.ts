import { IDealContext } from "./Deal.Context";
import { CarModel } from "../../api/CarInventory.Client";
import { EnsurancePlan } from "../../api/CarEnsurance.Client";

export const defaultDealContext: IDealContext = {
    id: 0,
    setCarModel: (value: CarModel) => {
        throw new Error('You forget to add a provider')
    },
    selectedInsurancePlans: [],
    setSelectedInsurancePlans: (value: EnsurancePlan[]) => {
        throw new Error('You forget to add a provider')
    },
    downpayment: 0,
    setDownpayment: (value: number) => {
        throw new Error('You forget to add a provider')
    },
    isLoading: false,
    setIsLoading: (value: boolean) => {
        throw new Error('You forget to add a provider')
    },
    isApproved: false,
    setIsApproved: (value: boolean) => {
        throw new Error('You forget to add a provider')
    },
    setApprovalToken: (value: string) => {
        throw new Error('You forget to add a provider')
    },
    isFinalized: false,
    setIsFinalized: (value: boolean) => {
        throw new Error('You forget to add a provider')
    },
    expirationTimer: 0,
    setExpirationTimer: (value: number) => {
        throw new Error('You forget to add a provider')
    },
    messages: [],
    setMessages: (value: string[]) => {
        throw new Error('You forget to add a provider')
    },
    handleCloseDealClick: (id: number) => {
        throw new Error('You forget to add a provider')
    }
}