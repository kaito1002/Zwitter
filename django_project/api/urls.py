from rest_framework import routers
from .views import UserViewSet, SubjectViewSet, ExamViewSet
from .views import ContentViewSet, CommentViewSet
from .views import PostViewSet, LikeViewSet, ShareViewSet

router = routers.DefaultRouter()
router.register('users', UserViewSet)
router.register('subjects', SubjectViewSet)
router.register('exams', ExamViewSet)
router.register('contents', ContentViewSet)
router.register('comments', CommentViewSet)
router.register('posts', PostViewSet)
router.register('likes', LikeViewSet)
router.register('shares', ShareViewSet)
