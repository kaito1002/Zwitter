from rest_framework import viewsets
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import User, Subject, Exam, Content, Comment
from .serializer import UserSerializer, SubjectSerializer, ExamSerializer
from .serializer import ContentSerializer, CommentSerializer
from django.shortcuts import get_object_or_404
from rest_framework.decorators import action


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(methods=['POST'], detail=True, url_path='login')
    def login(self, request, passwd, pk=None):
        queryset = User.objects.all()
        user = get_object_or_404(queryset, pk=pk)
        success_login = False
        if user is not None and user.auth(passwd):
            success_login = True
        return Response({'success': success_login})


class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ('grade', 'quarter', )


class ExamViewSet(viewsets.ModelViewSet):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ('subject', )


class ContentViewSet(viewsets.ModelViewSet):
    queryset = Content.objects.all()
    serializer_class = ContentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ('exam', 'poster', )


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ('exam', 'sender', 'bef_comment')
