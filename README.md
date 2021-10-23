# **DELILAH RESTÓ**. 

**Una API para manejar su propio restaurante.**

EL proyecto consiste en una API Rest, la cual permite al usuario gestionar una lista de clientes, productos y pedidos de un restaurante.
La API permite conectar con una base de datos MySQL para almacenar y gestionar los datos del restaurante.

Características:

- Registro y login de usuarios
- Validación por roles (Admin o no)
- Funciones CRUD de productos
- Funciones CRUD de pedidos

## Especificaiones OPEN API

- [Open API Docs](/spec.yml)

## Empezando

### Clonar el REPO:

```
$ git clone https://github.com/skills20/delilah-resto.git
```

o puede simplemente descargarlo de Github

### Instalar dependencias:

```
$ npm install
```

or

```
$ yarn install
```

### Configuración de base de datos:

#### Auto configuración:

- Corra un servidor MySQL.

- Cree una base de datos desde MySQL usando la línea de comando o la utilidad del escritorio

- Abra el archivo `config.js` (`db/sequelize/config.js`) donde se puede editar:

  1. El host y el puerto de la base de datos con la cual la API se debe conectar.
  2. El nombre de la base de datos.
  3. El usuario y la contraseña de la base de datos a conectar.

```
$ cd db/db-setup
$ node index.js
```

Esto creará un esquema de BD, las tablas se importaran de los datos de ejemplo de usuarios y productos. Usted puede **editar**
la información de ejemplo remplazando los archivos `products.csv` y `users.csv` en `db/datasets`

#### Configuración manual:

Si la configuración automática falla, puede hacer lo siguiente:

1. Inicializar el servidor MySQL.
2. Crear una BD llamada **delilah_resto** desde la línea de comanto o la utilidad de escritorio.
3. Crear un esquema y las tablas, e insertar los datos manualmente usando los _queries_ que estan en `dbCreators.sql`.

Antes de empezar a utilizar el servidor, no olvide editar el archivo `config.js` (`db/sequelize/config.js`) con:

1. El host y el puerto de la base de datos con la cual la API se debe conectar.
2. El nombre de la base de datos.
3. El usuario y la contraseña de la base de datos a conectar.

## Correr la API

```
$ cd server
$ node index.js
```

## Dependencias usadas

- body-parser version 1.19.0.
- cors version 2.8.5.
- csv-parser version 2.3.2.
- express version 4.17.1.
- jsonwebtoken version 8.5.1.
- mysql2 version 2.1.0.
- sequelize version 5.21.5.
