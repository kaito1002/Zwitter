from rest_framework import serializers
from .models import User, Subject, Exam, Content, Comment


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('name', 'number', 'coin')


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ('name', 'grade', 'quarter')


class ExamSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer()

    class Meta:
        model = Exam
        fields = ('subject', 'year')


class ContentSerializer(serializers.ModelSerializer):
    exam = ExamSerializer()
    poster = UserSerializer()

    class Meta:
        model = Content
        fields = ('exam', 'type', 'data', 'poster', 'posted_at')


class CommentSerializer(serializers.ModelSerializer):
    exam = ExamSerializer()
    sender = UserSerializer()
    # bef_comment = CommentSerializer()

    class Meta:
        model = Comment
        fields = ('exam', 'posted_at', 'sender', 'bef_comment')
