import { gql } from "apollo-server-express";

export const mariaTypeDefs = gql`
  # =========================================
  # TYPES
  # =========================================
  type MariaUser {
    id: ID!
    name: String
    age: Int
  }

  # =========================================
  # INPUTS
  # =========================================
  input MariaUserInput {
    name: String!
    age: Int!
  }

  input MariaUserUpdateInput {
    id: ID!
    name: String
    age: Int
  }

  # =========================================
  # QUERIES
  # =========================================
  type Query {
    mariaUsers: [MariaUser]
    mariaUser(id: ID!): MariaUser
  }

  # =========================================
  # MUTATIONS (✔ CREATE / UPDATE / DELETE)
  # =========================================
  type Mutation {
    mariaAddMany(users: [MariaUserInput!]!): [MariaUser!]!
    mariaUpdateMany(users: [MariaUserUpdateInput!]!): Int!
    mariaDeleteMany(ids: [ID!]!): Int!
  }
`;

export const mariaResolvers = (MariaPool) => ({
  Query: {
    mariaUsers: async () => (await MariaPool.query("SELECT * FROM users"))[0],

    mariaUser: async (_, { id }) =>
      (await MariaPool.query("SELECT * FROM users WHERE id = ?", [id]))[0][0],
  },

  Mutation: {
    // =============================================================
    // CREATE MANY
    // =============================================================
    mariaAddMany: async (_, { users }) => {
      const values = users.map((u) => [u.name, u.age]);

      await MariaPool.query("INSERT INTO users (name, age) VALUES ?", [values]);

      const [rows] = await MariaPool.query(
        "SELECT * FROM users ORDER BY id DESC LIMIT ?",
        [users.length]
      );

      return rows.reverse();
    },

    // =============================================================
    // UPDATE MANY (somente os campos enviados)
    // =============================================================
    mariaUpdateMany: async (_, { users }) => {
      let count = 0;

      for (const u of users) {
        const fields = [];
        const params = [];

        if (u.name !== undefined) {
          fields.push("name=?");
          params.push(u.name);
        }
        if (u.age !== undefined) {
          fields.push("age=?");
          params.push(u.age);
        }

        params.push(u.id);

        const [res] = await MariaPool.query(
          `UPDATE users SET ${fields.join(", ")} WHERE id=?`,
          params
        );

        count += res.affectedRows;
      }
      return count;
    },

    // =============================================================
    // DELETE MANY
    // =============================================================
    mariaDeleteMany: async (_, { ids }) => {
      const placeholders = ids.map(() => "?").join(",");
      const [res] = await MariaPool.query(
        `DELETE FROM users WHERE id IN (${placeholders})`,
        ids
      );
      return res.affectedRows;
    },
  },
});
