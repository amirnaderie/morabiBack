import { User } from '../entities/user.entity';
import { Profile } from '../entities/profile.entity';
import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateProfileDto } from '../dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async get(user: User): Promise<Profile> {
    return await this.profileRepository.findOne({
      where: {
        userId: user.id,
      },
    });
  }

  async create(payload: { name: string; family: string; userId: string }) {
    const profile = this.profileRepository.create({
      name: payload.name,
      family: payload.family,
      userId: payload.userId,
    });

    return await this.profileRepository.save(profile);
  }

  async update(
    updateProfiletDto: UpdateProfileDto,
    user: User,
  ): Promise<Profile> {
    const {
      info,
      name,
      family,
      height,
      weight,
      birthdate,
      sportsBackground,
      descriptionDisease,
    } = updateProfiletDto;

    const profile = await this.profileRepository.findOne({
      where: {
        userId: user.id,
      },
    });
    if (!profile) throw new NotFoundException('پروفایل کاربری شما یافت نشد!');
    if (info) profile.info = info;
    if (name) profile.name = name;
    if (family) profile.family = family;
    if (height) profile.height = height;
    if (weight) profile.weight = weight;
    if (birthdate) profile.birthdate = birthdate;
    if (sportsBackground) profile.sportsBackground = sportsBackground;
    if (descriptionDisease) profile.descriptionDisease = descriptionDisease;

    return await this.profileRepository.save(profile);
  }
}
