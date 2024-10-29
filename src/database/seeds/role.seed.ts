import { DataSource } from 'typeorm';
import { RoleSeed } from './role-seed.entity';

(async () => {
  console.log('roleSeed');
})();

export const createRoleSeed = async (AppDataSource: DataSource) => {
  try {
    console.info('role seed start...');
    const queryRunner = AppDataSource.createQueryRunner();
    const queryBuilder = AppDataSource.createQueryBuilder();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // const roleRepository = queryRunner.manager.getRepository(RoleSeed);
    await queryBuilder
      .insert()
      .into(RoleSeed)
      .values([
        { name: 'ادمین', enName: 'admin' },
        { name: 'مربی', enName: 'morabi' },
      ])
      .execute();

    console.info('role seed finished');
  } catch (error) {
    console.error(error);
  }
};
