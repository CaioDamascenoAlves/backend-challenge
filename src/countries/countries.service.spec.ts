import { Test, TestingModule } from '@nestjs/testing';
import { CountriesService } from './countries.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Country } from './country.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateCountryDto } from './dto/create-country.dto';
import { DeleteResult, Repository } from 'typeorm';
import { UpdateCountryDto } from './dto/updade-country.dto';

describe('CountriesService', () => {
  let service: CountriesService;
  let repositoryMock;
  let countriesRepository: Repository<Country>;

  beforeEach(async () => {
    repositoryMock = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountriesService,
        {
          provide: getRepositoryToken(Country),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<CountriesService>(CountriesService);
    countriesRepository = module.get<Repository<Country>>(
      getRepositoryToken(Country),
    );
  });

  describe('findAll', () => {
    it('should return an array of countries', async () => {
      const countries = [
        { id: 1, name: 'Country 1', place: 'Place 1', meta: 'Meta 1' },
        { id: 2, name: 'Country 2', place: 'Place 2', meta: 'Meta 2' },
      ];
      repositoryMock.find.mockReturnValue(countries);

      const result = await service.findAll();

      expect(result).toEqual(countries);
      expect(repositoryMock.find).toHaveBeenCalledTimes(1);
      expect(repositoryMock.find).toHaveBeenCalledWith({
        order: { meta: 'ASC' },
      });
    });

    it('should throw an internal server error exception if the repository throws an error', async () => {
      repositoryMock.find.mockRejectedValue(new Error());

      await expect(service.findAll()).rejects.toThrowError(
        'An error occurred while getting the countries.',
      );
    });
  });

  describe('findOne', () => {
    it('should return a country', async () => {
      const country = {
        id: 1,
        name: 'Country 1',
        place: 'Place 1',
        meta: 'Meta 1',
      };
      repositoryMock.findOne.mockReturnValue(country);

      const result = await service.findOne(1);

      expect(result).toEqual(country);
      expect(repositoryMock.findOne).toHaveBeenCalledTimes(1);
      expect(repositoryMock.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw an internal server error exception if the repository throws an error', async () => {
      repositoryMock.findOne.mockRejectedValue(new Error());

      await expect(service.findOne(1)).rejects.toThrowError(
        'An error occurred while getting the country.',
      );
    });
  });

  describe('create', () => {
    it('should create a country successfully', async () => {
      const createCountryDto: CreateCountryDto = {
        name: 'Country 1',
        place: 'Place 1',
        meta: new Date('2024-01-01'),
      };

      const mockCountry: Country = {
        id: 1,
        name: 'Country 1',
        place: 'Place 1',
        meta: new Date('2024-01-01'),
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest.spyOn(countriesRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(countriesRepository, 'create').mockReturnValue(mockCountry);
      jest.spyOn(countriesRepository, 'save').mockResolvedValue(mockCountry);

      const result = await service.create(createCountryDto);

      expect(result).toEqual(mockCountry);
      expect(countriesRepository.create).toHaveBeenCalledWith({
        ...createCountryDto,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });
      expect(countriesRepository.save).toHaveBeenCalledWith(mockCountry);
    });
  });

  describe('update', () => {
    const mockId = 1;
    const mockUpdateCountryDto: UpdateCountryDto = {
      place: 'New Place',
      meta: new Date('2024-01-01'),
    };
    const mockCountry: Country = {
      id: mockId,
      name: 'Country 1',
      place: 'Place 1',
      meta: new Date('2024-01-01'),
      created_at: new Date(),
      updated_at: new Date(),
    };

    it('should update a country successfully', async () => {
      jest.spyOn(countriesRepository, 'findOne').mockResolvedValue(mockCountry);
      jest.spyOn(countriesRepository, 'save').mockResolvedValue({
        ...mockCountry,
        ...mockUpdateCountryDto,
      });

      const result = await service.update(mockId, mockUpdateCountryDto);

      expect(result).toEqual({
        ...mockCountry,
        ...mockUpdateCountryDto,
      });
      expect(countriesRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockId },
      });
      expect(countriesRepository.save).toHaveBeenCalledWith({
        ...mockCountry,
        ...mockUpdateCountryDto,
      });
    });

    it('should throw a not found exception', async () => {
      jest.spyOn(countriesRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.update(mockId, mockUpdateCountryDto),
      ).rejects.toThrow(
        new HttpException('Country not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw an internal server error exception', async () => {
      jest.spyOn(countriesRepository, 'findOne').mockRejectedValue(new Error());

      await expect(
        service.update(mockId, mockUpdateCountryDto),
      ).rejects.toThrow(
        new HttpException(
          'An error occurred while updating the country.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('delete', () => {
    const mockId = 1;
    const mockCountry: Country = {
      id: mockId,
      name: 'Country 1',
      place: 'Place 1',
      meta: new Date('2024-01-01'),
      created_at: new Date(),
      updated_at: new Date(),
    };

    it('should delete a country successfully', async () => {
      jest.spyOn(countriesRepository, 'findOne').mockResolvedValue(mockCountry);
      jest
        .spyOn(countriesRepository, 'delete')
        .mockResolvedValue({} as DeleteResult);

      const result = await service.delete(mockId);

      expect(result).toEqual({ deleted: true });
      expect(countriesRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockId },
      });
      expect(countriesRepository.delete).toHaveBeenCalledWith(mockId);
    });

    it('should throw a not found exception', async () => {
      jest.spyOn(countriesRepository, 'findOne').mockResolvedValue(null);

      await expect(service.delete(mockId)).rejects.toThrow(
        new HttpException('Country not found', HttpStatus.NOT_FOUND),
      );
    });
  });
});
