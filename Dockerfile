FROM jenkins/jenkins:lts-jdk17

USER root

# Cài docker CLI
RUN apt-get update && \
    apt-get install -y docker.io git curl

# Cài node + npm global
RUN apt-get install -y nodejs npm

# Cài allure-commandline
RUN npm install -g allure-commandline@2.34.1

USER jenkins