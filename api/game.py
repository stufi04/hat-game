import random

MAX_PLAYERS = 8
MIN_PLAYERS = 2


class Game:

    def __init__(self, player, code):
        self.code = code
        self.players = []
        
        self.team_one_players = []
        self.team_two_players = []

        self.team_scores = {"team_one" : 0, "team_two" : 0}

        self.unplayed_words = []
        self.played_words = []

        self.game_state = 'LOBBY'
        self.round_number = 1

        self.add_player(player)

    # Game setup 

    def add_player(self, player):
        if len(self.players) < MAX_PLAYERS:
            self.players.append(player)

    def add_word(self, word):
        self.unplayed_words.append(word)

    def start_game(self):
        if self.game_state == 'LOBBY' and len(self.players) > MIN_PLAYERS :
            self.game_state = 'PLAYING'
            _assign_teams()
            self.current_team_turn = 'team_one'
            self.current_player_turn = self.team_one_players[0]

    # Game playing

    def peek_next_word(self):
        return self.unplayed_words[0]

    def mark_word_as_guessed(self):
        self.team_scores[self.current_team_turn] = self.team_scores[self.current_team_turn] + 1
        self.played_words(self.unplayed_words.pop(0))

    # Getters

    def get_code(self):
        return self.code

    def get_players(self):
        return self.players

    def get_teams(self):
        return self.team_one_players, self.team_two_players

    def get_team_scores(self):
        return team_scores
    
    def get_current_player(self):
        return team

    def get_game_state(self):
        return self.game_state

    # Private methods

    def _assign_teams():
        random.shuffle(self.players)
        cut = random.randint(0, len(self.players))
        self.team_one_players = self.players[:cut]
        self.team_two_players = self.players[cut:]

    