CREATE USER itq_test with encrypted password 'hello2012';
CREATE DATABASE itq_test_db;
GRANT ALL PRIVILEGES ON DATABASE itq_test_db TO itq_test;
