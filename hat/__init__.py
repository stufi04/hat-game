from flask import Flask
from flask_socketio import SocketIO

app = Flask(__name__, static_folder='../build', static_url_path='/')
socketio = SocketIO(app=app, cors_allowed_origins="*")

from hat import routes
from hat import sockets
