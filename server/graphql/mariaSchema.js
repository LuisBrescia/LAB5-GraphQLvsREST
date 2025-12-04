import { gql } from "apollo-server-express";

export const mariaTypeDefs = gql`
  type MariaUser {
    id: ID
    name: String
    age: Int
  }
  type Query {
    mariaUsers: [MariaUser]
    mariaUser(id: ID!): MariaUser
  }
`;

export const mariaResolvers = (MariaPool) => ({
  Query: {
    mariaUsers: async () => (await MariaPool.query("SELECT * FROM users"))[0],
    mariaUser: async (_, { id }) =>
      (await MariaPool.query("SELECT * FROM users WHERE id = ?", [id]))[0][0],
  },
});
