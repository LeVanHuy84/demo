FROM jenkins/jenkins:lts-jdk17

USER root

# Cài docker CLI
RUN apt-get update && \
    apt-get install -y docker.io

USER jenkins