# Sheep Music API


## Installation

```bash
$ yarn
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Database migrations/seed

```bash
# generate a migration from exist table schema
$ yarn migration:generate -n MigrationNameHere

# create a new migration
$ yarn migration:create -n MigrationNameHere

# run migrations
$ yarn migration:run

# revert migrations
$ yarn migration:revert

# create a new seed
$ yarn seed:create -n SeedNameHere

# run seeds
$ yarn seed:run

# revert seeds
$ yarn seed:revert
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

  Nest is [MIT licensed](LICENSE).
