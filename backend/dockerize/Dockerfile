From python:3.10.10


WORKDIR /backend

COPY ./ .


RUN pip install -r requirements.txt


CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]