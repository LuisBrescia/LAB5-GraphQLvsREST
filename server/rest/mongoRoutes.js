export default (app, MongoUser) => {
  app.get("/mongo/users", async (req, res) => {
    res.json(await MongoUser.find({}, "-__v"));
  });
};
