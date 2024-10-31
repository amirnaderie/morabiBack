import { DataSource } from 'typeorm';
import { PermissionSeed } from './entity/permission-seed.entity';

(async () => {
  console.log('permissionSeed');
})();

export const createPermissionSeed = async (AppDataSource: DataSource) => {
  try {
    console.info('Permission seed start...');
    const queryRunner = AppDataSource.createQueryRunner();
    const queryBuilder = AppDataSource.createQueryBuilder();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // const roleRepository = queryRunner.manager.getRepository(RoleSeed);
    await queryBuilder
      .insert()
      .into(PermissionSeed)
      // movement
      .values([{ name: 'ایجاد حرکت', enName: 'create-movement' }])
      .values([{ name: 'ویرایش حرکت', enName: 'update-movement' }])
      .values([{ name: 'حذف حرکت', enName: 'delete-movement' }])
      .values([{ name: 'مشاهده حرکت', enName: 'read-movement' }])
      .values([{ name: 'مشاهده لیست حرکات', enName: 'read-movements' }])
      // permission
      .values([{ name: 'ایجاد دسترسی', enName: 'create-permission' }])
      .values([{ name: 'ویرایش دسترسی', enName: 'update-permission' }])
      .values([{ name: 'حذف دسترسی', enName: 'delete-permission' }])
      .values([{ name: 'مشاهده دسترسی', enName: 'read-permission' }])
      .values([{ name: 'مشاهده لیست دسترسی', enName: 'read-permissions' }])
      // role
      .values([{ name: 'ایجاد نقش', enName: 'create-role' }])
      .values([{ name: 'ویرایش نقش', enName: 'update-role' }])
      .values([{ name: 'حذف نقش', enName: 'delete-role' }])
      .values([{ name: 'مشاهده نقش', enName: 'read-role' }])
      .values([{ name: 'مشاهده لیست نقش', enName: 'read-roles' }])
      .values([{ name: 'تغییر دسترسی نقش', enName: 'update-role-permission' }])
      // task
      .values([{ name: 'ایجاد تسک', enName: 'create-task' }])
      .values([{ name: 'ویرایش تسک', enName: 'update-task' }])
      .values([{ name: 'حذف تسک', enName: 'delete-task' }])
      .values([{ name: 'مشاهده تسک', enName: 'read-task' }])
      .values([{ name: 'مشاهده لیست تسک', enName: 'read-tasks' }])

      .execute();

    console.info('role seed finished');
  } catch (error) {
    console.error(error);
  }
};
