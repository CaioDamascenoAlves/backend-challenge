import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';
import { Country } from './country.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Country])
  ],
  providers: [CountriesService],
  controllers: [CountriesController]
})
export class CountriesModule {}
