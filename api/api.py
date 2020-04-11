from flask import Flask, request
import random

from game import Game

app = Flask(__name__)
games = []

@app.route('/new-game', methods=['POST'])
def new_game():
    print('Starting new game')
    print(len(games))
    numbers = random.sample(range(10), 4)
    code = ''.join([str(num) for num in numbers])
    games.append(Game(request.json, code))
    return {'code': code}

@app.route('/join-game', methods=['POST'])
def join_game():
    print('Joining a game')
    name = request.json['name']
    code = request.json['code']
    print(name, code)
    for game in games:
        print(game.code)
        if game.code == code:
            game.add_player(name)
            return {'joined game': True}
    return {'joined game': False}

if __name__ == '__main__':
    app.run()
