while True:
   
    num1 = float(input("Please enter the number 1: "))
    num2 = float(input("Please enter the number 2: "))

    print("Please select operation from the below Menu: ")
    print("1. Addition")
    print("2. subtraction")
    print("3. Multiplication")
    print("4. Division")
    print("5. Modulus")
    print("0. Quit")

    choice = int(input("Please enter your choice between 1 - 5: "))

    if choice == 0:
        print("khatam! Good bye, Tata")
        break
    elif choice == 1:
        print("Addition of two numbers is :", num1 + num2)
    elif choice == 2:
        print("Subtraction of two numbers is :", num1 - num2)
    elif choice == 3:
        print("Multiplication of two numbers is : ", num1 * num2)
    elif choice == 4:
        if num2 == 0:
            print("Can not divisible")
        else:
            print("Division of two numbers is : ", num1 / num2)
    elif choice == 5:
        print("Remainder of the numbers is : ", num1 % num2)
    else:
        print("Invalid entry! ")
    
    again = input("Please choose yes or no to continue or stop: ")
    if again.lower() == "yes":
        continue
    elif again.lower() == "no":
        break
    else:
        print("invalid entry! Stopping calculator ")
        break

print("Calculator is finished")
