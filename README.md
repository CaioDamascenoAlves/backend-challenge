# Desafio de Backend

<img src="./img/logo-clubpetro.png" style="margin-left: 100px"
     alt="Clubpetro" width="300">

- [Descrição](#descrição)
  - [O Desafio](#o-desafio)
  - [Requisitos Obrigatórios](#tecnologias-utilizadas)
  - [Bônus](#requisitos)
  - [Como executar o projeto](#como-executar-o-projeto)

## Descrição

Este desafio tem como objetivo avaliar as habilidades técnicas do candidato a vaga de desenvolvedor backend no Clubpetro.

#### O Desafio

O desafio consiste em desenvolver uma API rest que permita o CRUD de lugares para se conhecer ao redor do mundo para alimentar o frontend que pode ser visto na imagem a seguir:

<img src="./img/challenge.png" alt="Desafio" >

Os dados a ser considerados são:

- País: O país escolhido;
- Local: O local dentro do país escolhido;
- Meta: O mês e o ano que o usuário pretende visitar o local;
- Url da bandeira do país;
- Data de criação do registro;
- Data de atualização do registro.

#### Tecnologias Utilizadas

- [NodeJs](https://nodejs.org/en)
- [NestJs](https://nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [TypeORM](https://typeorm.io/#/);
- [Docker](https://docs.docker.com/compose/);
- [Postgres](https://www.postgresql.org/)
- [Swegger](https://swagger.io/)

#### Requisitos
- [NodeJs](https://nodejs.org/en)
- [Docker](https://docs.docker.com/);
- [Docker Compose](https://docs.docker.com/compose/);

### Como executar o projeto
1. Clone o repositório em sua máquina local:
  
  git clone https://github.com/CaioDamascenoAlves/backend-challenge.git
  
2. Acesse o diretório do projeto:
  
  cd backend-challenge
  
3. Instalar o Yarn:
  
  npm install --global yarn

4. Criar um arquivo para configurar variaveis de ambiente:
  > Esse arquivo tem que se chamar stage.dev.env
  
  
  
5. Iniciar projeto:
  yarn docker-compose:dev
  yarn docker-compose:dev

