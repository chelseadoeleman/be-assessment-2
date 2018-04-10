# Bucketlove

A dating application where users will be matched by their own bucket lists, so they can complete their bucket lists together.

## The application

#### Home
![image](/pictures/Home.png)
![image](/pictures/Login.png)

The homepage contains information about the application and how it works. Users will be matched via their bucket lists. When there are a few similarities between two users, they can be matched. When scrolling to the bottom the user can login or sign up.

#### Sign up
![image](/pictures/Register.png)
![image](/pictures/Matchpreferences.png)
User can sign up by filling out a form, which contains questions about themselves. Then the user will proceed to fill out the form, where there will be questions asked about their perfect match. And of course the most important part: filling in their bucket list, so they can be properly matched.

#### Matches
![image](/pictures/Matches.png)
![image](/pictures/Match.png)
Show all the other users who can be a potential match for the user. Find out what other items they have on their bucket list and more information about them.

When you both have a match go chat with each other!

## Install

This is how you install the application bucketlove.

```bash
git clone https://github.com/chelseadoeleman/be-assessment-2.git
cd be-assessment-2
```
Make sure you installed node to start the server.  
First install Homebrew:
```bash
npm install homebrew
```
Or when you have already installed Homebrew make sure it's up to date with:
```bash
brew update
```

Then install node:
```bash
brew install node
```

Then to start the server use the following command, but first you need to complete some other steps.
```bash
npm start
```
The server is running on **localhost:1902**

### Packages
* [argon2](https://www.npmjs.com/package/argon2)
* [body-parser](https://www.npmjs.com/package/body-parser)
* [dotenv](https://www.npmjs.com/package/dotenv)
* [ejs](https://www.npmjs.com/package/ejs)
* [express](https://www.npmjs.com/package/express)
* [express-session](https://www.npmjs.com/package/express-session)
* [mongodb](https://www.npmjs.com/package/mongodb)

Nodemon will automatically restart the server, when you save your changes. Which will make it easier to use when developing.
* [nodemon](https://www.npmjs.com/package/nodemon)


### Database

The Bucketlove application contains a NoSql database. I have chosen MongoDB, because NoSql is more efficiënt if you want to change the data by adding columns or something of the sort. Which will not effect the already existing data. Also with NoSql you don't have to determine the structure of the database beforehand. More information about the differences between SQL and NoSQL, particularly MySQL and MongoDB can be found [here](https://medium.com/xplenty-blog/the-sql-vs-nosql-difference-mysql-vs-mongodb-32c9980e67b2)

To set up the database install mongodb. Make sure you have Homebrew running beforehand.
```bash
brew install mongodb
brew services start mongod
```
Open another tab in the terminal
Chose the location where you want your database to be stored. I've stored the database in **db** like so:
```bash
mkdir db
```
Check if information in the **.env** file is correct. You might want to change the hostname or port. Also make sure your database name matches with DB_NAME in the **.env** file.


## License
 MIT

###### Credits
READ.ME structure [Maikxx](https://github.com/Maikxx/be-assessment-2)
