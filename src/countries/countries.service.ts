import { UpdateCountryDto } from './dto/updade-country.dto';
import { CreateCountryDto } from './dto/create-country.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from './country.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(Country)
    private countriesRepository: Repository<Country>,
  ) {}

  async findAll(): Promise<Country[]> {
    try {
      return await this.countriesRepository.find({
        order: {
          meta: 'ASC',
        },
      });
    } catch (error) {
      throw new HttpException(
        'An error occurred while getting the countries.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number): Promise<Country> {
    try {
      const country = await this.countriesRepository.findOne({ where: { id } });

      if (!country) {
        throw new HttpException('Country not found', HttpStatus.NOT_FOUND);
      }

      return country;
    } catch (error) {
      throw new HttpException(
        'An error occurred while getting the country.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(createCountryDto: CreateCountryDto): Promise<Country> {
    try {
      const existingCountry = await this.countriesRepository.findOne({
        where: { name: createCountryDto.name, place: createCountryDto.place },
      });

      if (existingCountry) {
        throw new HttpException('Country already exists', HttpStatus.CONFLICT);
      }

      const country = this.countriesRepository.create({
        ...createCountryDto,
        created_at: new Date(),
        updated_at: new Date(),
      });

      return await this.countriesRepository.save(country);
    } catch (error) {
      throw new HttpException(
        'An error occurred while creating the country.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: number,
    updadeCountryDto: UpdateCountryDto,
  ): Promise<Country> {
    try {
      const existingCountry = await this.countriesRepository.findOne({
        where: { id },
      });
      if (!existingCountry) {
        throw new HttpException('Country not found', HttpStatus.NOT_FOUND);
      }

      const fieldsToUpdated = Object.keys(updadeCountryDto);
      const allowedFieldsToUpdate = ['place', 'meta'];

      fieldsToUpdated.forEach((field) => {
        if (!allowedFieldsToUpdate.includes(field)) {
          throw new HttpException(
            `${field} is not a valid field to update.`,
            HttpStatus.BAD_REQUEST,
          );
        }
        existingCountry[field] = updadeCountryDto[field];
      });

      return await this.countriesRepository.save(existingCountry);
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error;
      } else {
        throw new HttpException(
          'An error occurred while updating the country.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async delete(id: number): Promise<{ deleted: boolean }> {
    const country = await this.countriesRepository.findOne({ where: { id } });
    if (!country) {
      throw new HttpException('Country not found', HttpStatus.NOT_FOUND);
    }
    try {
      await this.countriesRepository.delete(id);
      return { deleted: true };
    } catch (error) {
      throw new HttpException(
        'An error occurred while deleting the country.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
