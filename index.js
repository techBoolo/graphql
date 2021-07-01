const { ApolloServer, gql } = require('apollo-server');

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
    name: "Arto hellas",
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

  type Query {
    personCount: Int!
    allPersons: [Person!]!
    findPerson(name: String!): Person
  }
`
const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons,
    findPerson: (root, args) => 
      persons.find(p => p.name === args.name)
  },
  Person: {
    name: (root) => root.name.toUpperCase(),
    phone: (root) => root.phone,
    id: (root) => root.id,
    address: (root) => {
      return {
        street: root.street,
        city: root.city
      }
    },
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
