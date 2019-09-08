from wsgiref.simple_server import make_server
import subprocess
import json
import threading


def deploy():
    subprocess.run(
        ['bash', '/home/ubuntu/Zwitter/deploy.sh'],
        cwd="/home/ubuntu/Zwitter"
        )


def webhook(environ, start_response):
    print("Get Request!")
    status = '200 OK'
    headers = [
        ('Content-type', 'application/json; charset=utf-8'),
        ('Access-Control-Allow-Origin', '*'),
    ]
    start_response(status, headers)
    deploy_thread = threading.Thread(target=deploy)
    deploy_thread.start()

    return [json.dumps({'message': 'OK'}).encode("utf-8")]


httpd = make_server('', 54333, webhook)
print("Serving on port 54333...")
httpd.serve_forever()
