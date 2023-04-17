import { PickType } from "@nestjs/swagger";
import { CreateCountryDto } from "./create-country.dto";

export class UpdateCountryDto extends PickType(CreateCountryDto, ['place', 'meta']){}
