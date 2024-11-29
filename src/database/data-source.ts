import { DataSource } from 'typeorm';
import { RoleSeed } from './seeds/entity/role-seed.entity';
import { createRoleSeed } from './seeds/role.seed';
import { UserSeed } from './seeds/entity/user-seed.entity';
import { PermissionSeed } from './seeds/entity/permission-seed.entity';
import { createPermissionSeed } from './seeds/permission.seed';
import * as dotenv from 'dotenv';
import { addPermissionToRole } from './seeds/role-permission.seed';
import { createRealmSeed } from './seeds/realm.seed';
import { RealmSeed } from './seeds/entity/realm-seed.entity';
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
  entities: [RoleSeed, UserSeed, PermissionSeed, RealmSeed],
});

AppDataSource.initialize()
  .then(async () => {
    try {
      await createRealmSeed(AppDataSource);
      await createRoleSeed(AppDataSource);
      await createPermissionSeed(AppDataSource);
      await addPermissionToRole(AppDataSource);
      AppDataSource.destroy();
    } catch (error) {
      throw new Error(error);
    }
  })
  .catch((err) => {
    console.error(err);
  });
