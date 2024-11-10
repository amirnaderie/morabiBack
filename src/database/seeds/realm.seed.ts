import { DataSource } from 'typeorm';
import { RoleSeed } from './entity/role-seed.entity';
import { RealmSeed } from './entity/realm-seed.entity';

export const createRoleSeed = async (AppDataSource: DataSource) => {
  try {
    const queryRunner = AppDataSource.createQueryRunner();
    const queryBuilder = AppDataSource.createQueryBuilder();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    await AppDataSource.query(
      `DELETE FROM [realm] DBCC CHECKIDENT ([realm], RESEED, 0)`,
    );

    await queryBuilder
      .insert()
      .into(RealmSeed)
      .values([{ name: 'panel' }])
      .execute();
  } catch (error) {
    throw new Error(error);
  }
};
