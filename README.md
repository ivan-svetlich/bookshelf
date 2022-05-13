# Bookshelf - Books Cataloging & Bookstore App

## Table of contents
* [General Info](#general-info)
* [Technologies](#technologies)
* [Main Features](#main-features)
* [Appearence](#appearence)
* [Setup](#setup)

## General Info
Books cataloging app where users can log their readings, interact with other users through comments and chat service, and buy books available in the store.

*This project was made with learning purposes and is still subject to change.*

## Technologies
### This project is created with:
* C# .NET 5
* TypeScript (version: 4.5.2)
* React (version: 17.0.2)
* Microsoft SQL Server

#### Other relevant technologies used:
* Redux
* JSON Web Tokens (jwt)
* SignalR
* Mercado Pago's Checkout Pro
* React-Bootstrap

## Main Features
#### Registration Process
* Signup form with captcha verification.
* E-mail address verification: an email is sent to the registrant address with a link to activate their account.
#### User Authentication
* User identity is validated using JSON Web Tokens (jwt.)
* Users with Admin Role have the atttribution to add/update/remove books from the store.
#### Book Search
* Book search engine uses the Google Books API to retrieve book information.
* Search page includes filters (search by Title, Author or Publisher) and pagination.
* If the user checks the "Only books available in Bookshelf Store" filter, book info is retrieved from local database.
#### Booklist
* Users can add books to their list and specify "status" (reading, completed, etc.) and "score".
* Booklist entries can be updated/removed.
* Users can download their booklist in .pdf or .csv format
#### Bookshelf Store
* Books are added to Bookshelf Store by users with Admin Role. Admins can also update item prices and remove items from store.
* Books available in Bookshelf Store have a "Buy now!" button in their details page.
* Payment procedure uses Mercado Pago's Checkout Pro feature. Mercado Pago is a secure payment system that offers multiple payment options.
* Payment Webhook notifications sent by Mercado Pago are stored in database.
* Users can see a list of their purchased books.
#### Profile
* User profiles include profile picture, personal info and stats.
* Users can write comments in any user's profile. These comments are public and shown in the "Comments" section.
* A notification is sent to the user when someone writes a comment in their profile.
#### Friends
* Users can send friend request to other users using the "add" button in their profile or searching by username in the "Add friend" page.
* A notification is sent to the user when a friend request is sent to them.
* Friend requests can be accepted or declined.
* User's friends are listed in the "Friends" page.
#### Chat
* The site offers a chat service created with the SignalR library from ASP.NET.
* Users can chat in real time with people in their friend list.
* Chat interface displays user's friend list and each friend's status ("online" or "offline".)
* Chat messages include "sent" and "read" tick marks.
#### Main Page
* The main page includes global data ("Recent Updates" and "Top Books".)
* If user is logged in, their booklist stats and notifications are displayed in the main page.

## Appearence
<p align="center">
<img height="150px" src="https://github.com/ivan-svetlich/bookshelf/blob/main/screenshots/images/2.png"></img> <img height="150px" src="https://github.com/ivan-svetlich/bookshelf/blob/main/screenshots/images/3.png"></img> <img height="150px" src="https://github.com/ivan-svetlich/bookshelf/blob/main/screenshots/images/6.png"></img> <img height="150px" src="https://github.com/ivan-svetlich/bookshelf/blob/main/screenshots/images/10.png"></img> <img height="150px" src="https://github.com/ivan-svetlich/bookshelf/blob/main/screenshots/images/11.png"></img> <img height="150px" src="https://github.com/ivan-svetlich/bookshelf/blob/main/screenshots/images/12.png"></img> <img height="150px" src="https://github.com/ivan-svetlich/bookshelf/blob/main/screenshots/images/13.png"></img> <img height="150px" src="https://github.com/ivan-svetlich/bookshelf/blob/main/screenshots/images/19b.png"></img> <img height="150px" src="https://github.com/ivan-svetlich/bookshelf/blob/main/screenshots/images/22.png"></img>
</p>
<p align="center"><b>More screenshots: https://github.com/ivan-svetlich/bookshelf/tree/main/screenshots</b></p>

## Setup
### Bookshelf Server
1. Set configuration paramaters in **appsettings.json**
2. Launch project with IIS Express or run as a console application
### Bookshelf Client
1. In **bookshelf-client** directory, run ```npm install```
2. Set configuration paramaters in **appConfig.js**
3. Run ```npm start```

