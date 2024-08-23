## FnB Point Of Sale (POS) Project

Generate migrations file
```
npx sequelize-cli migration:generate --name <migrations name> --migrations-path src/migrations
```

Undo migrations
```
npx sequelize-cli db:migrate:undo --name <migrations file name>
```