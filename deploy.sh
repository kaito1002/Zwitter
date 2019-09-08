REPO="https://github.com/kaito1002/Zwitter.git"
OS=$(uname)

sudo docker-compose down
git fetch && git reset --hard origin/master

if [ ${OS} = "Linux" ]; then
  docker_external.txt >> docker-compose.yml
fi

sudo docker-compose build
sudo docker-compose up -d
