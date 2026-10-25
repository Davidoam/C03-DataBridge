# EJERCICIO 03 · Pet Profile

Aplicación independiente del cuaderno DataBridge que recupera una mascota concreta desde PostgreSQL mediante un path parameter.

## Estructura

```text
EJERCICIO-03/
├── backend/
├── frontend/
└── README.md
```

## Requisitos y base de datos

Comprueba que están disponibles:

```powershell
node --version
npm --version
nest --version
psql --version
git --version
```

Desde `psql -U postgres` crea la base de datos:

```sql
CREATE DATABASE databridge_e03;
```

La tabla `mascotas` se crea automáticamente con `synchronize: true`, como parte del ejercicio didáctico.

## Backend

```powershell
cd backend
npm install
Copy-Item .env.example .env
# Edita .env con la contraseña local de PostgreSQL
npm run start:dev
```

La API escucha en `http://localhost:3000`.

Pruebas principales:

```powershell
curl.exe -i http://localhost:3000/mascotas/1
curl.exe -i http://localhost:3000/mascotas/999
curl.exe -i http://localhost:3000/mascotas/abc
```

La primera petición devuelve la mascota Nala. La segunda devuelve `404 Not Found` y la tercera `400 Bad Request` porque `ParseIntPipe` no puede convertir `abc` a número.

Comprobación en PostgreSQL:

```powershell
psql -U postgres -d databridge_e03
\dt
SELECT * FROM mascotas;
\q
```

Reiniciar NestJS no debe duplicar el registro inicial.

## Frontend

En otra terminal:

```powershell
cd frontend
npm install
npx expo start
```

En un móvil físico, sustituye `TU_IP_LOCAL` en `frontend/App.tsx` por la IPv4 del ordenador, por ejemplo `192.168.1.37`. El ordenador y el móvil deben estar en la misma red.

## Recorrido del dato

React Native solicita `GET /mascotas/1`. `MascotasController` recibe el path parameter `:id`, `@Param('id')` lo extrae y `ParseIntPipe` lo valida y convierte en número. `MascotasService` usa `repository.findOneBy({ id })` para consultar una entidad concreta. Si no existe, lanza `NotFoundException`, que Nest convierte en una respuesta HTTP 404. Si existe, la entidad viaja como JSON hasta la ficha React Native.

## MODIFÍCALO

La entidad incorpora `nivelEnergia`, el registro de Nala lo persiste con valor `ALTO` y la ficha muestra `⚡ Nivel de energía: ALTO`.

## Checkpoints

- [ ] NestJS arranca y PostgreSQL conecta.
- [ ] `GET /mascotas/1` devuelve una sola mascota.
- [ ] Un id inexistente produce 404.
- [ ] La ficha muestra `nivelEnergia`.
- [ ] Puedo explicar el recorrido del dato sin mirar el código.
- [ ] Reiniciar el backend no duplica la mascota inicial.

## Entrega

Desde la raíz del repositorio:

```powershell
git status
git add EJERCICIO-03
git commit -m "Ejercicio 03 - Pet Profile"
git push
```

