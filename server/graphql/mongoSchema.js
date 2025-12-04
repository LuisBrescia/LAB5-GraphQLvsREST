import { gql } from "apollo-server-express";

export const mongoTypeDefs = gql`
  type MongoUser {
    id: ID
    name: String
    age: Int
  }
  type Query {
    mongoUsers: [MongoUser]
    mongoUser(id: ID!): MongoUser
  }
`;

export const mongoResolvers = (MongoUser) => ({
  Query: {
    mongoUsers: () => MongoUser.find({}, "-__v"),
    mongoUser: (_, { id }) => MongoUser.findOne({ id }),
  },
});
