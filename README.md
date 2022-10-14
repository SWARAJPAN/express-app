API for a task management / todo list.

I have published this on Heroku 
 
Returns full list of tasks: https://taskmanagerapi99.herokuapp.com/api/tasks 

Returns full list of users: https://taskmanagerapi99.herokuapp.com/api/users 
 
Returns a list with a single user with the specified ID ('_id' will be different): https://taskmanagerapi99.herokuapp.com/api/users?where={%22_id%22:%226348f2f01aef712d8f88631f%22}

Returns a list of completed tasks:  https://taskmanagerapi99.herokuapp.com/api/tasks?where={%22completed%22:%20true}

Returns a set of tasks: https://taskmanagerapi99.herokuapp.com/api/tasks?where={%22_id%22:{%22$in%22:[%226347e4db027ba277e5c828e7%22,%226347e4db027ba277e5c828e9%22]}}

Returns a list of users sorted by name: localhost:3000/api/users?sort={"name": 1}

Returns a list of users without the _id field:  https://taskmanagerapi99.herokuapp.com/api/users?select={%22_id%22:0}

Returns tasks number from 61 to 80: https://taskmanagerapi99.herokuapp.com/api/tasks?skip=60&limit=20

Returns the total number of documents: 

For tasks :https://taskmanagerapi99.herokuapp.com/api/tasks?count=true

For users : https://taskmanagerapi99.herokuapp.com/api/users?count=true


You can view the entire project code on my Github: https://github.com/SWARAJPAN/express-app

Tech stack: mongoose, nodemon​, mongodb compass, mongo Atlas, express, node js, Heroku
