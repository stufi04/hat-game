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
    print('Games: ', len(games))
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
    game = games[code]
    if game.get_code() == code:
        game.add_player(name)
        return jsonify({'joined game': True})
    return jsonify({'joined game': False})

@app.route('/<code>/words', methods=['POST'])
def post_words(code):
    for word in request.json:
        games[code].add_word(word)
    print(games[code].unplayed_words)
    return jsonify({'result': 'success'})

@app.route('/<code>/start-game', methods=['GET'])
def start_game(code):
    return jsonify({'started game': games[code].start_game()})


@app.route('/<code>/next-word', methods=['GET'])
def next_word(code):
    return game[code].peek_next_word(request.json)

if __name__ == '__main__':
    app.run()
