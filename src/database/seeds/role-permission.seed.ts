import { DataSource } from 'typeorm';

export const addPermissionToRole = async (ADS: DataSource) => {
  try {
    const queryRunner = ADS.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    await ADS.query(`DELETE FROM [role-permission]`);

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
      '2,47',
      '2,48',
      '2,49',
      '1,47',
      '1,48',
      '1,49',
      '1,50',
    ];

    for (let i = 0; i < arr.length; i++) {
      await ADS.query(
        `INSERT INTO [role-permission] (roleId,permissionId) VALUES(${arr[i]})`,
      );
    }
  } catch (error) {
    throw new Error(error);
  }
};
