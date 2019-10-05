import os
import csv
from config.settings import BASE_DIR
from api.models import Subject, Grade, Quarter
"""
# Uses from shell(cwd: /path/to/django_project)
$ python manage.py shell
from api.Scrape.set_subjects import set_datas
set_datas()
"""


def set_datas(csv_path=os.path.join(BASE_DIR, 'api/Scrape/subjects.csv')):
    with open(csv_path, 'r') as f:
        reader = csv.reader(f)
        dataset = [row for row in reader]

    # process
    for row in dataset:
        # add to database
        _ = Subject.objects.get_or_create(name=row[2])[0]

        quarters = row[3].split("・")
        grades = row[4].replace(" ", "").replace("'", "")[1:-1].split(",")

        for grade in grades:
            Grade.objects.get_or_create(
                subject=_,
                grade=grade.replace("年", "")
            )

        for quarter in quarters:
            Quarter.objects.get_or_create(
                subject=_,
                quarter=quarter
            )
