MAX_PLAYERS = 8


class Game:
    players = []
    words = []

    def __init__(self, player, code):
        self.code = code
        self.add_player(player)

    def add_player(self, player):
        if len(self.players) < MAX_PLAYERS:
            self.players.append(player)

    def add_word(self, word):
        self.players.append(word)
