from django.contrib import admin
from .models import User, Subject, Exam, Content, Comment
from .models import Post, Like, Share


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    pass


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    pass


@admin.register(Exam)
class ExamAdmin(admin.ModelAdmin):
    pass


@admin.register(Content)
class ContentAdmin(admin.ModelAdmin):
    pass


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    pass


@admin.register(Post)
class Post(admin.ModelAdmin):
    pass


@admin.register(Like)
class Like(admin.ModelAdmin):
    pass


@admin.register(Share)
class Share(admin.ModelAdmin):
    pass
