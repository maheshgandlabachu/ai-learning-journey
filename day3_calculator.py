while True:
    # Second day of my AI learning journey
    # building a calculator
    num1 = float(input("Enter the num1:"))
    num2 = float(input("Enter the num2:"))

    choice = int(input("Enter your choice 1–5 (0 to quit): "))
    if choice == 0:
        print("Goodbye!")
        break
    if choice == 1:
        print("Result:", num1 + num2)
    elif choice == 2:
        print("Result:", num1 - num2)
    elif choice == 3:
        print("Result:", num1 * num2)
    elif choice == 4:
        if num2 == 0:
            print("Cannot divide by zero.")
        else:
            print("Result:", num1 / num2)
    elif choice == 5:
        print("Result:", num1 % num2)
    else:
        print("Invalid Choice")

    

    again = input("Do you want to continue? yes/no: ")
    if again == "yes":
        continue
    elif again == "no":
        break
    else:
        print("Invalid Entry")
        break
        

print("Caluculator is finished  ")