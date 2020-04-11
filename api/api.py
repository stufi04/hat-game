from flask import Flask, request, jsonify
import random

from game import Game

app = Flask(__name__)
games = {}

@app.route('/health', methods=['GET'])
def health_check():
    return "Healthy"

@app.route('/<code>/debug', methods=['GET'])
def game_state_debug(code):
    return jsonify(games[code])

@app.route('/new-game', methods=['POST'])
def new_game():
    print('Starting new game')
    print(len(games))
    numbers = random.sample(range(10), 4)
    code = ''.join([str(num) for num in numbers])
    new_game = Game(request.json, code)
    games[code] = new_game
    return jsonify(code)

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

@app.route('/<code>/words}', methods=['POST'])
def post_words(code):
    games[code].post_words(request.json)
    for word in request.json:
        games[code].add_word(word)

@app.route('/<code>/next_word', methods=['GET'])
def next_word(code):
    return game[code].peek_next_word(request.json)

if __name__ == '__main__':
    app.run()
