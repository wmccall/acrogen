#!/bin/bash
yarn run build
gcloud config set project acrogen-prod
gcloud app deploy
