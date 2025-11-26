import express from "express";
import { ApolloServer, gql } from "apollo-server-express";

const app = express();

const users = [
  { id: 1, name: "Alice", age: 21 },
  { id: 2, name: "Bob", age: 30 },
  { id: 3, name: "Charlie", age: 25 },
  { id: 4, name: "David", age: 35 },
  { id: 5, name: "Eve", age: 28 },
  { id: 6, name: "Frank", age: 40 },
  { id: 7, name: "Grace", age: 22 },
  { id: 8, name: "Henry", age: 31 },
  { id: 9, name: "Ivy", age: 29 },
  { id: 10, name: "Jack", age: 38 },
  { id: 11, name: "Kelly", age: 24 },
  { id: 12, name: "Liam", age: 33 },
  { id: 13, name: "Mia", age: 27 },
  { id: 14, name: "Noah", age: 36 },
  { id: 15, name: "Olivia", age: 20 },
  { id: 16, name: "Peter", age: 45 },
  { id: 17, name: "Quinn", age: 26 },
  { id: 18, name: "Riley", age: 32 },
  { id: 19, name: "Sam", age: 37 },
  { id: 20, name: "Tara", age: 23 },
];

app.get("/rest/users", (req, res) => {
  res.json(users);
});

app.get("/rest/users/:id", (req, res) => {
  const user = users.find((u) => u.id === Number(req.params.id));
  res.json(user || {});
});

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    age: Int!
  }

  type Query {
    users: [User]
    user(id: ID!): User
  }
`;

const resolvers = {
  Query: {
    users: () => users,
    user: (_, { id }) => users.find((u) => u.id === id),
  },
};

async function startServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });

  app.listen(4000, () => {
    console.log("🚀 REST disponível em http://localhost:4000/rest/users");
    console.log("🚀 GraphQL disponível em http://localhost:4000/graphql");
  });
}

await startServer();
