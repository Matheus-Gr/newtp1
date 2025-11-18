FROM python:3.13-slim

WORKDIR /app

RUN pip install redis

COPY . .

EXPOSE 5000

CMD ["python", "run.py"]