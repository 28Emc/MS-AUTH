# MS-AUTH

Microservicio que gestiona el inicio de sesión de forma local (usuario y contraseña) y mediante redes sociales (Google, Facebook, Github, Twitter).

## INSTALACIÓN

Para instalar las dependencias del proyecto, ejecutar el comando:

`npm install`

## PROBAR EN LOCALHOST

Para levantar el proyecto en un ambiente local, se necesita tener el siguiente archivo (en la raíz del proyecto, al mismo nivel de /src):

`.env.local`

Una vez instaladas las dependencias, ejecutar el comando:

`npm run start:local`

## DESPLIEGUE EN GCP

Para levantar el proyecto en un ambiente de producción, se necesita tener el siguiente archivo (en la raíz del proyecto, al mismo nivel de /src):

`.env.production`

Para subir el proyecto a Google Cloud Platform, ejecutar el comando:

`gcloud app deploy -v=[ID]`

donde -v=[ID] equivale a la versión que se le asigna al proyecto (Ejm. -v=20230927)

NOTA: Previamente se debe realizar la instalación y configuración del sdk de GCP de forma local.
