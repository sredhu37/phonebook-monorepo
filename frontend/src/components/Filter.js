import React from 'react';

const Filter = (props) => {
    const { searchName, handleSearchNameChange} = props;

    return (
        <div>
            filter shown with <input value={searchName} onChange={handleSearchNameChange}></input>
        </div>
    );
}

export default Filter;
