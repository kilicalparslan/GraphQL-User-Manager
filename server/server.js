import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const users = [
  { id: "1", name: "John Doe", age: 30, isMarried: true },
  { id: "2", name: "Jane Smith", age: 25, isMarried: false },
  { id: "3", name: "Alice Johnson", age: 28, isMarried: true },
  { id: "4", name: "Bob Brown", age: 35, isMarried: false },
  { id: "5", name: "Charlie Davis", age: 40, isMarried: true },
];

const typeDefs = `#graphql
  type Query {
    getUsers: [User]
    getUserById(id: ID!): User
  }

    type Mutation {
    addUser(name: String!, age: Int!, isMarried: Boolean!): User
    deleteUser(id: ID!): User
  }

    type User {
    id: ID
    name: String
    age: Int
    isMarried: Boolean
    }
`;

const resolvers = {
  Query: {
    getUsers: () => users,
    getUserById: (_, args) => users.find((user) => user.id === args.id),
  },
  Mutation: {
    addUser: (_, args) => {
      const newUser = { id: `${users.length + 1}`, ...args };
      users.push(newUser);
      return newUser;
    },
    deleteUser: (_, args) => {
      const userIndex = users.findIndex((user) => user.id === args.id);
      if (userIndex === -1) return null;
      const deletedUser = users.splice(userIndex, 1)[0];
      return deletedUser;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});
