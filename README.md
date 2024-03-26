# Express App

##  Postman Colletion

get the Postman collection in `Grid Principle.postman_collection.json` at root directory

## How to set up

- ### Dev environtment
    - make `.env.local` file or copy with below command to create an env local file for your local machine
        ```sh
        cp .env.example .env.local
        ```
    
    - set up database and redis with docker
        ```sh
        docker-compose up -d
        ```
    - create new database
    - set up the port and the mysql as per your database in .env.local file
    - install depedencies
        ```sh
        yarn
        ```
    - run prisma migration using `yarn prisma:migrate` to migrate database structure to your database
    - run `yarn dev` to start the development