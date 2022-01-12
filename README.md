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
        }],
        '@hh.ru/import-rules/hh-import-order': [ "error" ]
    },
    // ...
};
```

### Правила

- `no-internal-modules`

    Запрещает использовать импорт между собой в путях, указанных в опции `paths`

- `hh-import-order`

    Сортирует импорты в соответствии с внутренними правилами разработки

    Можно настроить паттерн определения специфичных зависимостей выделяемых в отдельный блок (`specificModulesRegexp`)

    Если какие-то зависимости должны быть импортированы в самом начале файла — можно определить их с помощью паттерна (`shouldBeFirstRegexp`)
