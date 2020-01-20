# start from an official image
FROM python:3.7

# arbitrary location choice: you can change the directory
RUN mkdir -p /opt/services/itq_test_backend_api/src

WORKDIR /opt/services/itq_test_backend_api/src

# install our dependencies
# we use --system flag because we don't need an extra virtualenv
COPY Pipfile Pipfile.lock /opt/services/itq_test_backend_api/src/
RUN pip install pipenv && pipenv install --system

# copy our project code
COPY . /opt/services/itq_test_backend_api/src

# expose the port 8000
EXPOSE 5000

# define the default command to run when starting the container
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "run:app"]
