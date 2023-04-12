import { ApiProperty } from "@nestjs/swagger";

export class CreateCountryDto {
  @ApiProperty(
    {
      description: 'The name of the country',
      example: 'Brazil',
    }
  )
  name: string;

  @ApiProperty(
    {
      description: 'The Local, with city of the country',
      example: 'São Paulo, Brazil',
    }
  )
  place: string;
  
  @ApiProperty(
    {
      description: 'The date of the country',
      example: '2024-01-01',
    }
  )
  meta: Date;
}
