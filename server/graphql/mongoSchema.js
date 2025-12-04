import { gql } from "apollo-server-express";

export const mongoTypeDefs = gql`
  # =========================================
  # TYPES
  # =========================================
  type MongoUser {
    id: ID!
    name: String
    age: Int
  }

  # =========================================
  # INPUTS
  # =========================================
  input MongoUserInput {
    name: String!
    age: Int!
  }

  input MongoUserUpdateInput {
    id: ID!
    name: String
    age: Int
  }

  # =========================================
  # QUERIES
  # =========================================
  type Query {
    mongoUsers: [MongoUser]
    mongoUser(id: ID!): MongoUser
  }

  # =========================================
  # MUTATIONS (✔ CREATE / UPDATE / DELETE)
  # =========================================
  type Mutation {
    mongoAddMany(users: [MongoUserInput!]!): [MongoUser!]!
    mongoUpdateMany(users: [MongoUserUpdateInput!]!): Int!
    mongoDeleteMany(ids: [ID!]!): Int!
  }
`;

export const mongoResolvers = (MongoUser) => ({
  Query: {
    mongoUsers: async () => MongoUser.find({}, "-__v"),
    mongoUser: async (_, { id }) => MongoUser.findById(id, "-__v"),
  },

  Mutation: {
    mongoAddMany: async (_, { users }) => {
      const docs = await MongoUser.insertMany(users);
      return docs; // já retorna [{id,name,age...}]
    },

    mongoUpdateMany: async (_, { users }) => {
      if (!users.length) return 0;

      const operations = users.map((u) => ({
        updateOne: {
          filter: { _id: u.id },
          update: { $set: u },
        },
      }));

      const result = await MongoUser.bulkWrite(operations);
      return result.modifiedCount;
    },

    mongoDeleteMany: async (_, { ids }) => {
      const result = await MongoUser.deleteMany({ _id: { $in: ids } });
      return result.deletedCount;
    },
  },
});
