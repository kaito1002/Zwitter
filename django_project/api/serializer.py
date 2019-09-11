from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from .models import User, Subject, Exam, Content, Comment
from .models import Post, Like, Share


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('name', 'number', 'coin', 'passwd')
        extra_kwargs = {
            'coin': {'read_only': True},
            'passwd': {'write_only': True}
            }

    def create(self, validated_data):
        user = User(
            name=validated_data['name'],
            number=validated_data['number'],
            coin=0,
            passwd=make_password(validated_data['passwd'])
        )
        user.save()
        return user


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


class PostSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Post
        fields = ('user', 'posted_at', 'bef_post', 'content')


class LikeSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    post = PostSerializer()

    class Meta:
        model = Like
        fields = ('user', 'post')


class ShareSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    post = PostSerializer()

    class Meta:
        model = Share
        fields = ('user', 'post')
