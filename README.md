<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## 🧠 Advanced Product Search API



## Description

Una API construida con NestJS que permite realizar búsquedas avanzadas de productos por nombre, categoría y ubicación, con soporte para autocompletado, ranking de relevancia y sugerencias de búsqueda.

## Installation

# Opción 1: Usando Docker (recomendado)
```bash
$ git clone https://github.com/Manuel20Lorenzo/backend_technical_challenge.git
$ cd backend_technical_challenge


# Construye y levanta los contenedores
$ docker-compose up --build
```
# Opción 2: Instalación local
```bash
$ npm install
$ npm run start:dev
```
La API estará disponible en: http://localhost:3000

Swagger UI: http://localhost:3000/api

## 📌 Consideraciones de diseño
Para simplificar la implementación y enfocarme en los requerimientos principales de la prueba (búsqueda avanzada y relevancia), los campos category y location fueron modelados como columnas simples dentro de la entidad Product.

Sin embargo, en un entorno real o con requisitos más complejos, se podría optar por una estructura relacional:

- Una tabla Category relacionada con Product (@ManyToOne) permitiría reutilizar categorías, validar integridad y permitir traducciones o metadatos.

- Una tabla Location (o City, Region, etc.) permitiría enriquecer la búsqueda geográfica, implementar features como autocompletado de ciudades, filtros jerárquicos, etc.

Esta decisión se tomó para mantener el código simple, enfocado en la lógica de búsqueda, sin perder de vista las buenas prácticas y respetando lo comentado en challenge.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## 

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Manuel Lorenzo](https://www.linkedin.com/in/manuel-alejandro-lorenzo-zambrano-a59332174/)

## License

Nest is [MIT licensed](LICENSE).
