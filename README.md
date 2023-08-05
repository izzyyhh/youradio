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
export API_KEY=yourkey
```

## Start

```
bundle && npm i
rails db:create
rails db:migrate
rails s
```
