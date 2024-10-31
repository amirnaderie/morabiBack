import { DataSource } from 'typeorm';

(async () => {
  console.log('roleSeed');
})();

export const addPermissionToRole = async (AppDataSource: DataSource) => {
  try {
    console.info('role seed start...');

    const queryRunner = AppDataSource.createQueryRunner();
    // const queryBuilder = AppDataSource.createQueryBuilder();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    await AppDataSource.query(
      `DELETE FROM [role-permission] DBCC CHECKIDENT ([role-permission], RESEED, 0)`,
    );

    await AppDataSource.query(
      `INSERT INTO role-permission (roleId,permisionId) VALUES(1,1) `,
    );

    console.info('role seed finished');
  } catch (error) {
    console.error(error);
  }
};
