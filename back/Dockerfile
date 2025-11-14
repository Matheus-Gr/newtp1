FROM python:3.12-slim

WORKDIR /app

COPY . .

RUN pip install flask flask-cors flask-sock redis

CMD ["python", "app.py"]
