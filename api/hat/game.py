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
        self.team_split_players = []

        self.unplayed_words = []
        self.played_words = []

        self.team_scores = {}

        self.game_state = 'LOBBY'
        self.round_number = 1

        self.add_player(player)

    # Game setup 

    def add_player(self, player):
        if len(self.players) < Game.max_players and self.game_state == 'LOBBY':
            self.players.append(player)

    def add_word(self, word):
        if self.game_state == 'LOBBY':
            self.unplayed_words.append(word)

    def start_game(self):
        if self.game_state == 'LOBBY' and len(self.players) >= Game.min_players and len(self.players) % 2 == 0:
            number_of_teams = len(self.players) // 2
            self._assign_teams(number_of_teams)
            self.current_player_index = 0
            self.current_team_turn = self.team_split_players[0][1]
            self.game_state = 'PLAYING'
            socketio.emit('game_started', self.__dict__, room='GameRoom_{code}'.format(code=self.code))
            return True
        return False

    # Game playing

    def peek_next_word(self):
        if len(self.unplayed_words) > 0:
            return self.unplayed_words[0]
        else:
            return "NO MORE WORDS"

    def mark_word_as_guessed(self):
        self.team_scores[self.current_team_turn] = self.team_scores[self.current_team_turn] + 1
        self.played_words.append(self.unplayed_words.pop(0))

    def start_next_player_turn(self):
        random.shuffle(self.unplayed_words)
        self.current_player_index = (self.current_player_index + 1) % len(self.players)
        player, self.current_team_turn = self.team_split_players[self.current_player_index]

        return player

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
