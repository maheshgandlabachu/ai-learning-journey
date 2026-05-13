#building a number guess project
# added nested loops and replay logic (05-13-2025)
import random
secret_number = random.randint(1,101)
attempt = 0
while True:
    while True:
        attempt += 1
        user_guess = int(input("what is your guess? :  "))
        if user_guess > secret_number:
            print("guess is too high")
        elif user_guess < secret_number:
            print("guess is too low")
        else :
            print(f"Hurray you did it, your guess is correct and guess number is : {user_guess}")
            break
    replay = input("Do you want to play again? Yes/No: ")
    if replay.lower() == "no":
        break
print(f"You have taken {attempt} attempts to guess the secret number :-) Good job!  ")