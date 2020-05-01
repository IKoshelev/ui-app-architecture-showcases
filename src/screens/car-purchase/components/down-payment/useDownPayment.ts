import { useState, useEffect } from "react";
import { financingClient } from "../../../../api/Financing.Client";
import { useDeal } from "../../../../contexts/Deal/Deal.Context";
import { calculateFinalPrice } from "../../../../contexts/Deal/Deal.Sync";

export const useDownPayment = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [value, setValue] = useState<string>('0');
    const [message, setMessage] = useState<string>('');

    const deal = useDeal();

    const setMinimumPossibleDownpayment = async (): Promise<void> => {
        if (!deal.carModel) {
            return;
        }
        setIsLoading(true);
        deal.setIsLoading(true);
        try {
            const result = await financingClient.getMinimumPossibleDownpayment(
                deal.carModel,
                deal.selectedInsurancePlans.map(plan => plan.type)
            );
            setValue(result.toString());
            deal.setDownpayment(result);
        } finally {
            setIsLoading(false);
            deal.setIsLoading(false);
        }
    }

    const passesFinalPriceCheck = (value?: number): boolean => {
        const finalPrice = calculateFinalPrice(deal.carModel, deal.selectedInsurancePlans);
        const downpayment = value ?? deal.downpayment;
        if (!finalPrice) {
            setMessage('');
            return true;
        }

        if (deal.carModel && downpayment > finalPrice) {
            setMessage('Downpayment exceeds final price');
            return false;
        }
        setMessage('');
        return true;
    }

    useEffect(() => {
        passesFinalPriceCheck();
    }, [deal.carModel, deal.selectedInsurancePlans])

    const setValueFromStore = () => {
        const nextValue = deal.downpayment.toString();
        setValue(nextValue);
        setMessage('');
        deal.setIsValid(true);
    }

    useEffect(() => {
        setValueFromStore();
    }, []);

    return {
        isDisabled: isLoading || !deal.carModel || deal.isFinalized,
        isValid: deal.isValid,
        displayedValue: value,
        message,
        handleClick: async () => {
            await setMinimumPossibleDownpayment();
            deal.setIsValid(true);
            setMessage('');
            deal.setApprovalStatus({ isApproved: false });
        },
        handleChange(event: React.ChangeEvent<HTMLInputElement>) {
            setValue(event.target.value);
        },
        handleBlur(_event: React.ChangeEvent<HTMLInputElement>) {
            if (value === '') {
                deal.setDownpayment(0);
                deal.setApprovalStatus({ isApproved: false });
                return;
            }


            const transformedValue: string = value.trim()
                .replace('k', '000')
                .replace('K', '000')
                .replace('m', '000000')
                .replace('M', '000000');

            if (transformedValue[0] === '-') {
                deal.setIsValid(false);
                deal.setApprovalStatus({ isApproved: false });
                setMessage('Value must be 0 or positive');
                return;
            }

            const isInteger = /^\d+$/.test(transformedValue) === true;
            if (!isInteger) {
                deal.setIsValid(false);
                deal.setApprovalStatus({ isApproved: false });
                setMessage('Please enter a valid integer');
                return;
            }

            const parsedInteger = parseInt(transformedValue);
            setValue(parsedInteger.toString());
            deal.setDownpayment(parsedInteger);
            const isValid = !passesFinalPriceCheck(parsedInteger);
            deal.setIsValid(isValid);

            deal.setApprovalStatus({ isApproved: false });
        }
    }
}