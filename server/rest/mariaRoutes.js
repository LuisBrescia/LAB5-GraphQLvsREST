export default (app, MariaPool) => {
  app.get("/maria/users", async (_, res) => {
    const [rows] = await MariaPool.query("SELECT * FROM users");
    res.json(rows);
  });

  app.get("/maria/users/:id", async (req, res) => {
    const [rows] = await MariaPool.query("SELECT * FROM users WHERE id = ?", [
      req.params.id,
    ]);
    res.json(rows[0] || {});
  });
};
