from email.message import EmailMessage
import smtplib
import ssl
import redis
import json
from time import sleep
from datetime import datetime

r = redis.Redis(host='redis', port=6379, db=0)
pubsub = r.pubsub()
pubsub.subscribe('Email')

emails = ["matheus-gr@hotmail.com"]


def send_email(html_content: str, to_email: str, subject: str):
    from_email = 'gondevtester@gmail.com'
    from_email_password = 'cpua ncha mues cyiw'

    em = EmailMessage()
    em['From'] = from_email
    em['To'] = to_email
    em['Subject'] = subject
    em.add_alternative(html_content, subtype='html')

    context = ssl.create_default_context()

    with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp:
        smtp.login(from_email, from_email_password)
        smtp.sendmail(from_email, to_email, em.as_string())
    print("Email de confirmação enviado!")


for message in pubsub.listen():
    print("Mensagem recebida do canal Jaiminho:", message)
    if message['type'] == 'message':
        try:
            raw = message['data'].decode()

            try:
                payload = json.loads(raw)
            except json.JSONDecodeError:
                print("Mensagem não é JSON válido, ignorando.")
                continue

            user = payload.get("user")
            msg = payload.get("msg")
            channel = payload.get("channel")

            if not user or not msg:
                print("JSON sem campos obrigatórios.")
                continue

            data = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            subject = f"Mensagem de {user}"
            html = f"""
            <h2>Mensagem Recebida</h2>
            <p>O usuário <strong>{user}</strong> enviou a mensagem:</p>
            <blockquote>{msg}</blockquote>
            <p>Data: {data}</p>
            """

            for email in emails:
                send_email(html, email, subject)

        except Exception as e:
            print(f"Erro ao enviar email: {e}")

    sleep(1)
