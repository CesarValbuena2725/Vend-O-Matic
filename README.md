# Vend-O-Matic

A simple **REST API** simulating a beverage vending machine.  
Handles coins, inventory, purchases, and change via JSON HTTP endpoints.

## Features

- Accepts US quarters (one at a time)
- Tracks user session coin balance
- Inventory management for 3 drinks
- Handles purchases, change, and cancellations
- Robust input validation and error handling
- Fully tested with Jest + Supertest

## Setup Instructions (macOS / Windows)

```bash
# 1. Clone the repository
git clone https://github.com/CesarValbuena2725/Vend-O-Matic.git
cd vend-o-matic

# 2. Install dependencies
npm install

# 3. Run the server
node server.js
Server will run on: http://localhost:3000
API Endpoints
1. Insert Coin
httpPUT /
Content-Type: application/json

{
  "coin": 1
}
Response

204 No Content
Header: X-Coins: <current coin balance>

Errors

400 → missing or invalid coin

2. Cancel Transaction
httpDELETE /
Response

204 No Content
Header: X-Coins: <coins returned>

3. Get Inventory (all drinks)
httpGET /inventory
Response
JSON[5, 5, 5]
4. Get Single Beverage
httpGET /inventory/:id
Response

3 (example – number remaining)
:id = drink index (0–2)

Errors

404 → invalid item ID

5. Purchase Beverage
httpPUT /inventory/:id
Content-Type: application/json

{
  "quantity": 1
}
Success Response

200 OK
Headers:
X-Coins: <change returned>
X-Inventory-Remaining: <remaining stock>


Errors

403 → not enough coins
404 → out of stock or invalid ID

Running Tests
Bashnpm test

Uses Jest + Supertest
Covers all endpoints, happy paths, and edge cases
Example flows tested:
Insert coins → Purchase drink → Cancel transaction
Insufficient coins
Out-of-stock handling


Tech Stack

Node.js
Express
express-session
Jest + Supertest (testing)

Testing with Postman
You can manually test the vending machine API using Postman (or any HTTP client).
1. Setup Postman

Open Postman
Create a new collection called Vend-O-Matic
Make sure cookies are enabled (important for session tracking):
Settings → General → Enable “Cookie Jar”

2. Add Requests to the Collection
Insert Coin

Method: PUT
URL: http://localhost:3000/
Body → raw JSON:JSON{
  "coin": 1
}
Headers: Content-Type: application/json
Expected: 204 No Content, header X-Coins = current balance

Cancel Transaction

Method: DELETE
URL: http://localhost:3000/
Expected: 204 No Content, header X-Coins = coins returned

Get All Inventory

Method: GET
URL: http://localhost:3000/inventory
Expected: [5, 5, 5] (or current stock)

Get Single Beverage

Method: GET
URL: http://localhost:3000/inventory/0
Expected: number of items remaining
Errors: 404 for invalid ID

Purchase Beverage

Method: PUT
URL: http://localhost:3000/inventory/0
Body:JSON{
  "quantity": 1
}
Expected (success):
200 OK
Headers: X-Coins, X-Inventory-Remaining


3. Example Flow in Postman

Insert 2 coins
PUT / → X-Coins: 1PUT / → X-Coins: 2
Purchase drink 0
PUT /inventory/0 → Body: { "quantity": 1 }
→ Headers: X-Coins: 0, X-Inventory-Remaining: 4
Insert extra coins and check change
Insert 3 coins → Purchase drink 1 → X-Coins: 1 (change returned)
Cancel transaction
DELETE / → X-Coins = coins returned

Notes for Postman

Each user/session is tracked by cookies
If cookies are cleared → coin balance resets
This simulates multiple users if you open Postman in separate incognito windows or clear cookies

Additional Notes

Coins are tracked per session using express-session
Inventory is stored in-memory — restarting the server resets stock
Only quarters (value = 1) are accepted — any other value → 400 error
Minimal dependencies to keep the system lightweight and easy to maintain