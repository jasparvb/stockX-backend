# <img src="https://raw.githubusercontent.com/jasparvb/stockX-frontend/master/src/images/stockX-logo.png" alt="StockX logo" width="150px" height="auto">  
The purpose of stockX is to make it easy to look up and follow your favorite equities by creating watchlists and adding stocks to them.  
The site is [deployed here](https://objective-kare-05df21.netlify.app/).
The frontend can be [found here on GitHub](https://github.com/jasparvb/stockX-frontend).

## Data
The site gets all it's financial data by combining two APIs:
1. [IEX Cloud](https://iexcloud.io/). The free version of their API allows you to access stock news and quotes.
2. [Tiingo](https://api.tiingo.com/). Used to get stock details and current prices.  

In order to display the data in a graph, the site uses the javascript library Chart.js.

## Features
- Ability to search for stocks and mutual funds.
- Users can create, edit, or delete their account.
- Users with an account are able to create multiple favorites lists and save stocks to the list they choose.
- Users will be able to remove stocks from their lists, and delete lists.

## User Flow
1. On the homepage, the user can start searching for stocks, create an account, or log in.
2. There will be a search bar at the top of the page which the user can use to search for stocks. As the user types, an autocomplete menu appears with matches.
3. Once the user clicks a result it takes him to that page and displays the stock details, including a detailed graph of the price for today. The graph has options for displaying different time ranges, such as the last month, the last 3 months, or the last year.
4. The user will see a button to add the stock to one of his lists, and he can create a new list right there if needed.

## Tech Stack
- Backend: NodeJS, Express, Postgres
- Frontend: ReactJS, Redux, React Router

## Database Diagram
An overview of how the local database is set up.

![](https://raw.githubusercontent.com/jasparvb/stockX-frontend/master/public/db-diagram.jpg)