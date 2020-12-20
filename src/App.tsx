
import React, { useEffect, useRef } from "react";
import { makeApp } from "./util/observable-proxy";
import './index.css';
import { useState } from 'react';
import { observer2 } from './util/observer';

type App = {
    message: string,
    counter: number
}

export const app = makeApp({
    message: 'start adding arbitrary sub-objects and observe reactions',
    counter: 1
} as App);

export const JsObjectView = React.memo(observer2(({ target, indentation }: {
    target: any,
    indentation: number
}) => {

    console.log(`rendering JsObjectView`);

    const [newKey, setNewKey] = useState("");
    const [newVal, setNewVal] = useState("");

    //show border on render (without needing dev tools)
    const containerRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const style =  (containerRef?.current as any)?.style as React.CSSProperties;
        if(!style) {
            return;
        }
        style.border = "solid 2px red";
        setTimeout(() => {
            style.border = "solid 2px white";
        }, 1000);
    });

    const indentationStr = '\u00A0'.repeat(indentation);
    return <div ref={containerRef}>
        {indentationStr}{"\{"}
        <button style={{ display: 'inline-block' }} onClick={() => {
            let json: any;
            try {
                json = JSON.parse(newVal);
            } catch (er) {
                window.alert("Oops... could not parse JSON. Remember to quote prop names with \".");
                return;
            }
            target[newKey] = json;
            setNewKey('');
            setNewVal('');
        }} >add</button>  
        
        <input
            style={{ display: 'inline', width: '100px' }}
            type="text"
            value={newKey}
            placeholder="key"

            onChange={({ target: { value } }) => setNewKey(value)} />

        <input
            style={{ display: 'inline', width: '150px' }}
            type="text" value={newVal}
            placeholder="json value"
            onChange={({ target: { value } }) => setNewVal(value)} />


        {Object.getOwnPropertyNames(target).map(key => {
            const val = target[key];
            return <div key={key.toString()} style={{ width: '500px' }}>
                {indentationStr}
                "{key.toString()}":{
                    typeof val === 'object'
                        ? <JsObjectView target={val} indentation={indentation + 4} />
                        : typeof val === 'string' 
                            ? `"${val}"`
                            : val.toString()
                }
                {typeof val === 'number' && <button onClick={(() => { target[key] = val + 1 })}>+</button>}

            </div>;
        })}
        {indentationStr}{"\}"}
    </div>
}));