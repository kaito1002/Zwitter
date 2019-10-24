from rest_framework import serializers
from .models import User, Subject, Exam, Content, Comment
from .models import Post, Like, Share
from .models import Grade, Quarter


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('pk', 'name', 'number', 'email', 'coin', 'password')
        extra_kwargs = {
            'coin': {'read_only': True},
            'email': {'read_only': True},
            'password': {'write_only': True}
            }

    def create(self, validated_data):
        return User.create_user(
            name=validated_data['name'],
            number=validated_data['number'],
            coin=0,
            password=validated_data['password']
        )


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ('pk', 'name', )


class GradeSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer()

    class Meta:
        model = Grade
        fields = ('pk', 'subject', 'grade')


class QuarterSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer()

    class Meta:
        model = Quarter
        fields = ('pk', 'subject', 'quarter')


class ExamSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer()

    class Meta:
        model = Exam
        fields = ('pk', 'subject', 'year')


class ContentSerializer(serializers.ModelSerializer):
    exam = ExamSerializer()
    poster = UserSerializer()

    class Meta:
        model = Content
        fields = ('pk', 'exam', 'type', 'data', 'poster', 'posted_at')


class CommentSerializer(serializers.ModelSerializer):
    exam = ExamSerializer()
    sender = UserSerializer()
    # bef_comment = CommentSerializer()

    class Meta:
        model = Comment
        fields = ('pk', 'exam', 'posted_at', 'sender', 'data', 'bef_comment')


class PostSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Post
        fields = ('pk', 'user', 'posted_at', 'bef_post', 'content')


class LikeSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    post = PostSerializer()

    class Meta:
        model = Like
        fields = ('pk', 'user', 'post', )


class ShareSerializer(serializers.ModelSerializer):
    # user = UserSerializer()
    # post = PostSerializer()

    class Meta:
        model = Share
        fields = ('pk', 'user', 'post', )
