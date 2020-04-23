import { useState } from "react";
import { dealsStore } from "../../../../stores/Deals.Store";
import { fetchMinimumDownPayment } from "../../../../stores/Deals.Async";

export const useDownPayment = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [value, setValue] = useState<string>('0');
    const [message, setMessage] = useState<string>('');

    const setMinimumPossibleDownpayment = async () => {
        setIsLoading(true);
        await fetchMinimumDownPayment();
        setIsLoading(false);
    }

    return {
        isDisabled: isLoading || !dealsStore.carModel,
        isValid: true,
        value,
        message,
        handleClick: () => setMinimumPossibleDownpayment(),
        handleChange(event: React.ChangeEvent<HTMLInputElement>) {
            setValue(event.target.value);
        },
        handleBlur(event: React.ChangeEvent<HTMLInputElement>) {
            console.log('we have blurred');
        }
    }
}