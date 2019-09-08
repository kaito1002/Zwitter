from rest_framework import serializers
from .models import User, Subject, Exam, Content, Comment


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('name', 'number', 'coin')


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ('name', 'grade', 'quater')


class ExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = ('subject', 'year')


class ContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Content
        fields = ('type', 'data', 'posted_at')


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('content', 'posted_at', 'sender', 'receiver')
