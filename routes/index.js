import authRoutes from './auth.js';
import hompageRoutes from './hompage.js';
import usersettingsRoutes from './userSettings.js';
import boardRoutes from './boards.js';
import boardsettingsRoutes from './boardsSettings.js';

const constructorMethod = (app) => {
  app.use('/', authRoutes);
  app.use('/hompage', hompageRoutes);
  app.use('/usersettings', usersettingsRoutes);
  app.use('/board', boardRoutes);
  app.use('/boardsettings', boardsettingsRoutes);
  app.use('*', (req, res) => {
    res.redirect('/', authRoutes);
  });
};

export default constructorMethod;
