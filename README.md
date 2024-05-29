# server 2024

> [!NOTE]
> change **<http://localhost:5000/>** to your **process.env.PORT**

## users resource

| url | method | description | permissions | parameters | optional parameters | body | headers | returns | status codes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [http://localhost:5000/users/signin](http://localhost:5000/users/signin) | POST | user sign in | - |||||||
| [http://localhost:5000/users/signin](http://localhost:5000/users/signin) | POST | user sign up | - |||||||
| [http://localhost:5000/users/:id](http://localhost:5000/users/:id)| PUT | update existing user (by *id*)  | current user |||||||

## courses resource

| url | method | description | permissions | parameters | optional parameters | body | headers | returns | status codes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [http://localhost:5000/courses](http://localhost:5000/courses) | GET | get all courses | --- |||||||
| [http://localhost:5000/courses/with-users](http://localhost:5000/courses/with-users) | GET | get full data of all courses (courses with registered users data) | --- |||||||
| [http://localhost:5000/courses/:id](http://localhost:5000/courses/:id) | GET | get course by *id* | --- |||||||
| [http://localhost:5000/courses](http://localhost:5000/courses) | POST | add new course | administrator |||||||
| [http://localhost:5000/courses/:id](http://localhost:5000/courses/:id) | PUT | update existing course (by *id*) | --- |||||||
| [http://localhost:5000/courses/:id](http://localhost:5000/courses/:id) | DELETE | delete existing course (by *id*) | --- |||||||
