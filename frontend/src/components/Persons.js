import React from 'react';

const Persons = ({updateSearchResults}) => {
    return (
        <div>
            {updateSearchResults()}
        </div>
    );
}

export default Persons;
