from rest_framework import viewsets
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import User, Subject, Exam, Content, Comment
from .models import Post, Like, Share
from .models import Grade, Quarter
from .serializer import UserSerializer, SubjectSerializer, ExamSerializer
from .serializer import ContentSerializer, CommentSerializer
from .serializer import PostSerializer, LikeSerializer, ShareSerializer
from .serializer import GradeSerializer, QuarterSerializer
from rest_framework.decorators import action
from datetime import datetime
from django.db.models import Q
from functools import reduce


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    filter_backends = [DjangoFilterBackend]

    @action(methods=['GET'], detail=False, url_path='user_related_exists')
    def subject_exists_user_related(self, request):
        exams = Exam.objects.all().filter(
            reduce(lambda s, t: s | Q(subject_id=t), get_subjects(user=request.user), Q())
        ).values()

        subjects = {}

        for exam in exams:
            if exam['subject_id'] in subjects.keys():
                # 既存
                subjects[exam['subject_id']]['years'].append(exam['year'])
                if subjects[exam['subject_id']]['latest'] < exam['year']:
                    subjects[exam['subject_id']]['latest'] = exam['year']

            else:
                # 新規
                subjects[exam['subject_id']] = {
                    'id': exam['subject_id'],
                    'name': Subject.objects.all().get(id=exam['subject_id']).name,
                    'latest': exam['year'],
                    'years': [exam['year'], ]
                }

        # sort
        for key in subjects.keys():
            subjects[key]['years'].sort(reverse=True)

        res = {
            'subjects': list(subjects.values()),
        }
        return Response(res)

    @action(methods=['GET'], detail=False, url_path='user_related')
    def subject_list_user_related(self, request):
        return Response(Subject.objects.filter(
            reduce(lambda s, t: s | Q(id=t), get_subjects(user=request.user), Q())
        ).values())

    @action(methods=['GET'], detail=True, url_path='years')
    def latest_year(self, request, pk):
        exams = Exam.objects.all().filter(subject_id=pk).values()

        years = []
        for exam in exams:
            if exam['year'] not in years:
                years.append(exam['year'])

        years.sort(reverse=True)
        if len(years) == 0:
            latest = None
        else:
            latest = years[0]

        return Response({'years': years, 'latest': latest})

    @action(methods=['GET'], detail=False, url_path='search')
    def search(self, request):
        subjects = Subject.objects.all().filter(name__contains=request.GET['keyword'])
        return Response(subjects.values())

    @action(methods=['GET'], detail=False, url_path='search_user_related')
    def search(self, request):
        exams = Exam.objects.all().filter(
            subject__name__contains=request.GET['keyword']
        ).filter(
            reduce(lambda s, t: s | Q(subject_id=t), get_subjects(user=request.user), Q())
        ).values()

        subjects = {}

        for exam in exams:
            if exam['subject_id'] in subjects.keys():
                # 既存
                subjects[exam['subject_id']]['years'].append(exam['year'])
                if subjects[exam['subject_id']]['latest'] < exam['year']:
                    subjects[exam['subject_id']]['latest'] = exam['year']

            else:
                # 新規
                subjects[exam['subject_id']] = {
                    'id': exam['subject_id'],
                    'name': Subject.objects.all().get(id=exam['subject_id']).name,
                    'latest': exam['year'],
                    'years': [exam['year'], ]
                }

        # sort
        for key in subjects.keys():
            subjects[key]['years'].sort(reverse=True)

        res = {
            'subjects': list(subjects.values()),
        }
        return Response(subjects.values())


class GradeViewSet(viewsets.ModelViewSet):
    queryset = Grade.objects.all()
    serializer_class = GradeSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ('subject', 'grade', )


class QuarterViewSet(viewsets.ModelViewSet):
    queryset = Quarter.objects.all()
    serializer_class = QuarterSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ('subject', 'quarter', )


class ExamViewSet(viewsets.ModelViewSet):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ('subject', )

    @action(methods=['GET'], detail=False, url_path='user_related')
    def exam_list_user_related(self, request):
        return Response(Exam.objects.all().filter(
            reduce(lambda s, t: s | Q(subject_id=t), get_subjects(user=request.user), Q())
        ).values())


class ContentViewSet(viewsets.ModelViewSet):
    queryset = Content.objects.all()
    serializer_class = ContentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ('exam', 'poster', )

    @action(methods=['GET'], detail=False, url_path='user_related')
    def content_list_user_related(self, request):
        return Response(Content.objects.all().filter(
            reduce(lambda s, t: s | Q(exam_id=t), get_subjects(user=request.user), Q())
        ).values())

    def create(self, request):
        user = request.user
        subject_pk = request.POST['subject']
        year = request.POST['year']
        _type = request.POST['type']
        data = request.POST['data']

        exam = Exam.objects.get_or_create(
            subject=subject_pk,
            year=year
        )[0]
        Content.objects.create(
            exam=exam,
            type=_type,
            data=data,
            poster=user,
        )
        return Response({'success': True})

    def partial_update(self, request, pk):
        content = Content.objects.get(pk=pk)
        params = {
            'subject': content.exam.subject.pk,
            'year': content.exam.year,
            'type': content.type,
            'data': content.data,
        }

        if content.poster == request.user:
            for key in params.keys():
                if key in request.data.keys():
                    # 更新
                    params[key] = request.data[key]

            exam = Exam.objects.get_or_create(
                subject=params['subject'],
                year=params['year'],
            )[0]
            content.exam = exam
            content.type = params['type']
            content.data = params['data']
            content.save()
            return Response({'success': True})
        else:
            return Response({'success': False, 'reason': 'Permission denied.'})

    def update(self, request, pk):
        content = Content.objects.get(pk=pk)
        if request.user != content.user:
            return Response({'success': False, 'reason': 'Permission denied.'})
        exam = Exam.objects.get_or_create(
            subject=request.data['subject'],
            year=request.data['year'],
        )[0]
        content.exam = exam
        content.type = request.data['type']
        content.data = request.data['data']
        content.save()
        return Response({'success': True})

    def destroy(self, request, pk):
        Content.objects.get(pk=pk).delete()
        return Response({'success': True})


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ('exam', 'sender', 'bef_comment')

    def create(self, request):
        exam = Exam.objects.get_or_create(
            subject=request.POST['subject'],
            year=request.POST['year']
        )[0]
        try:
            bef_comment = request.POST['bef_comment']
        except Exception as e:
            print(e)
            bef_comment = -1

        bef_comment = bef_comment if bef_comment == -1 else None
        Comment.objects.create(
            exam=exam,
            bef_comment=bef_comment,
            data=request.POST['data'],
            sender=request.user
        )
        return Response({'success': True})

    def destroy(self, request, pk):
        comment = Comment.objects.get(pk=pk)
        if comment.sender != request.user:
            return Response({'success': False, 'reason': 'Permission denied.'})
        comment.delete()
        return Response({'success': True})


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ('user', 'bef_post')

    def create(self, request):
        try:
            bef_post = request.POST['bef_post']
        except Exception as e:
            print(e)
            bef_post = -1

        bef_post = bef_post if bef_post == -1 else None
        Post.objects.create(
            bef_post=bef_post,
            content=request.POST['content'],
            user=request.user
        )
        return Response({'success': True})

    def destroy(self, request, pk):
        post = Post.objects.get(pk=pk)
        if post.user != request.user:
            return Response({'success': False, 'reason': 'Permission denied.'})
        post.delete()
        return Response({'success': True})


class LikeViewSet(viewsets.ModelViewSet):
    queryset = Like.objects.all()
    serializer_class = LikeSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ('post')


class ShareViewSet(viewsets.ModelViewSet):
    queryset = Share.objects.all()
    serializer_class = ShareSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ('post')


def get_subjects(user) -> list:
    period = get_period(user=user)
    proper_quarter = set([_["subject_id"] for _ in Quarter.objects.filter(
        reduce(lambda s, t: s | Q(quarter=t), period['quarter'], Q())
    ).values()])

    proper_grade = set([_["subject_id"] for _ in Grade.objects.filter(
        grade=period["grade"]
    ).values()])

    return list(proper_grade & proper_quarter)


def get_period(user: User, now=datetime.now()):
    """
    user => grade
    time => quarter(4, 6, 10, 12)
    """
    try:
        grade = user.grade
    except AttributeError:  # Not logined
        grade = 1
    return {
        'grade': grade,
        'quarter': get_quarters(now)
    }


def get_quarters(now):
    month = now.month
    quarters = []
    if month > 10:   # 4 Quarter
        quarters = ["後期", "4学期"]
    elif month > 6:  # 3 Quarter
        quarters = ["後期", "3学期"]
    elif month > 4:  # 2 Quarter
        quarters = ["前期", "2学期"]
    else:            # 1 Quarter
        quarters = ["期", "1学期"]
    return quarters


def base_destroy(request, Model, pk):
    item = Model.objects.get(pk=pk)
    try:
        item.delete()
        success = True
    except Exception as e:
        print(e)
        success = False
    return Response({'success': success})
