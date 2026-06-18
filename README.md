<img width="200" alt="logo" src="https://github.com/user-attachments/assets/aa498202-b035-4c4c-bafd-d65bfdd58198" />

## **Viajar es para todos**

---

### 🚀 El Proyecto

**WayFy** es una plataforma web integral diseñada para transformar la experiencia de viaje de las personas con movilidad reducida. Nuestra misión es eliminar la incertidumbre y las barreras que suelen acompañar a la planificación de viajes accesibles.

### 💡 Idea detallada

> "Imagina que para planificar unas vacaciones accesibles, una persona con discapacidad tiene que pasar horas saltando entre mapas, blogs obsoletos y webs de hoteles que prometen accesibilidad, pero no la cumplen. Muchas veces, las fotos engañan y la 'accesibilidad' se queda en la puerta.
>
> Por eso creamos **WayFy**: la plataforma que conecta a viajeros con movilidad reducida con alojamientos realmente validados y sin barreras. Con WayFy, no solo reservas una habitación; **aseguras tu independencia**.
>
> Somos una plataforma completa diseñada para centralizar toda esa inteligencia. No somos solo un buscador; unimos la tecnología con la **experiencia real validada por la comunidad**. El usuario encuentra desde rutas verificadas hasta alojamientos certificados, asegurando que la accesibilidad no sea una sorpresa, sino una garantía."

---

### ✨ Características Principales

- **Validación Real:** Adiós a las sorpresas. Alojamientos y rutas verificados por la comunidad.
- **Centralización:** Todo lo que necesitas en un solo lugar: mapas, hoteles y consejos útiles.
- **Enfoque en la Independencia:** Diseñado específicamente para garantizar que el usuario tenga el control total de su experiencia.
- **Comunidad Activa:** Inteligencia colectiva al servicio de la accesibilidad universal.

---

### 🤝 Contribuciones

Creemos que la accesibilidad es un esfuerzo colectivo. Si quieres ayudar a que el mundo sea más inclusivo, ¡eres bienvenido a colaborar!

---

_WayFy - Rompiendo barreras, construyendo destinos._

# Plantilla de WebApp con React JS y Flask API

Construye aplicaciones web usando React.js para el front end y python/flask para tu API backend.

- La documentación se puede encontrar aquí: https://4geeks.com/docs/start/react-flask-template
- Aquí hay un video sobre [cómo usar esta plantilla](https://www.youtube.com/watch?v=qBz6Ddd2m38)
- Integrado con Pipenv para la gestión de paquetes.
- Despliegue rápido a Render [en solo unos pocos pasos aquí](https://4geeks.com/es/docs/start/despliega-con-render-com).
- Uso del archivo .env.
- Integración de SQLAlchemy para la abstracción de bases de datos.

### 1) Instalación:

Se recomienda instalar el backend primero, asegúrate de tener Python 3.13, Pipenv y un motor de base de datos (se recomienda Posgres).

1. Instala los paquetes de python: `$ pipenv install`
2. Crea un archivo .env basado en el .env.example: `$ cp .env.example .env`
3. Instala tu motor de base de datos y crea tu base de datos, dependiendo de tu base de datos, debes crear una variable DATABASE_URL con uno de los valores posibles, asegúrate de reemplazar los valores con la información de tu base de datos:

| Motor    | DATABASE_URL                                        |
| -------- | --------------------------------------------------- |
| SQLite   | sqlite:////test.db                                  |
| MySQL    | mysql://username:password@localhost:port/example    |
| Postgres | postgres://username:password@localhost:5432/example |

4. Migra las migraciones: `$ pipenv run migrate` (omite si no has hecho cambios en los modelos en `./src/api/models.py`)
5. Ejecuta las migraciones: `$ pipenv run upgrade`
6. Ejecuta la aplicación: `$ pipenv run start`

> Nota: Los usuarios de Codespaces pueden conectarse a psql escribiendo: `psql -h localhost -U gitpod example`

### Deshacer una migración

También puedes deshacer una migración ejecutando

```sh
$ pipenv run downgrade
```

### Población de la tabla de usuarios en el backend

Para insertar usuarios de prueba en la base de datos, ejecuta el siguiente comando:

```sh
$ flask insert-test-users 5
```

Y verás el siguiente mensaje:

```
    Creating test users
    test_user1@test.com created.
    test_user2@test.com created.
    test_user3@test.com created.
    test_user4@test.com created.
    test_user5@test.com created.
    Users created successfully!
```

### **Nota importante para la base de datos y los datos dentro de ella**

Cada entorno de Github Codespace tendrá **su propia base de datos**, por lo que si estás trabajando con más personas, cada uno tendrá una base de datos diferente y diferentes registros dentro de ella. Estos datos **se perderán**, así que no pases demasiado tiempo creando registros manualmente para pruebas, en su lugar, puedes automatizar la adición de registros a tu base de datos editando el archivo `commands.py` dentro de la carpeta `/src/api`. Edita la línea 32 de la función `insert_test_data` para insertar los datos según tu modelo (usa la función `insert_test_users` anterior como ejemplo). Luego, todo lo que necesitas hacer es ejecutar `pipenv run insert-test-data`.

### Instalación manual del Front-End:

- Asegúrate de estar usando la versión 20 de node y de que ya hayas instalado y ejecutado correctamente el backend.

1. Instala los paquetes: `$ pnpm install`
2. ¡Empieza a codificar! inicia el servidor de desarrollo de webpack `$ npm run start`
