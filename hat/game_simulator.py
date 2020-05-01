from hat.game import Game

game = Game("Guci", 1234)

game.add_player("Stefan")
game.add_player("Plamen")
game.add_player("Milen")
game.add_player("Stefan")

game.add_word("Kurvi")
game.add_word("Qjte")
game.add_word("Piite")
game.add_word("Ogito")
game.add_word("Cherpi")

print(game)

game.start_game()

print(game)

print(game.peek_next_word())
print(game.peek_next_word())

print(game.mark_word_as_guessed())

print(game.get_team_scores())

print(game.peek_next_word())
print(game.start_next_player_turn())
print(game.peek_next_word())
print(game.start_next_player_turn())
print(game.peek_next_word())

print(game.mark_word_as_guessed())
print(game.mark_word_as_guessed())
print(game.mark_word_as_guessed())
print(game.mark_word_as_guessed())
print(game.peek_next_word())

print(game.get_team_scores())

