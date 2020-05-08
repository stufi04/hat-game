import json
import random
from itertools import cycle
from hat import socketio

class Game:

    max_players = 8
    min_players = 2
    games = {}

    def __init__(self, player, code):
        self.code = code
        self.players = []
        self.players_ready = []
        self.team_split_players = []
        self.teams = []

        self.unplayed_words = []
        self.played_words = []

        self.team_scores = {}

        self.game_state = 'LOBBY'
        self.round_number = 1

        self.players_finished = 0

        self.add_player(player)

    # Game setup 

    def add_player(self, player):
        print('adding player')
        if len(self.players) < Game.max_players and self.game_state == 'LOBBY':
            self.players.append(player)
            self.players_ready.append(False)
            print('emmitting player_joined')


    def add_words(self, player, words):
        if self.game_state == 'LOBBY':
            self.unplayed_words += words
        idx = self.players.index(player)
        self.players_ready[idx] = True
        socketio.emit('words_submitted', {'players': self.players, 'ready': self.players_ready}, room='GameRoom_{code}'.format(code=self.code))

    def start_game(self):
        print(self.game_state, self.players)
        if self.game_state == 'LOBBY' and len(self.players) >= Game.min_players and len(self.players) % 2 == 0:
            number_of_teams = len(self.players) // 2
            self._assign_teams(number_of_teams)
            self.current_player_index = 0
            self.current_team_turn = self.team_split_players[0][1]
            self.teams = self._set_team_names()
            self.game_state = 'PLAYING'
            random.shuffle(self.unplayed_words)
            socketio.emit('game_started', {'code': self.code}, room='GameRoom_{code}'.format(code=self.code))
            return True
        return False

    def _set_team_names(self):
        teams = []
        for idx, score in self.team_scores.items():
            current_team = []
            for (player, team) in self.team_split_players:
                if team == idx:
                    current_team.append(player)
            team_name = '{} & {}'.format(current_team[0], current_team[1])
            teams.append(team_name)
        return teams

    # Game playing

    def peek_next_word(self):
        if len(self.unplayed_words) > 0:
            return self.unplayed_words[0]
        else:
            return "NO MORE WORDS"

    def mark_word_as_guessed(self):
        self.team_scores[self.current_team_turn] = self.team_scores[self.current_team_turn] + 1
        self.played_words.append(self.unplayed_words.pop(0))
        socketio.emit('update_leaderboard', { 'teams': self.teams, 'scores': self.team_scores }, room='GameRoom_{code}'.format(code=self.code))

    def prepare_next_player_turn(self):
        print('Preparing next player turn')
        random.shuffle(self.unplayed_words)
        self.current_player_index = (self.current_player_index + 1) % len(self.players)
        player, self.current_team_turn = self.team_split_players[self.current_player_index]
        self.players_finished = 0
        game_data = {
            'players': self.players,
            'teams': self.teams,
            'scores': self.team_scores,
            'current_player': self.current_player_index,
            'current_team': self.current_team_turn,
            'round': self.round_number
        }
        socketio.emit('turn_loaded', game_data, room='GameRoom_{code}'.format(code=self.code))

        return player

    def next_round(self):
        self.round_number += 1
        self.unplayed_words = self.played_words
        self.played_words = []
        self.prepare_next_player_turn()

    def notify_play_initiated(self):
        socketio.emit('play', {}, room='GameRoom_{code}'.format(code=self.code))

    # Getters

    def get_code(self):
        return self.code

    def get_players(self):
        return self.players

    def get_teams(self):
        return [self._get_team(team_number) for team_number in range(1, (len(self.players) / 2) + 1)]

    def get_team_scores(self):
        return self.team_scores
    
    def get_current_player(self):
        return self.team_split_players[self.current_player_index][0]

    def get_current_team(self):
        return self.team_split_players[self.current_player_index][1]

    def get_game_state(self):
        return self.game_state

    # Private methods

    def __str__(self):
        return 'Game[{}] : players={}, state={}, team_scores={}, teams={}'.format(self.code, self.players, self.game_state, self.team_scores, self.team_split_players)

    def _assign_teams(self, number_of_teams):
        random.shuffle(self.players)
        self.team_split_players = list(zip(self.players, cycle(range(1, number_of_teams + 1))))
        self.team_scores = {team : 0 for team in range(1, number_of_teams + 1)}

    def _get_team(self, team):
        tuple_list = self.search_tuple(self.team_split_players, team)
        return [a_tuple[0] for a_tuple in tuple_list]

    def search_tuple(self, tups, elem):
        return list(filter(lambda tup: elem in tup, tups))

    def to_json(self):
        return json.dumps(self, default=lambda o: o.__dict__)
