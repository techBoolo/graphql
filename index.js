const { ApolloServer, gql } = require('apollo-server');
const { v1: uuid } = require('uuid');

let persons = [
  {
    name: "Arto hellas",
    phone: "040-123543",
    street: "Topiolank",
    city: "Espoo",
    id: 1
  },
  {
    name: "Matti",
    phone: "040-432234",
    street: "Malminkaari",
    city: "Helsinki",
    id: 2
  },
  {
    name: "hellas",
    street: "Nallena",
    city: "Helsinki",
    id: 3
  }
]

const typeDefs = gql`
  type Address {
    street: String!
    city: String!
  }

  type Person {
    name: String!
    phone: String
    address: Address!
    id: ID!
  }

  type Mutation {
    addPerson(
       name: String!
       phone: String
       street: String!
       city: String!
    ): Person
    editNumber(
      name: String!
      phone: String!
    ): Person
  }

  enum YesNo {
    YES
    NO
  }
  type Query {
    personCount: Int!
    allPersons(phone: YesNo): [Person!]!
    findPerson(name: String!): Person
  }
`
const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: (root, args) => {
      if(!args.phone) {
        return persons
      }
      const byPhone = (person) => 
        args.phone === 'YES' 
          ? person.phone 
          : !person.phone

      return persons.filter(byPhone)
    },

    findPerson: (root, args) => 
      persons.find(p => p.name === args.name)
  },
  Person: {
    name: (root) => root.name,
    phone: (root) => root.phone,
    id: (root) => root.id,
    address: (root) => {
      return {
        street: root.street,
        city: root.city
      }
    }
  },
  Mutation: {
    addPerson: (root, args) => {
      if(persons.find(p => p.name === args.name)){
        throw new Error('Name must be unique', { invalidArgs: args.name })
      }
      const person = { ...args, id: uuid() }
      persons = [ ...persons, person ];
      return person
    },
    editNumber: (root, args) => {
      const person = persons.find(p => p.name === args.name);
      if(!person) {
        return null
      };

      const updatedPerson = { ...person, phone: args.phone };
      persons = persons.map(p => p.name === args.name ? updatedPerson : p)
      return updatedPerson
    }
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
