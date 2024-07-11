# Recipes server 2024

> change **<http://localhost:5000/>** to your **process.env.PORT**

This project is a Node.js server for managing recipes. Below are the steps to set up and run the server.

## Prerequisites

Before starting, make sure you have Node.js and MongoDB installed on your system.

- [Node.js](https://nodejs.org/) (version >= 12.x)
- [MongoDB](https://www.mongodb.com/) (Atlas or local installation)

## Installation

- create file .env
- npm install
- npm start

## Users resource

| url | method | description | permissions | parameters | optional parameters | body | headers | returns | status codes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [http://localhost:5000/users/signIn](http://localhost:5000/users/signIn) | POST | user sign in | user | email, password | | | | user object with token | 200, 401, 500 |
| [http://localhost:5000/users/signUp](http://localhost:5000/users/signUp) | POST | user sign up | user | username, email, password, city, role | | | | user object with token | 201, 400, 409, 500 |
| [http://localhost:5000/users/:id](http://localhost:5000/users/:id) | PUT | update existing user (by *id*) | current user or admin | id (in params), user object (in body) | | user object | Authorization token | updated user object | 200, 400, 403, 404, 409, 500 |
| [http://localhost:5000/users/](http://localhost:5000/users/) | GET | get all users | admin | | | | Authorization token | array of user objects | 200, 401, 403, 500 |

## Recipes resource

| url | method | description | permissions | parameters | optional parameters | body | headers | returns | status codes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [http://localhost:5000/recipes/](http://localhost:5000/recipes/) | GET | get all recipes | user | search, page, perPage | | | Authorization token | array of recipe objects | 200, 500 |
| [http://localhost:5000/recipes/:id](http://localhost:5000/recipes/:id) | GET | get recipe by id | user | id (in params) | | | Authorization token | recipe object | 200, 400, 404, 500 |
| [http://localhost:5000/recipes/user/:id](http://localhost:5000/recipes/user/:id) | GET | get recipes by user id | user | userId (in params) | | | Authorization token | array of recipe objects | 200, 404, 500 |
| [http://localhost:5000/recipes/preparationTime/:maxTime](http://localhost:5000/recipes/preparationTime/:maxTime) | GET | get recipes by maximum preparation time | user | maxTime (in params) | | | Authorization token | array of recipe objects | 200, 400, 500 |
| [http://localhost:5000/recipes/](http://localhost:5000/recipes/) | POST | add a new recipe | user | | | recipe object | Authorization token | added recipe object | 201, 400, 409, 500 |
| [http://localhost:5000/recipes/:id](http://localhost:5000/recipes/:id) | PUT | update existing recipe by id | user | id (in params), recipe object (in body) | | recipe object | Authorization token | updated recipe object | 200, 400, 403, 404, 409, 500 |
| [http://localhost:5000/recipes/:id](http://localhost:5000/recipes/:id) | DELETE | delete recipe by id | user | id (in params) | | | Authorization token | success message | 200, 400, 403, 404, 500 |

## Categories resource

| URL | Method | Description | Permissions | Parameters | Optional Parameters | Body | Headers | Returns | Status Codes |
| --- | ------ | ----------- | ----------- | ---------- | ------------------- | ---- | ------- | ------- | ------------ |
| [http://localhost:5000/api/categories/](http://localhost:5000/api/categories/) | GET | Get all categories | Public | None | None | None | None | Array of category objects | 200, 500 |
| [http://localhost:5000/api/categories/:id](http://localhost:5000/api/categories/:id) | GET | Get category by ID | Public | Category ID (in params) | None | None | None | Category object | 200, 400, 404, 500 |
| [http://localhost:5000/api/categories/categoriesWithRecipes](http://localhost:5000/api/categories/categoriesWithRecipes) | GET | Get categories with recipes | Public | None | None | None | None | Array of category objects with populated recipes | 200, 500 |
