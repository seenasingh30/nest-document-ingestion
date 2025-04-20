<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# JKTech NestJS Backend

> A fully functional NestJS backend with authentication, user management, document uploads, ingestion workflows, and Postman-tested endpoints.

---

## 🚀 API Overview (based on Postman collection)

### ✅ Users Module

- `POST /users` – Create user (admin only)
- `PATCH /users/:id` – Update user
- `DELETE /users/:id` – Delete user (admin only)
- `GET /users` – Get all users
- `GET /users/:id` – Get one user
- `GET /users/me` – Get own profile

### ✅ Auth Module

- `POST /auth/register` – Register new user
- `POST /auth/login` – Login and get JWT

### ✅ Document Module

- `POST /document/upload` – Upload document via `form-data`
- `GET /document` – Get all documents
- `GET /document/:id` – Get one document
- `PATCH /document/:id` – Update document
- `DELETE /document/:id` – Delete document

### ✅ Ingestion Module

- `POST /ingestion/trigger/:id` – Trigger ingestion (Python backend)
- `GET /ingestion` – List all ingestions
- `PATCH /ingestion/webhook/:id` – Mark ingestion status via webhook

---

## ⚙️ Environment Configuration

Create a `.env` file at the root:

```env
PORT=3000
JWT_SECRET=iuhhuhhhkijw4jh9
PYTHON_INGESTION_URL=http://localhost:5000/ingest
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=123456
DB_DATABASE=postgres
```

---

## 🧩 Setup JWT Module in `auth.module.ts`

```ts
JwtModule.registerAsync({
  useFactory: (config: ConfigService) => ({
    secret: config.get('JWT_SECRET'),
    signOptions: { expiresIn: '1d' },
  }),
  inject: [ConfigService],
});
```

---

## 🗂️ File Upload Support

In `main.ts`:

```ts
import { join } from 'path';
app.useStaticAssets(join(__dirname, '..', 'uploads'));
```

Use `"file"` as the form-data key when uploading.

---

## 🔒 Guards

- Use `@UseGuards(AuthGuard('jwt'))` to protect routes
- Use `@Roles(Role.Admin)` to enforce role-based access

---

## 🧪 Testing in Postman

Use the `Jktech.postman_collection.json` file to test all endpoints. Replace `{{host}}` with `http://localhost:3000`.

---

## 🧠 Optional Enhancements

- Add pagination to `/users`, `/document`
- Use `req.user.id` to save `uploadedBy`
- Add response metadata consistently
- Integrate `@nestjs/swagger` to document your APIs

---

## 📚 API Documentation with Swagger

1. Install dependencies:
```bash
npm install --save @nestjs/swagger swagger-ui-express
```

2. Setup Swagger in `main.ts`:
```ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('JKTech API')
  .setDescription('API documentation for JKTech backend')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);
```

3. Access Swagger UI at:
```
http://localhost:3000/api
```

---

## 📦 Project Setup

```bash
# Install dependencies
npm install

# Run in dev mode
npm run start:dev
```

---

## ✅ Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov

```

---

## 📤 Deployment

Deploy with Mau (NestJS deployment tool):

```bash
npm install -g @nestjs/mau
mau deploy
```

---

## 👥 Community & Resources

- [NestJS Docs](https://docs.nestjs.com)
- [Discord](https://discord.gg/G7Qnnhy)
- [Swagger DevTools](https://devtools.nestjs.com)

---

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
