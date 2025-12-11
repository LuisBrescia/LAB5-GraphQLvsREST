import { gql } from "apollo-server-express";

export const redisTypeDefs = gql`
  type RedisUser {
    id: ID!
    name: String
    age: Int
  }

  input RedisUserInput {
    name: String!
    age: Int!
  }

  input RedisUserUpdateInput {
    id: ID!
    name: String
    age: Int
  }

  type Query {
    redisUsers: [RedisUser]
  }

  type Mutation {
    redisAddMany(users: [RedisUserInput!]!): [RedisUser!]!
    redisUpdateMany(users: [RedisUserUpdateInput!]!): Int!
    redisDeleteMany(ids: [ID!]!): Int!
  }
`;

export const redisResolvers = (redis) => ({
  Query: {
    redisUsers: async () => {
      const ids = await redis.lRange("users", 0, -1);

      return Promise.all(
        ids.map(async (id) => {
          const data = await redis.hGetAll(`user:${id}`);
          return { id, name: data.name, age: Number(data.age) };
        })
      );
    },
  },

  Mutation: {
    redisAddMany: async (_, { users }) => {
      let nextId = Number(await redis.get("nextUserId")) || 1;

      const created = [];

      for (const u of users) {
        const id = nextId++;
        await redis.hSet(`user:${id}`, {
          name: u.name,
          age: u.age.toString(),
        });
        await redis.rPush("users", id.toString());
        created.push({ id, ...u });
      }

      await redis.set("nextUserId", nextId);

      return created;
    },

    redisUpdateMany: async (_, { users }) => {
      for (const u of users) {
        await redis.hSet(`user:${u.id}`, {
          name: u.name,
          age: u.age.toString(),
        });
      }
      return users.length;
    },

    redisDeleteMany: async (_, { ids }) => {
      for (const id of ids) {
        await redis.del(`user:${id}`);
        await redis.lRem("users", 0, id.toString());
      }
      return ids.length;
    },
  },
});
