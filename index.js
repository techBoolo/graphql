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
  type Person {
    name: String!
    phone: String
    street: String!
    city: String!
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
    street: (root) => root.street,
    city: (root) => root.city,
    id: (root) => root.id
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
