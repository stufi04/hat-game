from flask import request
from flask_socketio import join_room, leave_room, send
from hat import socketio
from hat.game import Game

@socketio.on('connect')
def on_connect():
    print('user with session id {session_id} has connected!'.format(session_id=request.sid))

@socketio.on('disconnect')
def on_disconnect():
    print('user with session id {session_id} has disconnected!'.format(session_id=request.sid))

@socketio.on('join_game')
def on_join_game(json):
    player_name = json['player_name']
    game_code = json['game_code']
    game_room = 'GameRoom_{}'.format(game_code)
    game = Game.games[game_code]
    join_room(room=game_room)
    msg = 'Player {player_name} joined {game_room}'.format(player_name=player_name, game_room=game_room)
    send(msg, room=game_room, broadcast=True)
    socketio.emit('player_joined', {'players': game.players, 'ready': game.players_ready}, room='GameRoom_{code}'.format(code=game_code))

@socketio.on('leave_game')
def on_leave_game(json):
    player_name = json['player_name']
    game_code = json['game_code']
    game_room = 'GameRoom_{}'.format(game_code)
    leave_room(room=game_room)
    msg = 'Player {player_name} left {game_room}'.format(player_name=player_name, game_room=game_room)
    print(msg)
    send(msg, room=game_room, broadcast=True)
