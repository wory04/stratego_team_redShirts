# JavaScript Game - Stratego

This was our first JavaScript project at Codecool, it is a basic implementation of the core rules and game play of Stratego. It was a one sprint long project what we achieved after one week of studying JavaScript.

## The project

### Stratego Game

- two-player strategic board game
- each player has an army, and the goal is to find the flag of the other army
- each player can move one soldier OR can start a battle per round
- the game has two phase:
    - set up the army based on the player’s strategy
    - battle phase, when the soldiers starting to explore the enemy’s territory and searching for the flag
- the game ends, when one of the players found the flag or can’t move any more

### Technologies

**Frontend:** JavaScript, HTML, CSS

**Backend:** Python with a simple Flask server

### How to run

1. install Python3 on your computer
    eg. on Ubuntu (Shell):
    ```bash
    sudo apt-get update
    sudo apt-get install python3.6
    ```

2. create a virtual environment for the project and activate it

    ```bash
    sudo apt-get python3-venv
    python3 -m venv /path/to/new/virtual/environment
    source /path/to/new/virtual/environment/bin/activate
    ```

3. install dependencies of the project:
    ```bash
    pip3 install -r requirements.txt
    ```

4. run server.py
    ```bash
    python3 server.py
    ```
Click on the given localhost link to play game in a browser.
