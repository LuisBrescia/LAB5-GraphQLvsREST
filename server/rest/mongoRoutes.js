export default (app, MongoUser) => {
  app.get("/mongo/users", async (req, res) => {
    res.json(await MongoUser.find({}, "-__v"));
  });

  app.get("/mongo/users/:id", async (req, res) => {
    res.json(await MongoUser.findOne({ id: req.params.id }));
  });
};
