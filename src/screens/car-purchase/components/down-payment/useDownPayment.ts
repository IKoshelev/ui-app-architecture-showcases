import { useState, useEffect } from "react";
import { financingClient } from "../../../../api/Financing.Client";
import { useDeal } from "../../../../contexts/Deal/Deal.Context";
import { calculateFinalPrice } from "../../../../contexts/Deal/Deal.Sync";
import { useEffectOnce } from "../../../../util/useEffectOnce";

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

    // this function looks weird - it both returns a value and has side-effects, a bad sign
    const passesFinalPriceCheck = (value?: number): boolean => {
        const finalPrice = calculateFinalPrice(deal.carModel, deal.selectedInsurancePlans);
        const downpayment = value ?? deal.downpayment;
        if (!finalPrice) {
            setMessage('');
            return true;
        }

        // this looks redundant. carModel presence is already part of finalPrice state
        if (deal.carModel && downpayment > finalPrice) {
            setMessage('Downpayment exceeds final price');
            return false;
        }
        setMessage('');
        return true;
    }

    useEffect(() => void passesFinalPriceCheck(),
        [deal.carModel, deal.selectedInsurancePlans]);

    useEffectOnce(setValueFromStore);
    function setValueFromStore() {
        const nextValue = deal.downpayment.toString();
        setValue(nextValue);
        setMessage('');
        deal.setIsValid(true);
    }

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

            // Why does positive integer parsing code suddenly know about deal validity and approvalStatusees?
            // Parsing function should be separate - it is a utility that will be used all-over the project
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
            if (!passesFinalPriceCheck(parsedInteger)) {
                deal.setIsValid(false);
            } else {
                deal.setIsValid(true);
            };
            deal.setApprovalStatus({ isApproved: false });
        }
    }
}