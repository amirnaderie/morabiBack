import { DataSource } from 'typeorm';
import { RealmSeed } from './entity/realm-seed.entity';

export const createRealmSeed = async (AppDataSource: DataSource) => {
  try {
    const queryRunner = AppDataSource.createQueryRunner();
    const queryBuilder = AppDataSource.createQueryBuilder();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    await AppDataSource.query(`DELETE FROM [UserRoles]`);
    await AppDataSource.query(
      `DELETE FROM [Role] DBCC CHECKIDENT ([Role], RESEED, 0)`,
    );

    // await AppDataSource.query(`DELETE FROM [form]`);
    // await AppDataSource.query(`DELETE FROM [form-question]`);

    await AppDataSource.query(
      `DELETE FROM [Realm] DBCC CHECKIDENT ([Realm], RESEED, 0)`,
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
