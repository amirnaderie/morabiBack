import { DataSource } from 'typeorm';
import { RoleSeed } from './entity/role-seed.entity';

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

    await AppDataSource.query(
      `DELETE FROM [role] DBCC CHECKIDENT ([role], RESEED, 0)`,
    );

    await queryBuilder
      .insert()
      .into(RoleSeed)
      .values([
        { name: 'ادمین', enName: 'admin' },
        { name: 'مربی', enName: 'coach' },
        { name: 'ورزشکار', enName: 'athlete' },
      ])
      .execute();

    console.info('role seed finished');
  } catch (error) {
    console.error(error);
  }
};
