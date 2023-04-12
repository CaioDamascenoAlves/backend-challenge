import { PickType } from "@nestjs/swagger";
import { CreateCountryDto } from "./create-country.dto";

export class UpdadeCountryDto extends PickType(CreateCountryDto, ['place', 'meta']){}
