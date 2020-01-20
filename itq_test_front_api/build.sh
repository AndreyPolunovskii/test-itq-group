#!/bin/sh

cp ./src/fconfig_prod.json ./src/fconfig.json

npm i

npm run build

sudo chmod -R 777 ./build



#cp -r  ./build/* ../static/

#cp -r  ./build/static/* ../static/


#chmod -R 777 ../static


echo Building andreyp2009/itq_test_front:latest
docker build --rm -t andreyp2009/itq_test_front:latest .
docker push andreyp2009/itq_test_front

#rm -r ./build
