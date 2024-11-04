import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { EntityManager } from 'typeorm';
import { IsUniqueConstraintInput } from './is-unique';
import { BadRequestException, Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'IsUnique', async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly entityManager: EntityManager) {}

  async validate(value: any, args?: ValidationArguments): Promise<boolean> {
    const { tableName, column }: IsUniqueConstraintInput = args.constraints[0];

    const field = args.property;
    console.log(args, tableName, column, field, 'pppppp');
    const exists = await this.entityManager
      .getRepository(tableName)
      .createQueryBuilder(tableName)
      .where({ [column]: value })
      .getExists();

    console.log(8989898);

    console.log(exists, 'result');

    return exists ? false : true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    console.log(validationArguments.constraints[0], 'validationArguments');
    const { message }: IsUniqueConstraintInput =
      validationArguments.constraints[0];
    throw new BadRequestException(message);
  }
}
