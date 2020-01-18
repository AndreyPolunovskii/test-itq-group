#!/bin/sh


echo Building andreyp2009/djangoapi_rois:latest
docker build --rm -t andreyp2009/djangoapi_rois:latest .
docker push andreyp2009/djangoapi_rois
