REPO="https://github.com/kaito1002/Zwitter.git"
PROJECT="Zwitter"
OS=$(uname)

sudo docker-compose down

if [ ${OS} = "Linux" ]; then
  cd ${PROJECT}
  git fetch && git reset --hard origin/master
  cat docker_external.txt >> docker-compose.yml
  cd frontend
  npm install
  npm run build
  cd ..
fi

sudo docker-compose build
sudo docker-compose up -d
