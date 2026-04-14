Install drizzle:-
npm i drizzle-orm pg dotenv
npm i -D drizzle-kit tsx @types/pg
npm i drizzle-seed

Install the Neondatabase/serverless driver:-
npm install @neondatabase/serverless

npx drizzle-kit studio
https://local.drizzle.studio

To generate the migrations
npm run db:generate

to run the migrations
npm run db:push

to seed the db
npm run db:seed    