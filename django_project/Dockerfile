FROM python:3.7.2-stretch
WORKDIR /django_app
COPY . /django_app
RUN python -m pip install --upgrade pip
RUN pip install -r requirements.txt
CMD ["uwsgi", "--ini", "uwsgi.ini"]
