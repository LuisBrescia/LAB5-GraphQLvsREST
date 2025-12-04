import express from "express";
import { ApolloServer } from "apollo-server-express";

import { connectMariaDB } from "./db/mariadb.js";
import { connectMongo } from "./db/mongodb.js";

import mongoRoutes from "./rest/mongoRoutes.js";
import mariaRoutes from "./rest/mariaRoutes.js";

import { mongoTypeDefs, mongoResolvers } from "./graphql/mongoSchema.js";
import { mariaTypeDefs, mariaResolvers } from "./graphql/mariaSchema.js";

const app = express();

const MongoUser = await connectMongo();
const MariaPool = await connectMariaDB();

// REST
mongoRoutes(app, MongoUser);
mariaRoutes(app, MariaPool);

// GraphQL
const server = new ApolloServer({
  typeDefs: [mongoTypeDefs, mariaTypeDefs],
  resolvers: [mongoResolvers(MongoUser), mariaResolvers(MariaPool)],
});
await server.start();
server.applyMiddleware({ app, path: "/graphql" });

app.listen(4000, () => {
  console.log("🌐 REST MONGO → http://localhost:4000/mongo/users");
  console.log("🌐 REST MARIA → http://localhost:4000/maria/users");
  console.log("🔱 GraphQL →    http://localhost:4000/graphql");
});
