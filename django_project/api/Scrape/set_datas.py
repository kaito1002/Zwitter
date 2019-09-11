import os
import csv
from api.models import Subject


def set_datas(csv_path, ):
    with open(csv_path, 'r') as f:
        reader = csv.reader(f)
        dataset = [row for row in reader]

    # process
    for row in dataset:
        # add to database
        _ = Subject.objects.get_or_create(name=row[2])
        _[0].name = row[2]
        _[0].quarter = row[3]
        _[0].set_grades_from_text_list(row[4])
        _[0].save()
