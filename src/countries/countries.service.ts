import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from './country.entity';

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(Country)
    private countriesRepository: Repository<Country>,
  ) {}

  async findAll(): Promise<Country[]> {
    return await this.countriesRepository.find({
      order: {
        meta: 'ASC',
      },
    });
  }  

  async findOne(id: number): Promise<Country> {
    return await this.countriesRepository.findOne({ where: { id } });
  }

  async create(country: Country): Promise<Country> {
    const existingCountry = await this.countriesRepository.findOne({
      where: { name: country.name, place: country.place },
    });
    if (existingCountry) {
      throw new ConflictException('Este país já existe com o mesmo lugar.');
    }
    const newCountry = this.countriesRepository.create(country);
    return await this.countriesRepository.save(newCountry);
  }

  async update(id: number, updatedFields: Partial<Country>): Promise<Country> {
    const existingCountry = await this.countriesRepository.findOne({
      where: { id },
    });
    if (!existingCountry) {
      throw new Error('Country not found');
    }

    const fieldsToUpdated = Object.keys(updatedFields);
    const allowedFieldsToUpdate = ['place', 'meta'];
    const isValidOperation = fieldsToUpdated.every((field) => {
        allowedFieldsToUpdate.includes(field);
    });

    if (!isValidOperation) {
        throw new Error('Invalid update: Only "place" and "meta" are allowed');
    }

    const updatedCountry = Object.assign(existingCountry, updatedFields);
    updatedCountry.updated_at = new Date();

    return await this.countriesRepository.save(updatedCountry);
  }

  async delete(id: number): Promise<void> {
    await this.countriesRepository.delete(id);
  }
}
