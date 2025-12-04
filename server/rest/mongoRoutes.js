import express from "express";

export default (app, MongoUser) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/mongo/users", async (_, res) => {
    res.json(await MongoUser.find({}, "-__v"));
  });

  app.post("/mongo/users", async (req, res) => {
    res.json(await MongoUser.insertMany(req.body));
  });

  app.put("/mongo/users", async (req, res) => {
    const users = req.body;

    const ops = users.map((u) => ({
      updateOne: {
        filter: { _id: u.id },
        update: { $set: { name: u.name, age: u.age } },
      },
    }));

    const result = await MongoUser.bulkWrite(ops);

    res.json({
      updatedCount: result.modifiedCount,
      requested: users.length,
    });
  });

  app.delete("/mongo/users", async (req, res) => {
    await MongoUser.deleteMany({ _id: { $in: req.body.ids } });
    res.json({ deleted: req.body.ids.length });
  });
};
