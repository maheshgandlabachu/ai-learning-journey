#building Rock paper scissors game
#✅ game logic✅ computer choices✅ multiple conditions✅ score tracking
#✅ replay systems

import random

choices = ["rock", "paper", "scissors"]
user_score = 0
computer_score = 0

while True:
    computer_choice = random.choice(choices)
    user_choice = input("what is your choice rock/paper/scissors: ").lower().strip()

    if user_choice not in choices:
        print("wrong pick! pick rock, paper, or scissors.")
        continue

    if user_choice == computer_choice:
        print("It's a tie!")
    elif (
        (user_choice == "rock" and computer_choice == "scissors")
        or (user_choice == "scissors" and computer_choice == "paper")
        or (user_choice == "paper" and computer_choice == "rock")
    ):
        print("You win this round!")
        user_score += 1
    else:
        print("Computer wins this round!")
        computer_score += 1

    print(f"Computer chose: {computer_choice}")

    replay = input("Do you want to play again? yes/no: ")
    if replay.lower().strip() != "yes":
        break

if user_score > computer_score:
    print(f"Hey user! you won against computer! your score is {user_score}")
elif computer_score > user_score:
    print(
        f"Hey user! computer won against you! and the computer score is {computer_score}."
    )
else:
    print(f"It's a draw overall! Both scored {user_score}.")
