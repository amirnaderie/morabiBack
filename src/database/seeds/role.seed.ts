import { DataSource } from 'typeorm';
import { RoleSeed } from './role-seed.entity';

(async () => {
  console.log('roleSeed');
})();

export const roleSeed = async (AppDataSource: DataSource) => {
  try {
    console.info('role seed start...');
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const roleRepository = queryRunner.manager.getRepository(RoleSeed);

    const roles = await roleRepository.find();
    console.log(roles, 'dd');
    console.info('role seed finished');
  } catch (error) {
    console.error(error);
  }
};
