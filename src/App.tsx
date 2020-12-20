import React, { useState } from "react"
import ReactDOM from "react-dom"
import { makeAutoObservable, reaction } from "mobx"
import { observer } from "mobx-react"
import { IReactComponent } from "mobx-react/dist/types/IReactComponent";

export const callback = {
    call: () => {}
};

function logReadAccess(object: object, key: string | number | symbol | undefined) {
    console.log(`Read ${(key ?? "").toString()}`, object);
}

function logWriteAccess(object: object, key: string | number | symbol) {
    console.log(`Wrote ${key.toString()}`, object);
    setTimeout(callback.call);
}

function makeObservableProxy<T extends object>(initialState: T): T {
    return new Proxy(initialState as any, {
        get: function (oTarget, sKey) {
            logReadAccess(oTarget, sKey);
            const result =  oTarget[sKey];
            if (typeof result === 'object') {
                return makeObservableProxy(result);
            } 
            return result;
        },
        set: function (oTarget, sKey, vValue) {
            logWriteAccess(oTarget, sKey);
            const result = oTarget[sKey] = vValue;
            if (typeof result === 'object') {
                return makeObservableProxy(result);
            } 
            return result;
        },
        deleteProperty: function (oTarget, sKey) {
            logWriteAccess(oTarget, sKey);
            return delete oTarget[sKey];
        },
        ownKeys: function (oTarget) {
          logReadAccess(oTarget, undefined);
          return Object.getOwnPropertyNames(oTarget);
        },
        has: function (oTarget, sKey) {
            logReadAccess(oTarget, sKey);
            return sKey in oTarget || oTarget.hasItem(sKey);
        },
        defineProperty: function (oTarget, sKey, oDesc) {
            logWriteAccess(oTarget, sKey);
            return Object.defineProperty(oTarget, sKey, oDesc);
        },
      }) as unknown as T;
}

export const atom = makeObservableProxy({});

// todo implemet all of:
// getPrototypeOf? (target: T): object | null;
// setPrototypeOf? (target: T, v: any): boolean;
// isExtensible? (target: T): boolean;
// preventExtensions? (target: T): boolean;
// getOwnPropertyDescriptor? (target: T, p: PropertyKey): PropertyDescriptor | undefined;
// has? (target: T, p: PropertyKey): boolean;
// get? (target: T, p: PropertyKey, receiver: any): any;
// set? (target: T, p: PropertyKey, value: any, receiver: any): boolean;
// deleteProperty? (target: T, p: PropertyKey): boolean;
// defineProperty? (target: T, p: PropertyKey, attributes: PropertyDescriptor): boolean;
// ownKeys? (target: T): PropertyKey[];
// apply? (target: T, thisArg: any, argArray?: any): any;
// construct? (target: T, argArray: any, newTarget?: any): object;
