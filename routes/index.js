
const constructorMethod = (app) => {
  app.use('/', authRoutes);
  app.use('/hompage', hompage);
  app.use('/usersettings', usersettings);
  app.use('/boards', boards);
  app.use('/boardsettings', boardsettings);
  app.use('*', (req, res) => {
    res.redirect('/login', loginRoutes).status(404);
  });
};

export default constructorMethod;
