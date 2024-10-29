import { DataSource } from 'typeorm';
import { RoleSeed } from './seeds/role-seed.entity';
import { roleSeed } from './seeds/role.seed';

const AppDataSource = new DataSource({
  type: 'mssql',
  host: 'localhost',
  port: 1433,
  username: 'sa',
  password: 'arman123456#A',
  database: 'morabi_db',
  options: { encrypt: false },
  entities: [RoleSeed],
});

AppDataSource.initialize()
  .then(async () => {
    console.log('seed started!');
    await roleSeed(AppDataSource);
    AppDataSource.destroy();
    console.log('seed finish!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
