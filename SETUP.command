#!/bin/bash

bold=$(tput bold)
normal=$(tput sgr0)
BASEDIR=$(dirname "$0")

cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P

printf "
   _    __             ______              ____       __
  | |  / /__  _____   /_  __/___  _____   / __ )___  / /
  | | / / _ \/ ___/    / / / __ \/ ___/  / __  / _ \/ / 
  | |/ /  __/ /__     / / / /_/ / /     / /_/ /  __/ /  
  |___/\___/\___/    /_/  \____/_/     /_____/\___/_/   
                                                        
"

printf "Enter your ${bold}Cleverbot${normal} API Key and press [ENTER]: "
read cleverbotApiKey

printf "Enter your ${bold}YouTube${normal} API Key and press [ENTER]: "
read youTubeApiKey

printf "Enter your ${bold}Freesound${normal} API Key and press [ENTER]: "
read freesoundApiKey

printf "Enter your ${bold}News${normal} API Key and press [ENTER]: "
read newsApiKey

printf "Enter your ${bold}Language Layer${normal} API Key and press [ENTER]: "
read languageLayerApiKey

cat > ".env.local" <<- EOF
REACT_APP_CLEVERBOT_API_KEY=$cleverbotApiKey
REACT_APP_YOUTUBE_API_KEY=$youTubeApiKey
REACT_APP_FREESOUND_API_KEY=$freesoundApiKey
REACT_APP_NEWS_API_KEY=$newsApiKey
REACT_APP_LANGUAGE_LAYER_API_KEY=$languageLayerApiKey
EOF

printf "\n"
printf "Created API Key file"

printf "\n"
printf "Installing dependencies...\n"
brew install yarn
yarn global add serve

printf "\n"
printf "Building...\n"
yarn && yarn build
