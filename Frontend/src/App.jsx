import { useState, useEffect } from 'react'
// import axios from 'axios'
import Filter from './components/FIlter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import PhonebookService from './services/PhonebookService';
import Notification from './components/Notification'
import Error from './components/Error';

const App = () => {
  useEffect(() => {
    PhonebookService.getAll()
      .then(data => {
        setPersons(data)
      }).catch(() => {
        setErrorMessageHandle(`Failed to catch the phonebook from the server`);
      })
  }, [])
  
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  }

  const deleteEntry = (id) => {
    const deletePerson = persons.find(person => person.id === id);
    if(window.confirm(`Delete ${deletePerson.name}`))
    PhonebookService.remove(id).then(() => {
      setPersons(persons.filter(person => person.id !== id));
    }).catch(() => {
      setErrorMessageHandle(`${deletePerson.name} already deleted`);
      setPersons(persons.filter(person => person.id !== id));
    })
  }

  const setNotificationMessageHandle = message => {
    setNotificationMessage(message);
    setTimeout(() => setNotificationMessage(null), 2000);
  }

  const setErrorMessageHandle = message => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 5000);
  }

  const addEntry = (event) => {
    event.preventDefault();
    if (persons.find(person => person.name === newName)){
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const personEdit = persons.find(person => person.name === newName);
        PhonebookService.update(personEdit.id, { ...personEdit, number: newNumber }).then(data => {
          setPersons(persons.map(person => person.name === data.name ? data : person));
          setNotificationMessageHandle(`Updated ${data.name}`);
          setNewName('');
          setNewNumber('');
        }).catch(error => {
          setErrorMessageHandle(error.response.data.error)
        })
      }
    }
    else {
      PhonebookService.create({ name: newName, number: newNumber })
      .then(data => {
        setPersons(persons.concat(data));
        setNotificationMessageHandle(`Added ${data.name}`);
        setNewName('');
        setNewNumber('');
      }).catch(error => {
        setErrorMessageHandle(error.response.data.error)
      })
    }
  }

  const filterdPersons = persons.filter(person => person.name.toLowerCase().includes(filter.toLocaleLowerCase()));

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage}/>
      <Error message={errorMessage}/>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm addEntry={addEntry} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} newName={newName} newNumber={newNumber} />
      <h2>Numbers</h2>
      <Persons filterdPersons={filterdPersons}  deleteEntry={deleteEntry} />
    </div>
  )
}

export default App