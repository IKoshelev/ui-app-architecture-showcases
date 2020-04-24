import { useState, useEffect } from "react";
import { dealsStore } from "../../../../stores/Deals.Store";
import { fetchMinimumDownPayment } from "../../../../stores/Deals.Async";
import { calculateFinalPrice } from "../../../../stores/Deals.Sync";

export const useDownPayment = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [value, setValue] = useState<string>('0');
    const [message, setMessage] = useState<string>('');
    const [isValid, setIsValid] = useState<boolean>(true);

    const setMinimumPossibleDownpayment = async (): Promise<void> => {
        setIsLoading(true);
        await fetchMinimumDownPayment();
        setIsLoading(false);
    }

    const setValueFromStore = () => {
        const nextValue = dealsStore?.downpayment?.toString() ?? '0'
        setValue(nextValue);
        setMessage('');
        setIsValid(true);
    }

    useEffect(() => {
        setValueFromStore();
    }, [dealsStore.activeDealId])

    return {
        isDisabled: isLoading || !dealsStore.carModel,
        isValid,
        value,
        message,
        handleClick: async () => {
            await setMinimumPossibleDownpayment();
            setValueFromStore();
        },
        handleChange(event: React.ChangeEvent<HTMLInputElement>) {
            setValue(event.target.value);
        },
        handleBlur(event: React.ChangeEvent<HTMLInputElement>) {
            if (value === '') {
                dealsStore.setDownPayment(0);
                return;
            }
            const transformedValue: string = value.trim()
            .replace('k', '000')
            .replace('K', '000')
            .replace('m', '000000')
            .replace('M', '000000');

            if (transformedValue[0] === '-') {
                setIsValid(false);
                setMessage('Value must be 0 or positive');
                return;
            }

            const isInteger = /^\d+$/.test(transformedValue) === true;
            if (!isInteger) {
                setIsValid(false);
                setMessage('Please enter a valid integer');
                return;
            }

            const parsedInteger = parseInt(transformedValue);
            setValue(transformedValue);
            dealsStore.setDownPayment(parsedInteger);
            const finalPrice = calculateFinalPrice();
            if (!finalPrice) {
                return;
            }
            if (dealsStore.carModel && parsedInteger > finalPrice) {
                setIsValid(false);
                setMessage('Downpayment exceeds final price');
                return;
            }
        }
    }
}