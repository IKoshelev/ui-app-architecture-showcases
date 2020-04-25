import { useDeal } from "../../../../contexts/Deal/Deal.Context";
import { calculateFinalPrice } from "../../../../contexts/Deal/Deal.Sync";

export const useFinalPrice = () => {
    const deal = useDeal();
    return {
        finalPrice: calculateFinalPrice(deal.carModel, deal.selectedInsurancePlans)
    }
}