# HEALTH NOW API

> Backend API for Health now application, which contains a user authentication system

## Install Dependencies

```
Install docker and docker-compose
```

```
npm install
```

## Run App

```
# Run container
npm run docker-up

# Run in dev mode
npm run dev:local

# Run in prod mode
npm start
```

## Database Seeder

To seed the database with users with data from the "\_data" folder, run

```
# Destroy all data
npm run seed:delete

# Import all data
npm run seed:create
```

## Documentation

To view api documentation kindly see

```
# {host}:{port}/docs
```
