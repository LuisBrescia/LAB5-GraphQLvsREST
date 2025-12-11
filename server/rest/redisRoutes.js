import express from "express";
import { randomUUID } from "crypto";

export default (app, Redis) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // GET all users
  app.get("/redis/users", async (_, res) => {
    const keys = await Redis.keys("users:*");
    const users = [];

    for (const key of keys) {
      users.push(await Redis.hGetAll(key));
    }

    res.json(users);
  });

  // INSERT many users
  app.post("/redis/users", async (req, res) => {
    const users = req.body;

    for (const u of users) {
      const id = randomUUID();
      await Redis.hSet(`users:${id}`, {
        id,
        name: u.name,
        age: u.age,
      });
    }

    res.json({ inserted: users.length });
  });

  // UPDATE many users
  app.put("/redis/users", async (req, res) => {
    const users = req.body;

    for (const u of users) {
      await Redis.hSet(`users:${u.id}`, {
        name: u.name,
        age: u.age,
      });
    }

    res.json({ updated: users.length });
  });

  // DELETE many users
  app.delete("/redis/users", async (req, res) => {
    const { ids } = req.body;

    for (const id of ids) {
      await Redis.del(`users:${id}`);
    }

    res.json({ deleted: ids.length });
  });
};
