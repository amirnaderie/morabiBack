import { DataSource } from 'typeorm';
import { PermissionSeed } from './entity/permission-seed.entity';

(async () => {
  console.log('permissionSeed');
})();

export const createPermissionSeed = async (AppDataSource: DataSource) => {
  try {
    console.info('role seed start...');
    const queryRunner = AppDataSource.createQueryRunner();
    const queryBuilder = AppDataSource.createQueryBuilder();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // const roleRepository = queryRunner.manager.getRepository(RoleSeed);
    await queryBuilder
      .insert()
      .into(PermissionSeed)
      .values([{ name: 'ایجاد حرکت', enName: 'admin' }])
      .execute();

    console.info('role seed finished');
  } catch (error) {
    console.error(error);
  }
};
