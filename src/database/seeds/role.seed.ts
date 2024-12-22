import { DataSource } from 'typeorm';
import { RoleSeed } from './entity/role-seed.entity';

export const createRoleSeed = async (AppDataSource: DataSource) => {
  try {
    const queryRunner = AppDataSource.createQueryRunner();
    const queryBuilder = AppDataSource.createQueryBuilder();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    await AppDataSource.query(
      `DELETE FROM [Role] DBCC CHECKIDENT ([Role], RESEED, 0)`,
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
  } catch (error) {
    throw new Error(error);
  }
};
