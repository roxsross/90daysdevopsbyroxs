---
sidebar_position: 5
title: Ayuda de comandos y comandos de ayuda
---

# Ayuda de comandos y comandos de ayuda

Se puede botener ayuda de varias formas

## --help

Cuando despues de un comando se escribe `--help` y se presiona enter, muestra una informacíom muy detallada de los parámetros que recibe el comando, adicional en muchos se encuentra información sobre el uso de los parametros

## help

Help es un comando del shell que muestra la ayuda de un comando que vuenga dentro del shell

Ejemplo:
`help cd` -> Muestra la ayuda del comando shell
`help mkdir` -> ERROR!: -bash: help: no help topics match `mkdir'. Try `help help' or `man -k mkdir' or `info mkdir'.

`mkdir` es una utilidad o programa que está fuera del alcance del shell, aunque sea una utilidad que viene detro de linux, no es una que se encuentre internamente dentro del shell

## man

El comando `man` es para visualizar el manual de usuario de un comando en un entorno similar a less (visualizador de archivos).

Ejemplo:

`man mkdir` -> Muestra el uso y los parametros admitidos por

## info

Muestra la información del comando mucho mas explicita que el comando anterior (man), en un entorno similar a less pero al terminar de ver la información del comando, salta al siguiente comando en orden alfabético (esto último en WSL).

Ejemplo:

`man mkdir` -> Muestra el uso y los parametros admitidos por

## whatis

Muestra una descripción muy corta del uso del comando si tiene la información para ello

`whatis mkdir` Muestra: mkdir (1) - make directories
`whatis alias` Muestra: alias: nothing appropriate