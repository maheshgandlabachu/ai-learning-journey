#Second day of my AI learning journey
# building a calculator
num1 = int(input("Enter the num1:"))
num2 = int(input("Enter the num2:"))

choice = int(input("Enter your choice between 1 and 4: "))
if choice == 1:
    print("Result:", num1 + num2)
elif choice == 2:
    print("Result:", num1 - num2)
elif choice == 3:
    print("Result:", num1 * num2)
elif choice == 4:
    print("Result:", num1 / num2)
else:
    print("Invalid choice")
                    

print("Addition", num1 + num2)
print("Subraction", num1 - num2)
print("Multipication", num1 * num2)
print("division", num1 / num2)

print("Caluculator is finished  ")
