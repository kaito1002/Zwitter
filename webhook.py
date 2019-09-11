from wsgiref.simple_server import make_server
import subprocess
import json
import threading
import cgi

# let
key = ''
port = 54333


def webhook(environ, start_response):
    print('Get Request!')
    status = '200'
    headers = [
        ('Content-type', 'application/json; charset=utf-8'),
        ('Access-Control-Allow-Origin', '*'),
    ]

    form = cgi.FieldStorage(
        fp=environ['wsgi.input'],
        environ=environ,
        keep_blank_values=True
    )

    data = json.loads([_ for _ in form][0])

    if data['key'] == key:
        # auth
        message = "OK"
        print("Authorized.")
    else:
        message = "Fail"
        print("Failed.")

    start_response(f"{status} {message}", headers)

    return [json.dumps(
        {'message': message}
    ).encode("utf-8")]


httpd = make_server('', port, webhook)
print(f"Serving on port {port}...")
httpd.serve_forever()
