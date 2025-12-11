import express from "express";
import { ApolloServer } from "apollo-server-express";

import { connectMariaDB } from "./db/mariadb.js";
import { connectMongo } from "./db/mongodb.js";
import { connectRedis } from "./db/redis.js";

import mongoRoutes from "./rest/mongoRoutes.js";
import mariaRoutes from "./rest/mariaRoutes.js";
import redisRoutes from "./rest/redisRoutes.js";

import { mongoTypeDefs, mongoResolvers } from "./graphql/mongoSchema.js";
import { mariaTypeDefs, mariaResolvers } from "./graphql/mariaSchema.js";
import { redisTypeDefs, redisResolvers } from "./graphql/redisSchema.js";

const app = express();

// DB connections
const MongoUser = await connectMongo();
const MariaPool = await connectMariaDB();
const Redis = await connectRedis();

// REST
mongoRoutes(app, MongoUser);
mariaRoutes(app, MariaPool);
redisRoutes(app, Redis);

// GraphQL
const server = new ApolloServer({
  typeDefs: [mongoTypeDefs, mariaTypeDefs, redisTypeDefs],
  resolvers: [
    mongoResolvers(MongoUser),
    mariaResolvers(MariaPool),
    redisResolvers(Redis),
  ],
});
await server.start();
server.applyMiddleware({ app, path: "/graphql" });

app.listen(4000, () => {
  console.log("🌐 REST MONGO → http://localhost:4000/mongo/users");
  console.log("🌐 REST MARIA → http://localhost:4000/maria/users");
  console.log("🌐 REST REDIS → http://localhost:4000/redis/users");
  console.log("🔱 GraphQL →    http://localhost:4000/graphql");
});
