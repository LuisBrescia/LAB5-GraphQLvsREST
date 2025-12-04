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

  app.put("/maria/users", async (req, res) => {
    const { users } = req.body;
    if (!Array.isArray(users) || users.length === 0)
      return res
        .status(400)
        .json({ error: "Envie um array de usuários para atualizar!" });

    const ids = users.map((u) => u.id).join(",");

    const nameCase = users
      .map((u) => `WHEN ${u.id} THEN '${u.name}'`)
      .join(" ");
    const ageCase = users.map((u) => `WHEN ${u.id} THEN ${u.age}`).join(" ");

    const sql = `
    UPDATE users
    SET 
      name = CASE id ${nameCase} END,
      age = CASE id ${ageCase} END
    WHERE id IN (${ids})
  `;

    const [result] = await MariaPool.query(sql);

    res.json({
      updatedCount: result.affectedRows,
      ids: users.map((u) => u.id),
    });
  });

  app.delete("/maria/users", async (req, res) => {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "Envie um array de ids!" });
    }

    const placeholders = ids.map(() => "?").join(",");
    const sql = `DELETE FROM users WHERE id IN (${placeholders})`;

    const [result] = await MariaPool.query(sql, ids);

    res.json({
      deletedCount: result.affectedRows,
      ids,
    });
  });
};
