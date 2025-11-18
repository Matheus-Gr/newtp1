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
    try:
        data = request.json
        print(data)
        channel = data.get("channel")
        user = data.get("user")
        dtype = data.get("type")

        if not channel:
            return jsonify({"error": "Missing 'channel' in request body"}), 400

        if dtype == "message":
            payload = json.dumps({
                "type": "message",
                "msg": data.get("msg"),
                "channel": channel,
                "user": user
            })
        elif dtype == "action":
            marker = data.get("marker")

            marker = "⭕" if marker == "❌" else "❌"

            payload = json.dumps({
                "type": "action",
                "cells": data.get("cells"),
                "channel": channel,
                "user": user,
                "marker": marker
            })
        elif dtype == "enter":
            payload = json.dumps({
                "type": "enter",
                "channel": channel,
                "user": user
            })
        elif dtype == "start":
            payload = json.dumps({
                "type": "start",
                "channel": channel,
                "user": user
            })
        elif dtype == "reset":
            payload = json.dumps({
                "type": "reset",
                "channel": channel,
                "user": user
            })

        r.publish(channel, payload)
        return {"status": "ok"}, 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


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
