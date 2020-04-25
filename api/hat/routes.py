import random
from flask import request, jsonify
from hat import app
from hat.game import Game

@app.route('/')
def index():
    return render_template('index.html',)

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

@app.route('/<code>/load-first-turn', methods=['GET'])
def start_first_turn(code):
    print('Starting new round')
    game = Game.games[code]
    return jsonify({
        'players'       : game.players,
        'teams'         : game.teams,
        'scores'        : game.team_scores,
        'current_player': game.current_player_index,
        'current_team'  : game.current_team_turn,
        'round'         : game.round_number
    })

@app.route('/<code>/end-turn', methods=['GET'])
def end_turn(code):
    print('Ending turn')
    game = Game.games[code]
    game.players_finished += 1
    if game.players_finished == len(game.players):
        game.prepare_next_player_turn()
    return jsonify({'success': True})

@app.route('/<code>/next-word', methods=['GET'])
def next_word(code):
    print('Next word clicked')
    return jsonify({ 'next_word': Game.games[code].peek_next_word() })

@app.route('/<code>/next-round', methods=['GET'])
def next_round(code):
    print('Preparing next round')
    game = Game.games[code]
    game.next_round()
    return jsonify({'success': True})

@app.route('/<code>/mark-word-as-guessed', methods=['POST'])
def mark_word_as_guessed(code):
    print('Marking word as guessed')
    game = Game.games[code]
    word = request.json['word']

    if (word == game.peek_next_word()):
        game.mark_word_as_guessed()
        return next_word(code)
    else:
        raise Exception('Game flow error')

@app.route('/<code>/play', methods=['GET'])
def play(code):
    print('Play clicked')
    game = Game.games[code]
    game.notify_play_initiated()
    return jsonify({'success': True})
