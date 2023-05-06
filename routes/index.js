import authRoutes from './auth.js';
import homepageRoutes from './homepage.js';
import usersettingsRoutes from './userSettings.js';
import boardRoutes from './boards.js';
import boardsettingsRoutes from './boardsSettings.js';

const constructorMethod = (app) => {
  app.use('/homepage', homepageRoutes);
  app.use('/usersettings', usersettingsRoutes);
  app.use('/board', boardRoutes);
  app.use('/boardsettings', boardsettingsRoutes);
  app.use('/', authRoutes);
  app.use('*', (req, res) => {
    res.status(404).json({error: 'Route Not found'});;
  });
};

export default constructorMethod;
