from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sock import Sock
import redis
import json

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
    chat = data.get("channel")
    user = data.get("user")
    msg = data.get("msg")

    print(data)
    if not chat or not msg:
        return "faltando dados", 400

    payload = json.dumps({
        "type": "message",
        "msg": msg,
        "channel": chat,
        "user": user
    })

    r.publish(chat, payload)
    return {"status": "ok"}, 200


@sock.route("/ws/<chat>")
def ws_chat(ws, chat):
    pubsub = r.pubsub()
    pubsub.subscribe(chat)

    for msg in pubsub.listen():
        if msg["type"] == "message":
            payload = msg["data"]
            ws.send(payload)


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)
