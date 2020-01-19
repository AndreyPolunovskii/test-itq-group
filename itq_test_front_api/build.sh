#!/bin/sh

cp ./src/fconfig_prod.json ./src/fconfig.json

npm i

npm run build

sudo chmod -R 777 ./build

echo копируем картинку на панели закладок
cp ./public/rois.gif ./build/static/media/rois.gif

echo Заменяем путь static на путь main/static в index.html, asset-manifest.json, precache-manifest.*.js и в *.css
sed -i 's/static/main\/static/g' ./build/index.html
sed -i 's/static/main\/static/g' ./build/asset-manifest.json
sed -i 's/static/main\/static/g' ./build/precache-manifest.*.js
sed -i 's/static\/media/main\/static\/media/g' ./build/static/css/*.css

#cp -r  ./build/* ../static/

#cp -r  ./build/static/* ../static/


#chmod -R 777 ../static


echo Building andreyp2009/rois_front:latest
docker build --rm -t andreyp2009/rois_front:latest .
docker push andreyp2009/rois_front

#rm -r ./build
