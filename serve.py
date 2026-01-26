
from flask import Flask, jsonify
import socket
import subprocess
import sys
import os

app = Flask(__name__)

@app.route("/", methods=["GET"])
def get_private_ip():
    # Assignment: use socket.gethostname() to get IP
    hostname = socket.gethostname()
    private_ip = socket.gethostbyname(hostname)
    return jsonify({"private_ip": private_ip}), 200


@app.route("/", methods=["POST"])
def start_cpu_stress():
    # Assignment: run stress_cpu.py in a separate process (non-blocking)
    if not os.path.exists("stress_cpu.py"):
        return jsonify({"error": "stress_cpu.py not found in the current directory"}), 500

    subprocess.Popen([sys.executable, "stress_cpu.py"])
    return jsonify({"message": "stress_cpu.py started"}), 202


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
