FROM jenkins/jenkins:lts-jdk17

USER root

# base tools
RUN apt-get update && \
    apt-get install -y \
    docker.io git curl unzip zip jq \
    build-essential python3 python3-pip

# node (version chuẩn hơn)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# allure
RUN npm install -g allure-commandline@2.34.1

# plugins
RUN jenkins-plugin-cli --plugins \
    workflow-aggregator \
    git \
    github \
    pipeline-stage-view \
    docker-workflow \
    credentials-binding \
    ssh-agent \
    timestamper \
    htmlpublisher \
    allure-jenkins-plugin

USER jenkins