from django.contrib import admin
from .models import User, Subject, Exam, Content, Comment, File
from .models import Post, Like, Share
from .models import Grade, Quarter, ContentFileList


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    pass


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    pass


@admin.register(Grade)
class GradeAdmin(admin.ModelAdmin):
    pass


@admin.register(Quarter)
class QuarterAdmin(admin.ModelAdmin):
    pass


@admin.register(Exam)
class ExamAdmin(admin.ModelAdmin):
    pass


@admin.register(Content)
class ContentAdmin(admin.ModelAdmin):
    pass


@admin.register(File)
class FileAdmin(admin.ModelAdmin):
    pass


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    pass


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    pass


@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    pass


@admin.register(Share)
class ShareAdmin(admin.ModelAdmin):
    pass


@admin.register(ContentFileList)
class ContentFileListAdmin(admin.ModelAdmin):
    pass
