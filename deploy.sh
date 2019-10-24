REPO="https://github.com/kaito1002/Zwitter.git"
PROJECT="Zwitter"
OS=$(uname)

sudo docker-compose down

if [ ${OS} = "Linux" ]; then
  cd ${PROJECT}
  git fetch && git merge origin/master
  sed -i -e "s/DEBUG = True/DEBUG = False/g" django_project/config/settings.py
  sed -i -e "s/#//g" docker-compose.yml && \rm docker-compose.yml-e
  cd frontend
  npm install
  npm run build
  cd ..
fi

sudo docker-compose build
sudo docker-compose up -d
