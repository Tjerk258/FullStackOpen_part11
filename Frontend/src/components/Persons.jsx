
const Delete = ({person, deleteEntry}) => (
    <button onClick={() => deleteEntry(person.id)}>delete</button>
)

const Person = ({ person, deleteEntry }) => (
    <div key={person.id}>{person.name}: {person.number} <Delete key={person.id} person={person} deleteEntry={deleteEntry}/></div>
)


const Persons = ({ filterdPersons, deleteEntry }) => (
    <div>
        {filterdPersons.map(person => <Person key={person.id} person={person} deleteEntry={deleteEntry}/>)}
    </div>
)

export default Persons