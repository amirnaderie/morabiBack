import { DataSource } from 'typeorm';
import { PermissionSeed } from './entity/permission-seed.entity';

export const createPermissionSeed = async (AppDataSource: DataSource) => {
  try {
    const queryRunner = AppDataSource.createQueryRunner();
    const queryBuilder = AppDataSource.createQueryBuilder();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    await AppDataSource.query(
      `DELETE FROM [permission] DBCC CHECKIDENT ([permission], RESEED, 0)`,
    );

    // const roleRepository = queryRunner.manager.getRepository(RoleSeed);
    await queryBuilder
      .insert()
      .into(PermissionSeed)
      .values([
        { name: 'ایجاد حرکت', enName: 'create-movement' },
        { name: 'ویرایش حرکت', enName: 'update-movement' },
        { name: 'حذف حرکت', enName: 'delete-movement' },
        { name: 'مشاهده حرکت', enName: 'read-movement' },
        { name: 'مشاهده لیست حرکات', enName: 'read-movements' },
        { name: 'ایجاد دسترسی', enName: 'create-permission' },
        { name: 'ویرایش دسترسی', enName: 'update-permission' },
        { name: 'حذف دسترسی', enName: 'delete-permission' },
        { name: 'مشاهده دسترسی', enName: 'read-permission' },
        { name: 'مشاهده لیست دسترسی', enName: 'read-permissions' },
        { name: 'ایجاد نقش', enName: 'create-role' },
        { name: 'ویرایش نقش', enName: 'update-role' },
        { name: 'حذف نقش', enName: 'delete-role' },
        { name: 'مشاهده نقش', enName: 'read-role' },
        { name: 'مشاهده لیست نقش', enName: 'read-roles' },
        { name: 'تغییر دسترسی نقش', enName: 'update-role-permission' },
        { name: 'ایجاد تسک', enName: 'create-task' },
        { name: 'ویرایش تسک', enName: 'update-task' },
        { name: 'حذف تسک', enName: 'delete-task' },
        { name: 'مشاهده لیست تسک', enName: 'read-tasks' },
        { name: 'مشاهده تسک', enName: 'read-task' },
        {
          name: 'توانایی ساخت حرکت پیش‌ فرض',
          enName: 'create-movement-default',
        },
      ])
      .execute();
  } catch (error) {
    throw new Error(error);
  }
};
