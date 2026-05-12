# Adding calculator history to the caluclator project
# implementing functions in the program

def add(a,b):
    return a + b
def sub(a,b):
    return a - b
def mul(a,b):
    return a * b
def div(a,b):
    if b == 0:
        print("can not divisible")
    else:
        return a / b
def mod(a,b):
    return a % b
history = []
while True:
    a = float(input("Please enter any number: "))
    b = float(input("Please enter any number: "))

    print("Please select operation from the below Menu: ")
    print("1. Addition")
    print("2. subtraction")
    print("3. Multiplication")
    print("4. Division")
    print("5. Modulus")
    print("0. Quit")

    choice = int(input("Please enter the chouce between 1 and 5: "))
    if choice == 0:
        print("invalid choice ! ")
        break
    if choice == 1 :
        print("Addition of two numbers is : ", add(a,b))
        result = add(a,b)
        history.append(f"{a} + {b} = {result}")
    elif choice == 2:
        print("Subtraction of two numbers is: ", sub(a,b))
        result = sub(a,b)
        history.append(f"{a} - {b} = {result}")
    elif choice == 3:
        print("Multiplication of two numbers is : ", mul(a,b))
        result = mul(a,b)
        history.append(f"{a} * {b} = {result}")
    elif choice == 4:
        if b == 0:
            print("Division not possible and invalid")
        else:
            result = div(a,b)
            print("Division of two numbers is : ", div(a,b))
            history.append(f"{a} / {b} = {result}")
        
    elif choice == 5:
        print("Modulus of two numbers is : ", mod(a,b))
        result = mod(a,b)
        history.append(f"{a} % {b} = {result}")
    else:
        print("Wrong choice")
    again = input("Please choose yes or no to continue or not continue this: ")
    if again.lower() == "yes":
        continue
    elif again.lower() == "no":
        break
    else:
        print("Invalid entry")
        break

print("Calculator finished! ")
print("\n Calculation History : ")
for item in history:
    print(item)



