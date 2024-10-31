import { DataSource } from 'typeorm';
import { RoleSeed } from './seeds/entity/role-seed.entity';
import { createRoleSeed } from './seeds/role.seed';
import { UserSeed } from './seeds/entity/user-seed.entity';
import { PermissionSeed } from './seeds/entity/permission-seed.entity';
import { createPermissionSeed } from './seeds/permission.seed';
import * as dotenv from 'dotenv';
import { addPermissionToRole } from './seeds/role-permission.seed';
const env = dotenv.config({ path: '.env.dev' }).parsed;
const AppDataSource = new DataSource({
  type: 'mssql',
  host: env.DB_HOST,
  port: parseInt(env.DB_PORT),
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  options: { trustServerCertificate: true },
  synchronize: true,
  entities: [RoleSeed, UserSeed, PermissionSeed],
});

AppDataSource.initialize()
  .then(async () => {
    console.log('seed started!');

    await createRoleSeed(AppDataSource);
    await createPermissionSeed(AppDataSource);
    await addPermissionToRole(AppDataSource);

    AppDataSource.destroy();
    console.log('seed finish!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
