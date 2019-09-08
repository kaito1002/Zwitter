REPO="https://github.com/kaito1002/Zwitter.git"
PROJECT="Zwitter"
OS=$(uname)

sudo docker-compose down
cd ${PROJECT}
git fetch && git reset --hard origin/master

if [ ${OS} = "Linux" ]; then
  cat docker_external.txt >> docker-compose.yml
fi

sudo docker-compose build
sudo docker-compose up -d
