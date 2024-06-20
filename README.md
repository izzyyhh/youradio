# README

written by valentin and izzy

## Needs

### Ruby and Node

Install ruby version specified in `.ruby-version`  
same for nodejs

### Database

**_ Postgres _**, look `config/database.yml`
**_ Redis _**
start postgres `sudo service postgresql start `
start redis `sudo service redis-server start `

### YouTube Data API V3 Key

To run this app, you will need an YouTube Data API V3. Export it as an env variable.

```
export YOUTUBE_DATA_V3_API_KEY=yourkey
```

## Start

```
bundle && npm i
rails db:create
rails db:migrate
rails s
```

## Hello there, welcome to youradio
Enjoy listening to music/watching videos with your friends
Youradio is a place for you and your friends, that lets your friendgroup create a realtime-playlist. Just add a track to the playlist and use the chat to discuss the current sounds. Lets go!

### Getting started!
Start by creating a server for you and your friends. To do this just click on the button at the bottom left (plus sign). After creating your first server just add your friends to it, by clicking on the "add-member icon" at the top right. And you are ready to go! If your friends already own a server, they can just add you the same way! You can see your new server on the left side in the server bar. Yeah!

### Create a playlist!
Listen to music or watch videos together
You have successfully created your first server. Nice! So let's create a playlist. After navigating to your server you can click the plus button at the musicbar at the bottom of the site (between the mic and icon sign). Now just add a youtube-link and you are good to go! If you want to chat with your friends just type in the chat.  To view the video in fullscreen, double click the player. That's it! Enjoy your youradio experience :)

Thank you, Youtube Player API

### NEW! Live Reactions
You always wanted to know what your friends think about your favorite song? We got you! Every listener is now able to react to the currently playing song. We display every listeners reaction in real time. 

### NEW! Public radio serves
You are always curious about other peoples music taste. You never want to stop to discover new music. Just visit YouRadios explore page.  See how many users are listening and join them!


Watch this :): [YouRadio](https://www.youtube.com/watch?v=g1XHK7vz04E)
