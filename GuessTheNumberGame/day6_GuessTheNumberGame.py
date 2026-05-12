#building a number guess project
import random
secret_number = random.randint(1,101)
while True:
    user_guess = int(input("what is your guess? :  "))
    if user_guess > secret_number:
        print("guess is too high")
    elif user_guess < secret_number:
        print("guess is too low")
    else :
        print(f"Hurray you did it, your guess is correct and guess number is : {user_guess}")
        break
    