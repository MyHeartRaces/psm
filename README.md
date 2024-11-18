# Product Stock Management

Этот проект состоит из двух сервисов:

1. **Сервис управления остатками товаров** (TypeScript)
    - Управляет остатками товаров в различных магазинах, включая создание, обновление и запрос записей об остатках.

2. **Сервис истории действий с товарами** (JavaScript)
    - Логирует все действия, связанные с товарами и обновлением остатков, и предоставляет API для получения истории действий с фильтрами и пагинацией.

## Технический стек

- **Backend Framework**: Express.js для обоих сервисов
- **Язык**: TypeScript для Product Stock Management, JavaScript для Product Action History
- **База данных**: PostgreSQL
- **Коммуникация**: RESTful API, Axios для взаимодействия между сервисами

## Предварительные требования

- **Node.js** (v14 или новее)
- **npm** или **yarn**
- **PostgreSQL**

## Переменные окружения

Создайте файл `.env` в корневом каталоге для каждого сервиса с следующими переменными:

```
# Общие для обоих сервисов
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

# Специфично для Product Stock Management
PORT=3000
ACTION_HISTORY_SERVICE_URL=http://localhost:4000/actions

# Специфично для Product Action History
PORT=4000
```

## Настройка и запуск

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Установка зависимостей

Перейдите в каталог каждого сервиса и установите зависимости:

#### Для Product Stock Management:

```bash
cd product-stock-management
npm install
```

#### Для Product Action History:

```bash
cd product-action-history
npm install
```

### 3. Настройка базы данных

- Создайте базу данных PostgreSQL для каждого сервиса.
- Используйте предоставленные SQL-скрипты для создания таблиц (`products`, `stores`, `stocks`, `actions`).

### 4. Запуск сервисов

#### Для Product Stock Management:

```bash
npm run start
```

#### Для Product Action History:

```bash
npm run start
```

Сервисы будут запущены на следующих портах по умолчанию:
- Product Stock Management: `http://localhost:3000`
- Product Action History: `http://localhost:4000`

## Документация API

### Сервис управления остатками товаров

- **POST /products**: Создание нового товара.
- **POST /stocks**: Создание новой записи об остатках.
- **PUT /stocks/increase**: Увеличение количества остатков.
- **PUT /stocks/decrease**: Уменьшение количества остатков.
- **GET /stocks**: Получение записей об остатках с необязательными фильтрами (`plu`, `store_id`, `quantity_on_shelf`, `quantity_in_orders`).
- **GET /products**: Получение товаров с необязательными фильтрами (`name`, `plu`).

### Сервис истории действий с товарами

- **POST /actions**: Логирование действия, связанного с товарами или остатками.
- **GET /actions**: Получение истории действий с фильтрами (`shop_id`, `plu`, `date`, `action`) и пагинацией.


