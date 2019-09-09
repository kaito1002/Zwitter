from django.shortcuts import render
from django.http import HttpResponse
from config.settings import BASE_DIR
import mimetypes
import os


def index(request):
    return render(request, 'index.html')


def file(request, filename):
    path = os.path.join(BASE_DIR, f"build/{filename}")
    with open(path, 'rb') as f:
        data = f.read()
    type = mimetypes.guess_type(filename)[0]
    print(f"return {filename}<{type}>")
    return HttpResponse(data, content_type=type)
