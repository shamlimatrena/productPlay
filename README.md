# product

This is a test project to learn prisma and postgres. Solely backend on Node &amp; Express. There will be Users, Login/Registration functionality. Adding Product, buy/rent product functionalities.

- Download postgres locally on windows, give a password while installing (will be needed later)
- Clone the initial project. Go to project folder. run `npm init -y`
- Create a .gitignore file, add node_modules to it to avoid adding files in git
- install express js by running `npm install express`
- install `npm install typescript ts-node @types/node nodemon --save-dev`
- install `npx prisma init --datasource-provider postgresql`

PRISMA

- Migrate Code: `npx prisma migrate dev --name update_user_with_timestamps`
- Generate: `npx prisma generate`
- Prisma Studio: `npx prisma studio`
- install prisma client: `npm install @prisma/client`

Functionalities

- ✔️Models [Product, Rental]
- ✔️Add views logic to product
- ✔️Make relation with models
- APIs
  - ✔️Registration
  - ✔️Login
  - ✔️Create a product
  - ✔️Update a product
  - ✔️Delete a product
  - ✔️Get all Products
  - ✔️Get all Products by User
  - ✔️Get a single product (when this url hit, view++)
  - ✔️To buy a product
  - ✔️To rent a product
  - ✔️List bought/Sold/Rented/Lent products by user
