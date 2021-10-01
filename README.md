<img src="./logo.png" alt="Mikroa logo" />

# Mikroa - CLI

Mikroa es una interfaz de línea de comando, conocida como CLI por sus siglas en inglés, realizada como trabajo de grado por [Erika Han](https://github.com/ehan16) y [Reichel Larez](https://github.com/Alexa1904) bajo la tutoría de [José Roberto Quevedo Gabizón](https://github.com/Zoomelectrico) para optar por el título de Ingeniero de Sistemas en la Universidad Metropolitana.

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

Se debe ejectutar en el carpeta `root` del proyecto para poder crear nuevos microservicios

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
      "route": "./my-microservice",
      "language": "javascript",
      "orm": "mongoose",
      "framework": "express",
  }
}
```

### `build`

### `migrate`

### `start`

## Licencia

MIT © Erika Han and Reichel Larez
