import express from "express";

export default (app, MariaPool) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/maria/users", async (_, res) => {
    const [rows] = await MariaPool.query("SELECT * FROM users");
    res.json(rows);
  });

  app.post("/maria/users", async (req, res) => {
    const users = req.body;
    const values = users.map((u) => [u.name, u.age]);

    const [result] = await MariaPool.query(
      "INSERT INTO users (name, age) VALUES ?",
      [values]
    );

    res.json({
      inserted: result.affectedRows,
      users,
    });
  });

  app.put("/maria/users/:id", async (req, res) => {
    const { id } = req.params;
    const { name, age } = req.body;

    await MariaPool.query("UPDATE users SET name = ?, age = ? WHERE id = ?", [
      name,
      age,
      id,
    ]);

    res.json({ id, updated: true });
  });

  app.delete("/maria/users/:id", async (req, res) => {
    const { id } = req.params;
    await MariaPool.query("DELETE FROM users WHERE id = ?", [id]);
    res.json({ id, deleted: true });
  });
};
