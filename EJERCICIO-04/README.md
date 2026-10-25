# EJERCICIO 04 · Food Spots

Aplicación independiente del cuaderno DataBridge que crea restaurantes desde React Native mediante `POST /restaurantes`.

## Estructura

```text
EJERCICIO-04/
├── backend/
├── frontend/
└── README.md
```

## Requisitos y base de datos

```powershell
node --version
npm --version
nest --version
psql --version
git --version
```

Desde `psql -U postgres`:

```sql
CREATE DATABASE databridge_e04;
```

La tabla `restaurantes` se crea automáticamente con `synchronize: true`.

## Backend

```powershell
cd backend
npm install
Copy-Item .env.example .env
# Edita .env con la contraseña local de PostgreSQL
npm run start:dev
```

Prueba la creación:

```powershell
curl.exe -i -X POST http://localhost:3000/restaurantes `
  -H "Content-Type: application/json" `
  -d '{"nombre":"La Trattoria","tipo":"Italiano","ciudad":"Zaragoza","puntuacion":9,"precioMedio":25}'
```

Comprobación en PostgreSQL:

```powershell
psql -U postgres -d databridge_e04
\dt
SELECT * FROM restaurantes;
\q
```

El `POST` devuelve el restaurante creado, incluido el `id` generado por PostgreSQL y `precioMedio`. Reiniciar NestJS conserva los datos porque este ejercicio no vuelve a sembrar restaurantes automáticamente.

## Frontend

```powershell
cd frontend
npm install
npx expo start
```

En un móvil físico, sustituye `TU_IP_LOCAL` en `frontend/App.tsx` por la IPv4 del ordenador, por ejemplo `192.168.1.37`.

## Recorrido del dato

React Native lee el formulario y usa `JSON.stringify` para crear el body del `POST`. `RestaurantesController` recibe el JSON mediante `@Body()` y lo expresa con `CreateRestauranteDto`. `RestaurantesService` ejecuta `repository.create(dto)` para construir la entidad en memoria y `repository.save(...)` para persistirla en PostgreSQL. La respuesta vuelve al móvil y se muestra en una tarjeta.

La Entity representa cómo se guarda el restaurante; el DTO describe los datos que acepta la entrada HTTP. `precioMedio` debe aparecer en ambos para viajar desde el formulario hasta la tabla.

## MODIFÍCALO

Se ha añadido `precioMedio` en Entity, DTO, formulario, body del `POST` y tarjeta final. La pantalla muestra `La Trattoria`, `Italiano · Zaragoza` y `Precio medio: 25 €` después de guardar correctamente.

## Checkpoints

- [ ] NestJS arranca y PostgreSQL conecta.
- [ ] `POST` devuelve el restaurante creado.
- [ ] El registro aparece en PostgreSQL.
- [ ] `precioMedio` viaja desde el formulario hasta la tabla.
- [ ] Puedo explicar el recorrido del dato sin mirar el código.

## Entrega

```powershell
git status
git add EJERCICIO-04
git commit -m "Ejercicio 04 - Food Spots"
git push
```

