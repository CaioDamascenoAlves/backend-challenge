import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CountriesService } from './countries.service';
import { Country } from './country.entity';
import { ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { UpdadeCountryDto } from './dto/updade-country.dto';
import { CreateCountryDto } from './dto/create-country.dto';

@Controller('countries')
@ApiTags('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Return all countries sorted in ascending order by meta field',
  })
  async findAll(): Promise<Country[]> {
    return await this.countriesService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Return a country.' })
  async findOne(@Param('id') id: number): Promise<Country> {
    const country = await this.countriesService.findOne(id);
    if (!country) {
      throw new Error('Country not found');
    } else {
      return country;
    }
  }

  @Post()
  @ApiBody({
    type: CreateCountryDto,
    schema: {
      example: {
        name: 'Brasil',
        place: 'América do Sul',
        meta: '2020-01-01',
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Create a country.', type: Country })
  async create(@Body() country: Country): Promise<Country> {
    try {
      const createdCountry = await this.countriesService.create(country);
      return createdCountry;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(
          'This country already exists with the same place.',
        );
      } else {
        throw new InternalServerErrorException(
          'An error occurred while creating the Country',
        );
      }
    }
  }

  @Patch(':id')
  @ApiBody({
    type: UpdadeCountryDto,
    schema: {
      example: {
        place: 'Natal',
        meta: '2020-01-01',
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Update a country for fields' })
  async update(
    @Param('id') id: number,
    @Body() updatedFields: Partial<Country>,
  ): Promise<Country> {
    const updatedCountry = await this.countriesService.update(
      id,
      updatedFields,
    );
    return updatedCountry;
  }

  @Delete(':id/delete')
  @ApiResponse({ status: 200, description: 'Delete a country.' })
  async delete(@Param('id') id: number): Promise<void> {
    const countryExists = await this.countriesService.findOne(id);
    if (!countryExists) {
      throw new Error('Country not found');
    } else {
      return await this.countriesService.delete(id);
    }
  }
}
