
import boardRoutes from './boards.js';

const constructorMethod = (app) => {
  app.use('/', boardRoutes);
  app.use('*', (req, res) => {
    res.status(404).json({error: 'Route Not found'});
  });
};

export default constructorMethod;
