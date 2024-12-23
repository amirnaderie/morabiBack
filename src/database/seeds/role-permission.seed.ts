import { DataSource } from 'typeorm';

export const addPermissionToRole = async (ADS: DataSource) => {
  try {
    const queryRunner = ADS.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    await ADS.query(`DELETE FROM [RolePermission]`);

    //  first number is roleId
    //  second number is permissionId
    const arr = [
      '1,1',
      '1,2',
      '1,3',
      '1,4',
      '1,5',
      '1,6',
      '1,7',
      '1,8',
      '1,9',
      '1,10',
      '1,11',
      '1,12',
      '1,13',
      '1,14',
      '1,15',
      '1,16',
      '1,17',
      '1,18',
      '1,19',
      '1,20',
      '1,21',
      '1,22',
      '1,23',
      '1,24',
      '1,25',
      '1,26',
      '1,27',
      '1,28',
      '1,29',
      '1,30',
      '1,31',
      '1,32',
      '1,33',
      '1,34',
      '1,35',
      '1,36',
      '1,37',
      '1,38',
      '1,39',
      '1,40',
      '1,41',
      '1,42',
      '1,43',
      '1,44',
      '1,45',
      '2,1',
      '2,2',
      '2,3',
      '2,4',
      '2,5',
      '2,6',
      '2,7',
      '2,8',
      '2,9',
      '2,10',
      '2,11',
      '2,12',
      '2,13',
      '2,14',
      '2,15',
      '2,16',
      '2,17',
      '2,18',
      '2,19',
      '2,20',
      '2,21',
      '2,22',
      '2,23',
      '2,25',
      '2,26',
      '2,28',
      '2,29',
      '2,30',
      '2,31',
      '2,32',
      '2,33',
      '2,34',
      '2,35',
      '2,36',
      '2,37',
      '2,38',
      '2,39',
      '2,40',
      '2,41',
      '2,42',
      '2,43',
      '2,44',
      '2,45',
      '1,46',
      '1,47',
      '1,48',
    ];

    for (let i = 0; i < arr.length; i++) {
      await ADS.query(
        `INSERT INTO [RolePermission] (roleId,permissionId) VALUES(${arr[i]})`,
      );
    }
  } catch (error) {
    throw new Error(error);
  }
};
