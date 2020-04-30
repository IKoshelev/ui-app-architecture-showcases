import React from 'react';
import { CarModelsSelector } from "./car-model-selector/CarModelsSelector";
import { InsurancePlanSelector } from "./insurance-plan-selector/InsurancePlanSelector";
import { DownPayment } from "./down-payment/DownPayment";
import { Messages } from "./messages/Messages";
import { FinalPrice } from "./final-price/FinalPrice";
import { DealState } from './deal-state/DealState';
import { CloseDealButton } from './close-deal-button/CloseDealButton';
import { RequestApprovalButton } from './request-approval-button/RequestApprovalButton';
import { FinalizeDealButton } from './finalize-deal-button/FinalizeDealButton';
import './CarPurchase.css';

export const CarPurchase = () => (
    <div className='car-purchase-deal'>
        <div className='car-purchase-model-selector-label'>
            Please select model
        </div>
        <CarModelsSelector />
        <div className='car-purchase-ensurance-selector-label'>
            Please select insurance options
        </div>
        <InsurancePlanSelector />
        <div className='car-purchase-downpayment-label'>
            Please select downpayment
        </div>
        <DownPayment />
        <div className='car-purchase-final-price-label'>
            Final price
        </div>
        <FinalPrice />
        <DealState />
        <CloseDealButton />
        <RequestApprovalButton />
        <FinalizeDealButton />
        <Messages />
    </div>
);