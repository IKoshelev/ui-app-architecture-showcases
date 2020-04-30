import React, { createContext, useContext, useState, useEffect } from 'react';
import { CarModel, carInvenotryClient } from '../../api/CarInventory.Client';
import { defaultCarModelsContext } from './defaultCarModels';
import { useDeal } from '../Deal/Deal.Context';
import { useEffectOnce } from '../../util/useEffectOnce';

export type ICarModelsContext = {
    carModels: CarModel[],
    isLoading: boolean,
    setIsLoading: (value: boolean) => void,
    reloadAvailableModels: () => void
}

export const CarModelsContext = createContext<ICarModelsContext>(defaultCarModelsContext);

interface ICarModelsContextProps {
    children: React.ReactNode;
}

export const CarModelsProvider: React.FC<ICarModelsContextProps> = (props) => {
    const [carModels, setCarModels] = useState<CarModel[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const deal = useDeal();

    useEffectOnce(reloadAvailableModels);
    async function reloadAvailableModels() {
        setIsLoading(true);
        deal.setIsLoading(true);
        try {
            const result = await carInvenotryClient.getAvaliableCarModels();
            setCarModels(result);
        } finally {
            setIsLoading(false);
            deal.setIsLoading(false);
        }
    }

    return <CarModelsContext.Provider
        value={{
            isLoading,
            setIsLoading,
            carModels,
            reloadAvailableModels
        }}
    >
        {props.children}
    </CarModelsContext.Provider>
}

export const useCarModels = () => useContext(CarModelsContext);