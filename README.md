# Muestra de Facebook connect & Google + en Ionic

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

Antes de compilar, existe un bug por conflicto con dependencias que se estan llamando desde las dos librerias adicionales instaladas (facebook y google +). Para solucionar el problema debe editarse el archivo build.gradle de android:

```sh
example_session/platforms/android/build.gradle
```
User el editor de texto de preferencia para agregar el siguiente bloque de codigo al final del fichero:

```sh
configurations {
    all*.exclude group: 'com.android.support', module: 'support-v4'
}
```


Finalmente, ejecutar la aplicacion con el siguiente comando para lanzar la app por el telefono conectado via usb (el modo usb debug debe esta habilitado), reemplazar [local-ip] por la direccion ip de la maquina que servira de host:

```sh
$ ionic run android -l -c --address [local-ip]
```

