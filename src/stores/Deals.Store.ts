import { computed, observable, action } from "mobx";
import { CarModel } from "../api/CarInventory.Client";
import { EnsurancePlanType } from "../api/CarEnsurance.Client";

export type Deal = {
    id: number,
    carModel: CarModel | undefined,
    selectedEnsurancePlanTypes: EnsurancePlanType[],
    downpayment: number | undefined,
    financingFinilizedToken: number | undefined
}

// assume deal ids are unique enough, 
// in real app this would be a generated guid or we woud get the from back-end
let dealIdCounter = 0;

const deal = createFreshDeal();

export function createFreshDeal(): Deal {
    return observable({
        id: (dealIdCounter += 1),
        carModel: undefined,
        selectedEnsurancePlanTypes: [],
        downpayment: undefined,
        financingFinilizedToken: undefined
    })
}

// todo move to util
function getArrayWithUpdatedItems<T>(
    arr: T[],
    predicate: (item: T) => boolean,
    update: Partial<T>): T[] {

    // this code will fire even if there is no active item, just swallowing the update without error
    return arr.map(item => {

        if (!predicate(item)) {
            return item;
        }

        return {
            ...item,
            ...update
        }
    });

    // I can't see a situation, in which which we are given an update, 
    // can't find item to apply it to, and that is not an error.
    // So, if we go this route, i'd do somethings like this:
    const itemIndex = arr.findIndex(predicate);
    if (itemIndex === -1) {
        throw new Error(`Item for update not found`);
    }

    const newArr = [...arr];
    newArr[itemIndex] = {
        ...newArr[itemIndex],
        ...update
    }
    return newArr;
}

// todo move to util
type ReadonlyDeep<TType> = {
    readonly [key in keyof TType]: ReadonlyDeep<TType[key]>;
}

class DealsStore {

    @observable
    public activeDealId: number = 1;

    @observable
    public deals: Deal[] = [deal];

    @computed
    public get getActiveDeal(): ReadonlyDeep<Deal> | undefined {
        // If we use setter function - we want to prevent devs
        // from accitdentally setting state in any other way, so, lets only give them ReadonlyDeep
        return this.deals.find(deal => deal.id === this.activeDealId);
    };

    @action
    private updateActiveItem(update: Partial<Deal>) {
        this.deals = getArrayWithUpdatedItems(this.deals, i => i.id === this.activeDealId, update);
    }

    @action.bound
    public setActiveDealId(value: number) {
        this.activeDealId = value
    }

    @computed
    public get carModel() {
        return this.getActiveDeal?.carModel;
    }

    @action.bound
    public setCarModel(value: CarModel | undefined) {
        this.updateActiveItem({
            carModel: value
        });
    }

    @computed
    public get selectedEnsurancePlanTypes() {
        return this.getActiveDeal?.selectedEnsurancePlanTypes;
    }

    @action.bound
    public setSelectedEnsurancePlanTypes(value: EnsurancePlanType[]) {
        this.updateActiveItem({
            selectedEnsurancePlanTypes: value
        });
    }

    @computed
    public get downpayment() {
        return this.getActiveDeal?.downpayment;
    }

    @action.bound
    public setDownPayment(value: number | undefined) {
        // notice, before the property name was wrong and compiler ignored it
        this.updateActiveItem({
            downpayment: value
        });
    }

    @computed
    public get financingFinilizedToken() {
        return this.getActiveDeal?.financingFinilizedToken;
    }

    @action.bound
    public setFinancingFinilizedToken(value: number | undefined) {
        this.updateActiveItem({
            financingFinilizedToken: value
        });
    }
}

export const dealsStore = new DealsStore();