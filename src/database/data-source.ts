import { DataSource } from 'typeorm';
import { RoleSeed } from './seeds/entity/role-seed.entity';
import { createRoleSeed } from './seeds/role.seed';
import { UserSeed } from './seeds/entity/user-seed.entity';
import { PermissionSeed } from './seeds/entity/permission-seed.entity';
import { createPermissionSeed } from './seeds/permission.seed';

const AppDataSource = new DataSource({
  type: 'mssql',
  host: 'localhost',
  port: 1433,
  username: 'sa',
  password: 'arman123456#A',
  database: 'morabi_db',
  options: { trustServerCertificate: true },
  synchronize: true,
  entities: [RoleSeed, UserSeed, PermissionSeed],
});

AppDataSource.initialize()
  .then(async () => {
    console.log('seed started!');

    await createRoleSeed(AppDataSource);
    await createPermissionSeed(AppDataSource);

    AppDataSource.destroy();
    console.log('seed finish!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
