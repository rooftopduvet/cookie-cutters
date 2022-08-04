import { app } from './app';
import { logger } from './log';
import { AppDataSource } from './db/dataSource';

const PORT = 8000;

AppDataSource.initialize().then(() => {
  logger.info('Database initialized.');
}).catch(() => {
  logger.error('Database could not be initialized.');
});

app.listen(PORT, () => {
  logger.info(`⚡️[server]: Server in running at https://localhost:${PORT}`);
});
