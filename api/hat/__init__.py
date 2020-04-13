from flask import Flask
from flask_socketio import SocketIO

app = Flask(__name__)
socketio = SocketIO(app=app, cors_allowed_origins=['http://localhost:3000'])

from hat import routes
from hat import sockets
