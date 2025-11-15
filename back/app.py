from flask import Flask, request
from flask_cors import CORS
from flask_sock import Sock
import redis

app = Flask(__name__)
CORS(app)
sock = Sock(app)
r = redis.Redis(host="redis", port=6379, decode_responses=True)


@app.get("/")
def home():
    return "Flask + Redis PubSub ativo", 200


@app.post("/send")
def send():
    data = request.json
    chat = data.get("chat")
    user = data.get("user")

    message = data.get("message")
    if not chat or not message:
        return 'Dados inválidos', 400

    message = f"{user}: {message}"
    r.publish(chat, message)
    return "Mensagem enviada", 200


@sock.route("/ws/<chat>")
def ws_chat(ws, chat):
    pubsub = r.pubsub()
    pubsub.subscribe(chat)
    # ws.send(f"Conectado ao canal: {chat}")

    for msg in pubsub.listen():
        if msg["type"] == "message":
            ws.send(f"({msg['channel']}) {msg['data']}")


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)
