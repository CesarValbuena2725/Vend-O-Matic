Vend-O-Matic

A simple REST API simulating a beverage vending machine.
Handles coins, inventory, purchases, and change via JSON HTTP endpoints.

Features

Accepts US quarters (one at a time)

Tracks user session coin balance

Inventory management for 3 drinks

Handles purchases, change, and cancellations

Robust input validation and error handling

Fully tested with Jest + Supertest

 ---- Setup Instructions (macOS / Windows) ----

Clone the repo

git clone https://github.com/CesarValbuena2725/Vend-O-Matic.git
cd vend-o-matic

Install dependencies

npm install

Run the server

node server.js

Server will run on: http://localhost:3000

// API Endpoints

1. Insert Coin

Request

PUT /
Content-Type: application/json

{
  "coin": 1
}

Response

204 No Content

Header: X-Coins = <current coin balance>

Errors

400 → missing or invalid coin

2. Cancel Transaction

Request

DELETE /

Response

204 No Content

Header: X-Coins = <coins returned>

3. Get Inventory

Request

GET /inventory

Response

[5, 5, 5]
4. Get Single Beverage

Request

GET /inventory/:id

Response

3

:id = drink index (0–2)

404 → invalid item ID

5. Purchase Beverage

Request

PUT /inventory/:id

Response (success)

200 OK

Headers:

X-Coins = <change returned>

X-Inventory-Remaining = <remaining stock>

Body:

{ "quantity": 1 }

Errors

403 → not enough coins

404 → out of stock or invalid ID

---- Running Tests ----

Tests simulate users with session persistence.

npm test

Uses Jest + Supertest

All endpoints, happy-path and edge cases are tested

Example flows:

Insert coins

Purchase drink

Cancel transaction

Insufficient coins

Out-of-stock handling

*** Notes ***

Coins are tracked per session using express-session.

Inventory is stored in-memory; restarting the server resets stock.

Only quarters (1 coin) are accepted; any other value triggers a 400 error.

Minimal dependencies to keep the system lightweight and easy to maintain.

# Tech Stack

Node.js

Express

express-session

Jest + Supertest (testing)