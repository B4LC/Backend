# Blockchain for LC
## Installation
+ clone this repo
+ change directory to Backend
+ install package: npm install
+ run for dev: npm run start:dev
+ open in browser: ````localhost:3000````

## API

### Register
+ method: post
+ url: ````http://localhost:3000/auth/register````
+ req.body: 
````
{
    "username" : string,
    "email" : string,
    "password" : string,
    "role" : "user"/"bank"
}
````
+ example: 
````
{
    "username" : "dang",
    "email" : "dang@gmail.com",
    "password" : "123456",
    "role" : "user"
}
````

### Login
+ method: post
+ url: 
````http://localhost:3000/auth/login````
+ req.body: 
````
{
    "email" : string,
    "password" : string,
}
````
+ example: 
````
{
    "email" : "dang@gmail.com",
    "password" : "123456",
}
````

### Logout
+ method: post
+ url: ````http://localhost:3000/auth/logout````
+ req.body:
````
{
   "refreshToken": string 
}
````
+ example:
````
{
   "refreshToken": "abc.def.xyz" 
}
````
### Get Salescontract by id
+ method: get
+ url: ````http://localhost:3000/salescontracts/:salescontract_id````

### Get all Salescontract
+ method: get
+ url: ````
http://localhost:3000/salescontracts````

### Create Salescontract
+ method: post
+ url: ````http://localhost:3000/salescontracts/create````
+ req.body: 
````
{
    "importer": username: string,
    "exporter": username: string,
    "issuingBank": username: string,
    "advisingBank": username: string,
    "commodity": string,
    "price": string,
    "paymentMethod": string,
    "additionalInfo": string,
    "deadline": Date
}
````
+ example: 
````
{
    "importer": "BKC Labs",
    "exporter": "An Phat Computer",
    "issuingBank": "MB Bank",
    "advisingBank": "TP Bank",
    "commodity": "pc",
    "price": "10000 USD",
    "paymentMethod": "cash",
    "additionalInfo": "need Invoice, Bill of Lading",
    "deadline": "2023-09-2"
}
````

### Update Salescontract
+ method: patch
+ url: ````http://localhost:3000/salescontracts/:salescontract_id````
+ req.body: 
````
{
    "importer": username: string,
    "exporter": username: string,
    "issuingBank": username: string,
    "advisingBank": username: string,
    "commodity": string,
    "price": string,
    "paymentMethod": string,
    "additionalInfo": string,
    "deadline": Date
}
````
+ example: 
````
{
    "importer": "BKC Labs",
    "exporter": "An Phat Computer",
    "issuingBank": "TP Bank",
    "advisingBank": "MB Bank",
    "commodity": "smartphone",
    "price": "1000 USD",
    "paymentMethod": "cash",
    "additionalInfo": "need Invoice, Bill of Lading",
    "deadline": "2023-9-21"
}
````

### delete Salescontract
+ method: delete
+ url: ````http://localhost:3000/salescontracts/:salescontract_id````

### approve Salescontract
+ method: patch
+ url: ````
http://localhost:3000/salescontracts/:salescontract_id/approve````

### Create LC
+ method: post
+ url: ````http://localhost:3000/letterofcredits/:salescontract_id/create````
+ req.param: 
````
{
    "salesContractID": string,
}
````
+ example: 
````
{
    "salesContractID": "650be4ceb5ec13697abf53b5",
}
````
### Get LC by id
+ method: get
+ url: ````http://localhost:3000/letterofcredits/:letterofcredit_id````
### Get all LC
+ method: get
+ url: ````http://localhost:3000/letterofcredits````
### Update LC
+ method: patch
+ url: ````http://localhost:3000/letterofcredits/:letterofcredit_id````
+ req.param: 
````
{
    "salesContractID": string,
    ...
}
````
+ example: 
````
{
    "salesContractID": "650be4ceb5ec13697abf53b5",
    ...
}
````
### Approve LC
+ method: patch
+ url: ````http://localhost:3000/letterofcredits/:letterofcredit_id/approve````
### Reject LC
+ method: patch
+ url: ````http://localhost:3000/letterofcredits/:letterofcredit_id/reject````
