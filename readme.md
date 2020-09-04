# <img src="https://raw.githubusercontent.com/jasparvb/stockX-frontend/master/public/stockX-logo.png" alt="alt text" width="150px" height="auto">  
The purpose of stockX is to make it easy to look up and follow your favorite stock indices.


## Data
The site gets all it's financial data from [IEX Cloud](https://iexcloud.io/). The free version of their API allows you to access current stock prices.
In order to display the data in a graph, the site uses the javascript library D3.js

## Features
- Ability to search for latest stock prices.
- Users can create, edit, or delete their account
- Users with an account are able to create multiple favorites lists and save stocks to the list they choose.

## User Flow
1. On the homepage, the user will see some graphs from a selection of stock indices, such as the S&P 500, Nasdaq, etc.
2. There will be a search bar at the top of the page which the user can use to search for stocks.

## Tech Stack
- Backend: NodeJS, Express, Postgres
- Frontend: ReactJS, Redux, React Router

## Database Diagram
An overview of how the local database is set up.

![](https://raw.githubusercontent.com/jasparvb/isports-capstone/master/static/img/tables.JPG)