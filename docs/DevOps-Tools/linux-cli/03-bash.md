---
sidebar_position: 4
title: Bash Scripting
---
# Introducción a BASH

Bash es un shell y un lenguaje de scripting. Actúa como interfaz entre el usuario y el sistema operativo, permitiendo a los usuarios ejecutar comandos, scripts y gestionar procesos. Su capacidad para manejar scripts de manera eficiente hace que sea una herramienta poderosa para la automatización de tareas, administración del sistema y desarrollo de software.

## Características básicas

Para utilizar el valor de una variable la prefijaremos con el carácter `$`:

### Redirección

Los comandos tienen una entrada y una salida. A la hora de ejecutar cada comando, podemos alterar su entrada y salida utilizando una notación especial reconocida por la _shell_. Cada redirección puede venir precedida por un **descriptor de archivo** en forma de número o palabra. Podemos ver los descriptores de archivos dentro de `/dev/fd/`.

Existen diferentes descriptores:

- `0`: Representa la entrada estándar o STDIN.
- `1`: Representa la salida estándar o STDOUT.
- `2`: Representa la salida estándar de errores o STDERR.
- Del `3` al `9`: Reservados para abrir archivos adicionales.

Los operadores de redirección sólo pueden usarse con un argumento; es decir, sólo puede haber un descriptor de entrada y un descriptor de salida. Si se intenta utilizar múltiples descriptores del mismo tipo, Bash producirá un error.

### Operadores de salida estándar

El operador de redirección `>` se utiliza para redirigir la salida de un comando a un archivo. Si no añadimos este operador, por defecto se utilizará el descriptor `/dev/fd/1`.

La siguiente sintaxis `command > filename` redirigirá la salida estándar producida por el comando `command` al archivo `filename`. Es equivalente a escribir `command 1> filename`.

Caben destacar dos aspectos importantes de esta sintaxis:

- Si el archivo no existe, será creado.
- Si el archivo existe, su contenido será reemplazado por la salida del comando.

```shell
$ ls
$ echo "Contenido del archivo" > archivo.txt
$ ls
archivo.txt
$ cat archivo.txt
Contenido del archivo
```

Veamos qué ocurre si utilizamos la misma redirección pero con otro contenido:

```shell
$ ls
archivo.txt
$ echo "Ahora el contenido es diferente" > archivo.txt
$ ls
archivo.txt
$ cat archivo.txt
Ahora el contenido es diferente
```

El operador `>>` realiza la misma operación que `>`, con la diferencia de que añade el contenido de la salida estándar al contenido del archivo en vez de reemplazarlo. Es equivalente a escribir `command 1>> filename`.

```shell
$ ls
archivo.txt
$ echo "Esta es una nueva línea" >> archivo.txt
$ cat archivo.txt
Ahora el contenido es diferente
Esta es una nueva línea
```

Si escribimos un `2` delante del comando de redirección, indicaremos que queremos cambiar la salida estándar de errores a un archivo:

```shell
$ ls archivo.txt archivo_inexistente.txt
ls: no se puede acceder a 'archivo_inexistente.txt': No such file or directory
-rw-rw-r-- 1 usuario usuario 48 Ago 29 20:33 archivo.txt
$ ls -l archivo.txt archivo_inexistente.txt > archivo-estadisticas.txt
ls: no se puede acceder a 'archivo_inexistente.txt': No such file or directory
$ cat archivo-estadisticas.txt
-rw-rw-r-- 1 usuario usuario 48 Ago 29 20:33 archivo.txt
```

Para redirigir STDERR a un archivo:

```shell
$ ls -l archivo.txt archivo_inexistente.txt 2> archivo-errores.txt
$ cat archivo-errores.txt
ls: no se puede acceder a 'archivo_inexistente.txt': No such file or directory
```

Podemos redirigir tanto STDERR como STDOUT a diferentes archivos:

```shell
$ ls -l archivo.txt archivo_inexistente.txt > archivo-estadisticas.txt 2> archivo-errores.txt
$ cat archivo-estadisticas.txt
-rw-rw-r-- 1 usuario usuario 48 Ago 29 20:33 archivo.txt
$ cat archivo-errores.txt
ls: no se puede acceder a 'archivo_inexistente.txt': No such file or directory
```

Para redirigir ambos STDOUT y STDERR a un mismo archivo, usamos la sintaxis `command &> filename`:

```shell
$ ls -l archivo.txt archivo_inexistente.txt &> archivo-todo.txt
$ cat archivo-todo.txt
ls: no se puede acceder a 'archivo_inexistente.txt': No such file or directory
-rw-rw-r-- 1 usuario usuario 48 Ago 29 20:33 archivo.txt
```

También podemos redirigir la salida a `/dev/null` para suprimirla:

```shell
$ ls archivo.txt archivo_inexistente.txt > /dev/null
ls: no se puede acceder a 'archivo_inexistente.txt': No such file or directory
$ ls archivo.txt archivo_inexistente.txt &> /dev/null
archivo.txt
```

### Operadores de entrada

El operador `<` se utiliza para redirigir la entrada al archivo descriptor de la izquierda con el contenido del archivo de la derecha. La siguiente sintaxis `command < filename` (equivalente a `command 0< filename`) leerá el archivo `filename` y volcará su contenido en el _STDIN_ del comando.

```shell
$ echo -e "Esta es la primera línea\nEsta es la segunda línea" > archivo.txt
$ grep "primera" < archivo.txt
Esta es la primera línea
$ grep "tercera" < archivo.txt
```

### Heredocument

Un Heredocument permite pasar múltiples líneas de entrada a un comando sin tener que crear un archivo. Su sintaxis es la siguiente:

```
command << DELIMITER
  TU TEXTO
  CON MÚLTIPLES
  LÍNEAS
DELIMITER
```

La palabra `DELIMITER` puede ser cualquier palabra que quieras, y se utiliza para indicar el final del _heredocument_. 

```shell
$ grep "primera" << EOF
Esta es la primera línea
Esta es la segunda línea
EOF
Esta es la primera línea
```

Si el contenido tiene variables, se sustituyen a menos que las prefijemos con `\` o encerremos el delimitador del _heredoc_ entre comillas simples `'`:

```shell
$ cat > tips.txt << EOF
Para saber el directorio actual podemos usar la variable \$PWD
Ahora mismo estoy en $PWD
EOF
$ cat tips.txt
Para saber el directorio actual podemos usar la variable $PWD
Ahora mismo estoy en /home/usuario
```

### Pipelines

Una _pipeline_ o _pipe_ adjunta la salida estándar (_STDOUT_) de un proceso a la entrada estándar (_STDIN_) de otro. La sintaxis es la siguiente:

```
<command1> <...args> | <command2> <...args> | <command3> <...args> ...
```

```shell
$ curl -s http://metaphorpsum.com/sentences/3 | wc -w
33
$ curl -s http://metaphorpsum.com/paragraphs/3 | grep -io "the" | wc -l
```

### Brace expansion

_Brace expansion_ genera cadenas de texto utilizando las llaves `{` y `}` con caracteres separados por comas:

```shell
$ echo file{1,2,3}
file1 file2 file3
$ mkdir folder-{a,b,c}
$ cp file.txt{,.backup}
```

Puedes crear combinaciones de múltiples expansiones:

```shell
$ echo {a,b,c}{1,2,3,4}
a1 a2 a3 a4 b1 b2 b3 b4 c1 c2 c3 c4
```

### Expansión aritmética

Con el operador `$` y doble paréntesis, podemos realizar operaciones aritméticas:

```shell
$ echo $((34 * 10))
340
$ echo $((24 == 24))
1
```

### Expansión de nombre de archivos

Utiliza caracteres especiales para crear patrones que Bash escaneará para encontrar archivos que coincidan.

El asterisco `*` coincide con cualquier número de caracteres:

```shell
$ ls folder*
folder-a:
folder-b:
folder-c:
```

El interrogante `?` coincide con un carácter:

```shell
$ touch tip{,o,s}.txt
$ ls -l tip?.txt
-rw-rw-r-- 1 usuario usuario 0 Sept 4 16:57 tipo.txt
-rw-rw-r-- 1 usuario usuario 88 Sept 4 16:57 tips.txt
```

Corchetes `[ ]` permiten coincidir caracteres específicos:

```shell
$ touch tiph.txt
$ ls -l tip[oh].txt
-rw-rw-r-- 1 usuario usuario 0 Oct 4 17:00 tiph.txt
-rw-rw-r-- 1 usuario usuario 0 Oct 4 16:57 tipo.txt
```
