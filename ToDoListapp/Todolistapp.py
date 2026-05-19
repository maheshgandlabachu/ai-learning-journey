# Building Todo List Application
# Day 9 Project

tasks = []

while True:

    print("\nTodo List Menu")
    print("1. Add Task")
    print("2. View Tasks")
    print("3. Delete Task")
    print("4. Exit")

    choice = input("Please choose 1/2/3/4: ")

    # Add Task
    if choice == "1":

        task = input("Enter new task: ")

        tasks.append(task)

        print("Task added successfully!")
        print (tasks)

    # View Tasks
    elif choice == "2":

        if len(tasks) == 0:
            print("No tasks available.")

        else:
            print("\nYour Tasks:")

            for index, task in enumerate(tasks, start=1):
                print(f"{index}. {task}")

    # Delete Task
    elif choice == "3":

        if len(tasks) == 0:
            print("No tasks to delete.")

        else:
            print("\nYour Tasks:")

            for index, task in enumerate(tasks, start=1):
                print(f"{index}. {task}")

            delete_task = int(input("Enter task number to delete: "))

            if 1 <= delete_task <= len(tasks):

                removed_task = tasks.pop(delete_task - 1)

                print(f"Removed task: {removed_task}")

            else:
                print("Invalid task number.")

    # Exit Application
    elif choice == "4":

        print("Goodbye!")
        break

    # Invalid Choice
    else:
        print("Please choose valid option.")