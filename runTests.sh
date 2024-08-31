#!/bin/bash
if [ -z $1 ]; then
  php phpunit test
else
  php phpunit test/$1
fi

