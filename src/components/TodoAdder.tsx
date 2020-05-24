import React, { useState } from 'react';

export const TodoAdder: React.FC<{
    onAdd: (text: string) => void
}> = ({ onAdd }) => {

    const [unsavedText, setUnsavedText] = useState('');

    return <>
        <input
            value={unsavedText}
            onChange={(e) => setUnsavedText(e.target.value)}
        />
        <button
            onClick={() => {
                onAdd(unsavedText);
                setUnsavedText('');
            }}
        >
            Add
      </button>
    </>;
};
