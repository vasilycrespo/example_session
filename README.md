# Muestra de Facebook connect en Ionic

Algunos link de utilidad y referencias para la instalacion:

  - http://ngcordova.com/docs/plugins/facebook/
  - https://ionicthemes.com/tutorials/about/native-facebook-login-with-ionic-framework

### Pre-requisitos

- npm
- node
- ionic framework
- git

### Pasos para la instalacion:

Clonar el repositorio actual.

```sh
$ git clone [proyecto actual]
```

Ingresar al al folder una vez clonado

```sh
$ cd example_session
```

Actualizar las dependencias y agregar las plataformas necesarias:

```sh
$ npm install
$ bower install
$ ionic state restore
$ ionic config build
```

Finalmente ejecutar la aplicacion por con el siguiente comando para lanzar la app en android una vez el telefono esta conectado por usb y con el modo usb debug habilitado, reemplazar [local-ip] por la direccion ip de la maquina que servira de host:

```sh
$ ionic run android -l -c --address [local-ip]
```