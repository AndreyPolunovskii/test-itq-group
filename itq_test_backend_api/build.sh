#!/bin/sh


echo Building andreyp2009/itq_test_backend_api:latest
docker build --rm -t andreyp2009/itq_test_backend_api:latest .
docker push andreyp2009/itq_test_backend_api
