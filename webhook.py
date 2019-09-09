from wsgiref.simple_server import make_server
import subprocess
import json
import threading
import cgi

# let
key = ''
port = '8080'


def deploy():
    subprocess.run(
        ['sudo', 'bash', '/home/ubuntu/Zwitter/deploy.sh'],
        cwd="/home/ubuntu/Zwitter"
        )


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

    if data['key'] == 'sahfkjhajhdfksjdfs':
        # auth
        message = "OK"
        print("Authorized.")
        deploy_thread = threading.Thread(target=deploy)
        deploy_thread.start()
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
