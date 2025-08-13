postgres://postgres:postgres@localhost:5432/product
postgres://postgres:postgres@localhost:5432/userdb
postgres://postgres:postgres@localhost:5432/orderdb
postgres://postgres:postgres@localhost:5432/chatdb

docker exec -it postgres-container psql -U postgres -d productdb
docker exec -it postgres-container psql -U postgres -d userdb
docker exec -it postgres-container psql -U postgres -d orderdb

DROP TABLE IF EXISTS "user" CASCADE;
DROP TABLE IF EXISTS "product" CASCADE;
DROP TABLE IF EXISTS "order" CASCADE;
 
Product Service : PORT : 3001
User Service : PORT : 3002
Order Service : PORT : 3003
Store facade : PORT : 3000.  --> API Gateway + Facade // Orchestration Service

Running on local : separate services :
[running npm start , will take the default config and port 3000]
[the variables will need to be removed from the service codes - DB specific variables HOST, PORT, URL etc]

dotenv -e .env.local -- npm start

RELATIONS :

Raw Logic 
Order <hasMany> Product // Can't be direct relation Product <--> OrderItem <--> Order
Product <hasMany> Order // Can't be direct relation Product <--> OrderItem <--> Order
Customer <hasMany> Order
Order <belongsTo> Customer
Order <hasMany> OrderItem
OrderItem <belongsTo> or <HasOne> Product // confusion !!!


| Source Model | Relation Type  | Target Model  | Foreign Key Field        | Description                                      |
|--------------|----------------|---------------|--------------------------|--------------------------------------------------|
| Customer     | hasMany        | Order         | Order.customerId         | A customer can place multiple orders             |
| Order        | belongsTo      | Customer      | Order.customerId         | An order belongs to a single customer            |
| Order        | hasMany        | OrderItem     | OrderItem.orderId        | An order has multiple line items                 |
| OrderItem    | belongsTo      | Order         | OrderItem.orderId        | Each order item belongs to an order              |
| OrderItem    | belongsTo      | Product       | OrderItem.productId      | Each order item refers to a product              |
| Product      | hasMany        | OrderItem     | OrderItem.productId      | A product can appear in many order items         |




Product : 
{
  "productId": "9c678006-8083-48c5-ae6d-c8559e1dfde8",
  "name": "I Phone 16 Pro Max",
  "description": "Best I phone",
  "price": 199000,
  "inStock": true,
  "created_at": "2025-07-24T19:23:29.251Z"
}
                  id                  |  name  |  description   |  price   | instock |       created_at        
--------------------------------------+--------+----------------+----------+---------+-------------------------
 2b8dd40d-658b-48eb-b7ca-d12d6b64b9f2 | Moto X | Motorola Phone | 34000.00 | t       | 2025-07-24 19:54:57.722
User:
{
  "id": "cda82b10-567b-4b2f-9891-a9765509e37d",
  "firstName": "Sumeet",
  "middleName": "",
  "lastName": "Gupta",
  "email": "sumeet.gupta1@sourcefuse.com",
  "phone": "7985220470",
  "address": "HP, GG Kanpur 208001",
  "role": "SuperAdmin",
  "created_at": "2025-07-24T20:24:11.269Z"
}
{
  "id": "4c3eaeb2-d99c-4c3a-a9b2-001f09f9dc6f",
  "firstName": "Raman",
  "middleName": "",
  "lastName": "Shanker",
  "email": "raman.shanker@email.com",
  "phone": "9876789032",
  "address": "rm villa, gehu road, vilas colony, akbarpur",
  "role": "SuperAdmin",
  "created_at": "2025-08-11T05:50:35.999Z"
}
Order:
{
  "id": "598d18b0-f5c9-4c8d-893e-e2ea87c11f85",
  "userId": "cda82b10-567b-4b2f-9891-a9765509e37d",
  "status": "Pending",
  "totalAmount": 0,
  "created_at": "2025-07-24T20:26:41.520Z"
}
OrderItem:
{
  "id": "bb168551-0957-4975-a801-6503f7dfef0b",
  "orderId": "598d18b0-f5c9-4c8d-893e-e2ea87c11f85",
  "productId": "9c678006-8083-48c5-ae6d-c8559e1dfde8",
  "productName": "I Phone 16 Pro Max",
  "quantity": 1,
  "unitPrice": 199000
}
GET Order : 
{
  "id": "598d18b0-f5c9-4c8d-893e-e2ea87c11f85",
  "userId": "cda82b10-567b-4b2f-9891-a9765509e37d",
  "status": "Pending",
  "totalAmount": "0.00",
  "created_at": "2025-07-24T14:56:41.520Z",
  "items": [
    {
      "id": "bb168551-0957-4975-a801-6503f7dfef0b",
      "orderId": "598d18b0-f5c9-4c8d-893e-e2ea87c11f85",
      "productId": "9c678006-8083-48c5-ae6d-c8559e1dfde8",
      "productName": "I Phone 16 Pro Max",
      "quantity": 1,
      "unitPrice": "199000.00"
    }
  ]
}
{ Product, Orders[] }:
{
  "product": {
    "id": "2b8dd40d-658b-48eb-b7ca-d12d6b64b9f2",
    "name": "Moto X",
    "description": "Motorola Phone",
    "price": "34000.00",
    "inStock": true,
    "created_at": "2025-07-24T14:24:57.722Z"
  },
  "orders": [
    {
      "id": "598d18b0-f5c9-4c8d-893e-e2ea87c11f85",
      "userId": "cda82b10-567b-4b2f-9891-a9765509e37d",
      "status": "Pending",
      "totalAmount": "0.00",
      "created_at": "2025-07-24T14:56:41.520Z",
      "items": [
        {
          "id": "bb168551-0957-4975-a801-6503f7dfef0b",
          "orderId": "598d18b0-f5c9-4c8d-893e-e2ea87c11f85",
          "productId": "9c678006-8083-48c5-ae6d-c8559e1dfde8",
          "productName": "I Phone 16 Pro Max",
          "quantity": 1,
          "unitPrice": "199000.00"
        }
      ]
    }
  ]
}


Doubt : 
- In product-service, add Product hasMany Order (LB4 Relations).
    Since we have a microservice setup, hasMany relation in product-service with Order will not work : hasMany should work if both the models are in same codebase or, both the data in same database. Exposing endpoints from Product-Service :
    - GET /products
    - GET /products/{id}
- How will we get the order details from the product service - order service doesn't have a datasource for orders.
- In store-facade, define REST datasources to call product- and order-service, plus service proxies for typed methods.✅
- Implement a StoreController that aggregates product & order data. Test the façade endpoints to confirm combined results.✅
- Create a decorator @FormattedDate() for createdOn / modifiedOn fields.



Findings : 
1. The id is not generated automatically if generated = true; and then we use any defaultFn = 'uuidv4' or anything.
    Other way to do it is using the postgres extension : 'uuid-ossp' and generate_uuid_v4() for default value of id. -> more database oriented setup is required , generally I never like doing it that way.


REDIS 


redis-cli -h localhost -p 6379

KEYCLOAK :

docker run -d --name keycloak -p 8080:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:23.0.7 start-dev