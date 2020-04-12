import React from 'react';

const PersonForm = (props) => {
    const { submitForm, newName, handleNameChange, newNumber, handleNumberChange } = props;

    return (
        <div>
            <form onSubmit={submitForm}>
                <div>
                    name: <input value={newName} onChange={handleNameChange} />
                </div>
                <div>
                    number: <input value={newNumber} onChange={handleNumberChange} />
                </div>
                <div>
                    <button type="submit">add</button>
                </div>
            </form>
        </div>
    );
}

export default PersonForm;
