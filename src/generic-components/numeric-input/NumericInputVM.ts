import { observable, computed, action, reaction } from "mobx";

export interface NumericInputVM {
    readonly displayedValue: string | undefined,
    onChange: (val: string | undefined) => void,
    onBlur: (val: string | undefined) => void,
    readonly message?: string,
    readonly isValid: boolean,
    readonly disabled?: boolean
}

export class PositiveIntegerVM implements NumericInputVM {

    public constructor(
        getModelValue: () => number | undefined,
        setValidValueToModel: (val: number | undefined) => void,
        isDisabled?: () => boolean,
        additionalValidity?: () => {
            isValid: boolean,
            message?: string
        }) {

        this.getModelValue = getModelValue;
        this.setValidValueToModel = setValidValueToModel;
        this.isDisabled = isDisabled ?? (() => false);
        this.additionalValidity = additionalValidity
            ?? (() => ({
                isValid: true
            }));

        // any change in model overrides unsaved input value
        // to prevent model state being overwritten without user 
        // first noticing it changed
        reaction(
            () => this.getModelValue(),
            () => this.clearUnsavedState());
    }

    private readonly getModelValue: () => number | undefined;
    private readonly setValidValueToModel: (val: number | undefined) => void;
    private readonly isDisabled: () => boolean;
    private readonly additionalValidity: () => {
        isValid: boolean,
        message?: string
    };

    @computed
    public get displayedValue() {
        return this.currentUnsavedValue
            ?? this.getModelValue()?.toString()
    }

    @observable
    public currentUnsavedValue: string | undefined;

    @computed
    public get disabled() {
        return this.isDisabled();
    }

    @observable
    public _message: string | undefined;
    @computed
    public get message() {
        return this._message ?? this.additionalValidity().message;
    }

    @observable
    private _isValid: boolean = true;

    @computed
    public get isValid() {
        return this._isValid && this.additionalValidity().isValid;
    }

    @action.bound
    public onChange(val: string | undefined) {
        this.currentUnsavedValue = val;
    }

    @action.bound
    public clearUnsavedState() {
        this.currentUnsavedValue = undefined;
        this._message = undefined;
        this._isValid = true;
    }

    @action.bound
    public onBlur(val: string | undefined) {
        this.clearUnsavedState();

        if (val === undefined) {
            this.setValidValueToModel(val);
            return;
        }

        val = val.trim()
            .replace('k', '000')
            .replace('K', '000')
            .replace('m', '000000')
            .replace('M', '000000');

        if (val[0] === '-') {
            this._isValid = false;
            this._message = 'Value must be 0 or positive';
            this.currentUnsavedValue = val;
            return;
        }

        const isInteger = /^\d+$/.test(val) === true;
        if (!isInteger) {
            this._isValid = false;
            this._message = 'Please enter a valid integer';
            this.currentUnsavedValue = val;
            return;
        }

        const int = parseInt(val);
        this.setValidValueToModel(int);
    }
}