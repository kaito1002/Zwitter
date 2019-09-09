from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from .models import User, Subject, Exam, Content, Comment
from .serializer import UserSerializer, SubjectSerializer, ExamSerializer
from .serializer import ContentSerializer, CommentSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


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
