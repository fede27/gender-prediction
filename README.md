# gender-prediction

gender-prediction is a microservice for predicting user's genders by their names.


## How to configure

Put a .env file file on the main folder with the configuration of the microservice or pass the same variables as process.env variables (eg. Heroku variables).

Here is a sample configuration:

```
## PORT is the port number used by the service. Default 3001
PORT=80
## HOST is the host to bind. Default 0.0.0.0
HOST=0.0.0.0
## GENDERIZE_BATCH_SIZE is the maximum number of names 
## that are sent on a single request to the genderize.io service.
## Default 10 (maximum number without a API key)
GENDERIZE_BATCH_SIZE=10
## MONGO_URI is the Uri used to connect to the MongoDB service. NO DEFAULT VALUE
MONGO_URI=mongodb://xxxxxxx
## MONGO_DB is the db used by the microservice. Default Core
MONGO_DB=Core
## MONGO_COLLECTION is the collection used by the microservice. Default UserGenders
MONGO_COLLECTION = UserGenders

```


## How to build

```
yarn build
```

## How to run
```
yarn start
```

## Running tests

```
yarn test
```