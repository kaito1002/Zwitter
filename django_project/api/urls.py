from rest_framework import routers
from .views import UserViewSet, SubjectViewSet, ExamViewSet
from .views import ContentViewSet, CommentViewSet
from .views import PostViewSet, LikeViewSet, ShareViewSet
from .views import GradeViewSet, QuarterViewSet

router = routers.DefaultRouter()
router.register('users', UserViewSet)
router.register('subjects', SubjectViewSet)
router.register('grades', GradeViewSet)
router.register('quarters', QuarterViewSet)
router.register('contents', ContentViewSet)
router.register('comments', CommentViewSet)
router.register('posts', PostViewSet)
router.register('likes', LikeViewSet)
router.register('shares', ShareViewSet)
