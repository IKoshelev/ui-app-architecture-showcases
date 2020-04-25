import { ICarModelsContext } from "./CarModels.Context";

export const defaultCarModelsContext: ICarModelsContext = {
    carModels: [],
    isLoading: false,
    setIsLoading: (value: boolean) => console.log('You forget to add a provider'),
    reloadAvailableModels: () => console.log('You forget to add a provider')
}