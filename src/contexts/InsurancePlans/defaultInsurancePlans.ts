import { IInsurancePlansContext } from "./InsurancePlans.Context";

export const defaultInsurancePlansContext: IInsurancePlansContext = {
    insurancePlans: [],
    isLoading: false,
    setIsLoading: (value: boolean) => {
        throw new Error('You forget to add a provider')
    },
    reloadAvailableInsurancePlans: () => {
        throw new Error('You forget to add a provider')
    }
}