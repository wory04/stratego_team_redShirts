from flask import Flask, render_template, request, redirect

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/game')
def game():
    army = [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 8, 8, 9, 10, 11, 11, 11, 11, 11, 11]
    red_player, blue_player = request.args.get('red-player'), request.args.get('blue-player')
    return render_template('game.html', army=army, red_player=red_player, blue_player=blue_player)


if __name__ == '__main__':
    app.run()
