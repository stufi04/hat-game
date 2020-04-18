import random
from flask import request, jsonify
from hat import app
from hat.game import Game

@app.route('/health', methods=['GET'])
def health_check():
    return "Healthy"

@app.route('/<code>/debug', methods=['GET'])
def game_state_debug(code):
    return Game.games[code].to_json()

@app.route('/new-game', methods=['POST'])
def new_game():
    print('Starting new game')
    numbers = random.sample(range(10), 4)
    code = ''.join([str(num) for num in numbers])
    new_game = Game(request.json, code)
    Game.games[code] = new_game
    print('Games: ', len(Game.games))
    return jsonify(code)

@app.route('/join-game', methods=['POST'])
def join_game():
    print('Joining a game')
    name = request.json['name']
    code = request.json['code']
    print(name, code)
    game = Game.games[code]
    if game.get_code() == code:
        game.add_player(name)
        return jsonify({'joined game': True})
    return jsonify({'joined game': False})

@app.route('/<code>/words', methods=['POST'])
def post_words(code):
    for word in request.json:
        Game.games[code].add_word(word)
    print(Game.games[code].unplayed_words)
    return jsonify({'result': 'success'})

@app.route('/<code>/start-game', methods=['GET'])
def start_game(code):
    return jsonify({'started game': Game.games[code].start_game()})

@app.route('/<code>/start-turn', methods=['GET'])
def start_turn(code):
    game = Game.games[code]
    return jsonify({
        'players'       : game.players,
        'teams'         : game.teams,
        'scores'        : game.team_scores,
        'current_player': game.current_player_index,
        'current_team'  : game.current_team_turn
    })

@app.route('/<code>/next-word', methods=['GET'])
def next_word(code):
    return Game.games[code].peek_next_word()
