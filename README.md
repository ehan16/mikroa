<img src="./logo.png" alt="Mikroa logo" />

# Mikroa - CLI

Mikroa es una interfaz de línea de comando, conocida como CLI por sus siglas en inglés, la cual se encarga de automatizar la creación de proyectos que implementen la arquitectura basada en microservicios. Esto incluye desde la creación de los archivos y carpetas bases hasta la correcta configuración inicial requerida para comenzar el desarrollo de una aplicación. Además, busca automatizar y agilizar otros procesos como la creación de contenedores Docker, la migración de datos y la ejecución concurrente de los microservicios.

Esta herramienta fue realizada como trabajo de grado por [Erika Han](https://github.com/ehan16) y [Reichel Larez](https://github.com/Alexa1904) bajo la tutoría de [José Roberto Quevedo Gabizón](https://github.com/Zoomelectrico) para optar por el título de Ingeniero de Sistemas en la Universidad Metropolitana.

## Tabla de contenidos

- [Comandos](#comandos-del-cli)
- [Licencia](#licencia)

## Comandos del CLI

1. [init](#init)
2. [generate](#generate)
3. [build](#build)
4. [migrate](#migrate)
5. [start](#start)

### `init`

Se genera el directorio del proyecto en la ruta en donde ejecute el comando `init`

```shell
  mikroa init <project-name>
```

| Argument     | Description                                                                    |
| ------------ | ------------------------------------------------------------------------------ |
| project-name | El nombre del proyecto, el cual también es utilizado para crear el directorio. |

> Nota: `project-name` solo debe consistir de letras y números, en caso de incluir `.`, `,` o `<space>`, se generará un error

#### Examples

- Crear un directorio llamado `my-project`

```shell
mikroa init my-project
```

### `generate`

Se debe ejecutar en el carpeta `root` del proyecto para poder crear nuevos microservicios

```shell
  mikroa generate [microservice-name]
```

| Argument          | Description                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------------- |
| microservice-name | El nombre del microservicio, el cual también es utilizado para crear su respectiva carpeta. |

> Nota: `project-name` solo debe consistir de letras y números, en caso de incluir `.`, `,` o `<space>`, se generará un error

#### Examples

- Generar un nuevo microservicio llamado `my-microservice`, el CLI ejecutará un proceso interactivo solicitando la siguiente información:

```shell
mikroa generate my-microservice
? Please choose which language would you like to use? › Javascript
? Please choose which orm to use? › Mongoose
? Please choose a backend framework to use? › - Use arrow-keys. Return to submit.
❯  Express
   Fastify
   Koa.js
```

- Si omite el argumento, el CLI leerá el archivo de configuración ubicado en el `root` para generar todos los microservicios que no hayan sido creados ya:

```shell
mikroa generate
```

Cada microservicio debe seguir la siguiente estructura:

```json:title=config.json
{
  "my-microservice": {
      "language": "javascript",
      "orm": "mongoose",
      "framework": "express",
  }
}
```

### `build`

Al ejecutarse el comando `mikroa build` en la carpeta `root` del proyecto de Mikroa, se crean las imágenes de los contenedores respectivos de cada microservicio según el `.Dockerfile` correspondiente. En caso de poseer requerimientos extras, se recomienda modificar dicho archivo para adaptarse a sus necesidades.

Por otro lado, se genera el archivo `docker-compose.yml` para el posterior despliegue de los contenedores.

```shell
  mikroa build
```

### `migrate`

El comando `mikroa migrate` se encarga de realizar la correspondiente migración de modelos a la base de datos según el ORM u ODM seleccionado por el usuario.

```shell
  mikroa migrate
```

| Option           | Description                                                                                                        |
| ---------------- | ------------------------------------------------------------------------------------------------------------------ |
| development [-d] | En caso de colocar el flag `--development` o `-d`, se realizarán las migraciones para un entorno de `development`. |

#### Examples

- En el caso de haber seleccionado el ODM `mongoose`, debe especificar en el archivo `config.json` del microservicio los modelos a crear, cada uno debe seguir la siguiente estructura para poder generar el archivo de cada modelo:

```json:title=config.json
{
  "User": {
    "name": "String",
    "email": {
      "type": "String",
      "required": true,
    },
    "age": {
      "type": "Number",
      "default": 0,
    },
    "address": [
      {
        "type": "String",
      },
    ]
  }
}
```

- En el caso de haber seleccionado el ORM `prisma`, los modelos deben ser especificados directamente en el archivo `schema.prisma`, siguiendo la sintaxis de Prisma. Posteriormente, Mikroa se hará cargo de realizar las migraciones correspondientes a la base de datos seleccionada

> Nota: En el caso de decidir utilizar Prisma con MongoDB, se deben realizar los cambios correspondientes para que dicho ORM funcione correctamente con la base de datos

### `start`

En la carpeta `root` del proyecto, el comando `mikroa start` ejecuta todos los microservicios del proyecto Mikroa

```shell
  mikroa start [microservice-name]
```

| Argument          | Description                                                                   |
| ----------------- | ----------------------------------------------------------------------------- |
| microservice-name | El nombre del microservicio, el cual corresponde con el nombre de la carpeta. |

#### Examples

- Iniciar la ejecución de un único microservicio llamado `my-microservice`, el CLI identificará el servicio y ejecutará el comando respectivo:

```shell
mikroa start my-microservice
```

- Si omite el argumento, el CLI leerá el archivo de configuración ubicado en el `root` para iterar sobre todos los microservicios e iniciar su ejecución de manera concurrente:

```shell
mikroa start
```

## Licencia

MIT © Erika Han and Reichel Larez
