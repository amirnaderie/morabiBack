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
        { name: 'ایجاد حرکت', enName: 'create-movement' }, // 1
        { name: 'ویرایش حرکت', enName: 'update-movement' },
        { name: 'حذف حرکت', enName: 'delete-movement' },
        { name: 'مشاهده حرکت', enName: 'movement' },
        { name: 'مشاهده لیست حرکات', enName: 'movements' }, // 5
        { name: 'ایجاد دسترسی', enName: 'create-permission' },
        { name: 'ویرایش دسترسی', enName: 'update-permission' },
        { name: 'حذف دسترسی', enName: 'delete-permission' },
        { name: 'مشاهده دسترسی', enName: 'read-permission' },
        { name: 'مشاهده لیست دسترسی', enName: 'read-permissions' }, // 10
        { name: 'ایجاد نقش', enName: 'create-role' },
        { name: 'ویرایش نقش', enName: 'update-role' },
        { name: 'حذف نقش', enName: 'delete-role' },
        { name: 'مشاهده نقش', enName: 'read-role' },
        { name: 'مشاهده لیست نقش', enName: 'read-roles' }, // 15
        { name: 'تغییر دسترسی نقش', enName: 'update-role-permission' },
        { name: 'مشاهده منوی حرکات', enName: 'movements' },
        { name: 'مشاهده حرکت', enName: 'movement' },
        { name: 'مشاهده برنامه ها', enName: 'plans' },
        { name: 'مشاهده برنامه', enName: 'plan' }, // 20
        { name: 'مشاهده منوی ورزشکاران', enName: 'athletes' },
        { name: 'مشاهده ورزشکار', enName: 'athlete' },
        { name: 'مشاهده منوی پکیج ها', enName: 'packages' },
        { name: 'مشاهده پکیج', enName: 'package' },
        { name: 'مشاهده منوی فرم های ابتدایی', enName: 'elementary' }, // 25
        { name: 'مشاهده منوی فرم های کنترل', enName: 'control' },
        {
          name: 'توانایی ساخت حرکت پیش‌ فرض',
          enName: 'create-movement-default',
        },
        { name: 'ایجاد فرم', enName: 'create-form' },
        { name: 'مشاهده فرم', enName: 'read-form' },
        { name: 'ویرایش فرم', enName: 'update-form' }, // 30
        { name: 'حذف فرم', enName: 'delete-form' },
        { name: 'مشاهده لیست فرم‌ها', enName: 'forms' },

        { name: 'ایجاد سوال فرم‌ها', enName: 'create-formQuestion' },
        { name: 'مشاهده سوال فرم‌ها', enName: 'read-formQuestion' },
        { name: 'ویرایش سوال فرم‌ها', enName: 'update-formQuestion' }, // 35
        { name: 'حذف سوال فرم‌ها', enName: 'delete-formQuestion' },
        { name: 'مشاهده لیست سوالات فرم‌ها', enName: 'form-questions' },

        { name: 'ایجاد پاسخ سوال فرم‌ها', enName: 'create-formQuestionAnswer' },
        { name: 'مشاهده پاسخ سوال فرم‌ها', enName: 'read-formQuestionAnswer' },
        {
          name: 'ویرایش پاسخ سوال فرم‌ها',
          enName: 'update-formQuestionAnswer', // 40
        },
        { name: 'حذف پاسخ سوال فرم‌ها', enName: 'delete-formQuestionAnswer' },
        {
          name: 'مشاهده لیست پاسخ سوالات فرم‌ها',
          enName: 'form-questions-answer',
        },
        { name: 'ایجاد برنامه', enName: 'create-plan' },
        { name: 'ویرایش برنامه', enName: 'update-plan' },
        { name: 'حذف برنامه', enName: 'delete-plan' }, // 45
        // {
        //   name: 'مربی لیست ورزشکاران خود را ببیند',
        //   enName: 'mentor-read-athletes',
        // },
      ])
      .execute();
  } catch (error) {
    throw new Error(error);
  }
};
