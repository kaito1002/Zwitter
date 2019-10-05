# データのSetup方法

- スクレイピング
- データベースの更新

ともに時間がかかるので注意

``` sh
# Uses from shell(cwd: /path/to/django_project)
$ python manage.py shell
In [0]: from api.Scrape.set_subjects import set_datas
In [1]: from api.Scrape.scrape import get_subjects_to_csv
In [2]: get_subjects_to_csv()
In [3]: set_datas()
```
