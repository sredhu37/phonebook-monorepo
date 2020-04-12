import React, { useState, useEffect } from 'react';
import Filter from './Filter';
import PersonForm from './PersonForm';
import Persons from './Persons';
import personsService from '../services/persons';
import Notification from './Notification';

const App = () => {
    const [ persons, setPersons] = useState([]);

    const [ newName, setNewName ] = useState('');
    const [ newNumber, setNewNumber ] = useState('0000000000');
    const [ searchName, setNewSearchName ] = useState('');
    const [ notificationMessage, setNotificationMessage ] = useState('');
    const [ notificationType, setNotificationType ] = useState('');

    const displayNotification = (msg, type) => {
        setNotificationType(type);
        setNotificationMessage(msg);

        setTimeout(() => {
            setNotificationType('');
            setNotificationMessage('');
        }, 5000)
    }

    const fetchDataFromServer = () => {
        personsService
            .getAll()
            .then((response) => {
            setPersons(response.data);
            })
            .catch((error) => {
                displayNotification(`Cannot fetch data from server: ${error}`, 'ERROR');
            });
    }

    useEffect(fetchDataFromServer, []);

    const submitForm = (event) => {
        event.preventDefault();

        if((persons.filter(person => person.name === newName)).length === 0) {
            const newPerson = {
                id: persons.length + 1,
                name: newName,
                number: newNumber
            };

            personsService
                .create(newPerson)
                .then(response => {
                    console.log('Response returned by Backend: ', response.data);
                    setPersons(persons.concat(response.data));
                    setNewName('');
                    setNewNumber('0000000000');

                    displayNotification(`Added ${response.data.name}`, 'SUCCESS');
                })
                .catch(error => {
                    displayNotification(`Error while sending new user to server: ${error}`, 'ERROR');
                });
        } else {
            const result = window.confirm(`newName is already added to phonebook, replace the old number with a new one?`);
            if(result) {
                const existingPerson = persons.find(person => person.name === newName);
                const newPersonInfo = { ...existingPerson, number: newNumber }

                personsService
                    .update(existingPerson.id, newPersonInfo)
                    .then(response => {
                        setPersons(persons.map(person => {
                            if(person.id === existingPerson.id) {
                                person = response.data;
                            }
                            return person;
                        }));

                        displayNotification(`Updated ${response.data.name}`, 'SUCCESS');
                    })
                    .catch(error => {
                        displayNotification(`Error in updating the number for ${existingPerson.name}`, 'ERROR');
                    })
            }
        }
    }

    const handleNameChange = (event) => {
        setNewName(event.target.value);
    }

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value);
    }

    const deletePerson = (id, name) => {
        const result = window.confirm(`Delete ${name}`);
        if(result) {
            personsService
            .deleteOne(id)
            .then(response => {
                setPersons(persons.filter(person => person.id !== id));
                displayNotification(`Deleted ${name}`, 'INFO');
            })
            .catch(error => {
                displayNotification(`Error in deleting the person: ${error}`, 'ERROR');
            });
        }
    }

    const updateSearchResults = () => {
        const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(searchName.toLowerCase()));
        return filteredPersons.map(person => (<p key={person.id}>{person.name} {person.number} <button onClick={() => deletePerson(person.id, person.name)}>delete</button></p>));
    }

    const handleSearchNameChange = (event) => {
        setNewSearchName(event.target.value);
    }

    return (
        <div>
            <h2>Phonebook</h2>

            <Filter searchName={searchName} handleSearchNameChange={handleSearchNameChange}/>

            <h3>add a new</h3>
            <Notification message={notificationMessage} type={notificationType}/>
            <PersonForm submitForm={submitForm} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />

            <h2>Numbers</h2>
            <Persons updateSearchResults={updateSearchResults} />
        </div>
    );
}

export default App;
