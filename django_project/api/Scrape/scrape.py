from bs4 import BeautifulSoup
from config.settings import BASE_DIR
import requests
import time
import csv
import os

defalut_csv = os.path.join(
    BASE_DIR,
    'api/Scrape/subjects.csv'
)


def get_subjects_to_csv(write_path=defalut_csv, time_sep=10):
    links = []
    codes = []
    subjects = []
    base_url = 'http://web-ext.u-aizu.ac.jp/official/curriculum/syllabus/'

    # Get Links
    soup = get_soup(url=f"{base_url}/1_J_000.html")

    for td in soup.find_all('td', class_='kamoku'):
        link = td.find_all('a')[0]
        splited = link.text.split(' ')
        codes.append(splited[0])
        subjects.append(' '.join(splited[1:]))
        links.append(base_url + link.attrs['href'])

    # Setup details
    results = []
    for i in range(0, len(links)):
        detail = get_detail(links[i])
        _ = [i, codes[i], subjects[i], detail[0], detail[1]]
        results.append(_)
        write_csv(write_path, results)

        time.sleep(time_sep)


def write_csv(write_path, data):
    try:
        with open(write_path, 'w') as f:
            writer = csv.writer(f)
            writer.writerows(data)
    except Exception as e:
        print(e)


def get_soup(url):
    res = requests.get(url)
    res.encoding = 'utf8'
    return BeautifulSoup(res.text, 'html.parser')


def get_detail(url):
    soup = get_soup(url)

    tables = soup.find_all('td', class_='syllabus-break-word')
    for _ in tables[0].text.split():
        if '期' in _:
            quater = _
            break
    year = tables[1].text.replace(' ', '').replace('\n', '').replace('\r', '').split(',')
    return quater, year


if __name__ == "__main__":
    get_subjects_to_csv()
