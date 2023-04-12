import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { CountriesService } from './countries.service';
import { Country } from './country.entity';
import {
  ApiTags,
  ApiBody,
  ApiConflictResponse,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { UpdadeCountryDto } from './dto/updade-country.dto';
import { CreateCountryDto } from './dto/create-country.dto';

@Controller('countries')
@ApiTags('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  @ApiOkResponse({ description: 'Return all countries.', type: [Country] })
  @ApiInternalServerErrorResponse({
    description: 'An error occurred while getting the countries.',
  })
  async findAll(): Promise<Country[]> {
    return await this.countriesService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Return a country.', type: Country })
  @ApiNotFoundResponse({ description: 'Country not found' })
  @ApiInternalServerErrorResponse({
    description: 'An error occurred while getting the country.',
  })
  async findOne(@Param('id') id: number): Promise<Country> {
    const country = await this.countriesService.findOne(id);
    if (!country) {
      throw new Error('Country not found');
    } else {
      return country;
    }
  }

  @Post()
  @ApiBody({ type: CreateCountryDto })
  @ApiOkResponse({ description: 'Create a country.', type: Country })
  @ApiConflictResponse({ description: 'The country already exists' })
  @ApiInternalServerErrorResponse({
    description: 'An error occurred while creating the country.',
  })
  async create(@Body() createCountryDto: CreateCountryDto): Promise<Country> {
    return await this.countriesService.create(createCountryDto);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'Update a country.', type: Country })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'Country not found' })
  @ApiInternalServerErrorResponse({
    description: 'An error occurred while updating the country.',
  })
  async update(
    @Param('id') id: number,
    @Body() updatedCountryDto: UpdadeCountryDto,
  ): Promise<Country> {
    return await this.countriesService.update(id, updatedCountryDto);
  }

  @Delete(':id/delete')
  @ApiNotFoundResponse({ description: 'Country not found' })
  @ApiOkResponse({ description: 'Delete a country.' })
  @ApiInternalServerErrorResponse({
    description: 'An error occurred while updating the country.',
  })
  async delete(@Param('id') id: number): Promise<void> {
    return await this.countriesService.delete(id);
  }
}
