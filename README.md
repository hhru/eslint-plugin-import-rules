### Настройка

- Добавляем плагин в .eslintrc 
- Включаем необходимые правила

.eslintrc 
```
{
    // ...
    plugins: ['@hh.ru/import-rules'],
    rules: {
        '@hh.ru/import-rules/no-internal-modules': [ "warn", {
            "paths": [
                '(?:lux\/pages\/[^\/]*)'
            ],
            "exclusions": [
                '(?:lux/modules/routes.js)'
            ],
        }]
    },
    // ...
};
```

### Правила

- `no-internal-modules`

    Запрещает использовать импорт между собой в путях, указанных в опции `paths`
