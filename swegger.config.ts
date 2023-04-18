import { DocumentBuilder } from "@nestjs/swagger";

export const sweggerConfig = new DocumentBuilder()
    .setTitle("Countries API")
    .setDescription("API contruida para o desafio da empresa ClubPetro")
    .setVersion("1.0")
    .addTag("countries")
    .build();
    