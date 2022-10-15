import requests

# Create
def create_user():
    firstname = input("Firstname: ")
    lastname = input("Lastname: ")
    address1 = input("Address1: ")
    address2 = input("Address2: ")
    phone = input("Phone Number: ")
    email = input("Email: ")

    if len(firstname) > 0 and len(lastname) > 0 and len(address1) > 0 and len (address2) > 0 and len(phone) > 0 and len(email) > 0:
        # Data to send in post request.
        data = {'fname':firstname, 'lname':lastname, 'address1':address1, 'address2':address2, 'phone':phone, 'email':email}

        # POST request to node server
        res = requests.post('http://127.0.0.1:3000/profiling', json=data)
        returned_data = res.json()
        print(returned_data)
        user_choice()

    else:
        print('Complete the Form')
        create_user()    


#Read
def read_user():
    res = requests.get('http://127.0.0.1:3000/profiling')
    returned_data = res.json()
    for data in returned_data:
        print(data)
    user_choice()



#Update
def update_user():

    try: 
        profile_id = int(input("User ID: "))
        firstname = input("Firstname: ")
        lastname = input("Lastname: ")
        address1 = input("Address1: ")
        address2 = input("Address2: ")
        phone = int(input("Phone Number: "))
        email = input("Email: ")

        if len(str(profile_id)) > 0 and len(firstname) > 0 and len(lastname) > 0 and len(address1) > 0 and len (address2) > 0 and len(str(phone)) > 0 and len(email) > 0:    

            # Data to send in put request.
            data = {'fname':firstname, 'lname':lastname, 'address1':address1, 'address2':address2, 'phone':phone, 'email':email, 'profile_id':profile_id}

            # The PUT request to the node server
            res = requests.put('http://127.0.0.1:3000/profiling',json=data)
            returned_data = res.json()
            print(returned_data)
            user_choice()

        else:
            print("Complete the Form")
            update_user()

    except ValueError:
        print('ValueError: Integer number required')
        update_user()
    

#delete_user
def delete():
    try:
        profile_id = int(input("USER ID: "))

        # Data to send in delete request.
        data = {'profile_id':profile_id}

        # The DELETE request to the node server
        res = requests.delete('http://127.0.0.1:3000/profiling',json=data)
        returned_data = res.json()
        print(returned_data)
        user_choice()

    except ValueError:
        print('ValueError: Integer number required')
        delete()
    
 


def read_detection():
    res = requests.get('http://127.0.0.1:3000/motion')
    returned_data = res.json()
    for data in returned_data:
        print(data)
    user_choice()


#user selection    
def user_choice():

    while True:
        choice = input("Enter the corresponding number of choice:\n(1) Create Data\n(2) Read Data\n(3) Update Data\n(4) Delete Data\n(5) Quit\nYour choice:")

        if choice == '1':
            create_user()
        if choice == '2':
            read_user()
        if choice == '3':
            update_user()
        if choice == '4':
            delete()
        if choice == '5':
            print("System quit!")
            break

user_choice()