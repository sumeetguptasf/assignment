
 id |  client_id  |  client_secret  |       redirect_url        | access_token_expiration | refresh_token_expiration | auth_code_expiration |   secret    |          created_on           |          modified_on          | deleted | deleted_on | deleted_by | created_by | modified_by | client_type 
----+-------------+-----------------+---------------------------+-------------------------+--------------------------+----------------------+-------------+-------------------------------+-------------------------------+---------+------------+------------+------------+-------------+-------------
  1 | test-client | test-secret-123 | http://localhost/callback |                     900 |                    86400 |                  180 | hash-method | 2025-08-12 12:02:15.567965+00 | 2025-08-12 12:02:15.567965+00 | f       |            |            |            |             | public

-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Move the tables from main to public schema :
 DO $$
DECLARE
    tbl RECORD;
BEGIN
    FOR tbl IN
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'main'
    LOOP
        EXECUTE format('ALTER TABLE main.%I SET SCHEMA public;', tbl.tablename);
    END LOOP;
END$$;

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
INSERT INTO jwt_keys (key_id, public_key, private_key, created_on)
VALUES (
  'my-key-1',
  $$-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA8xhpLBbUpyecfoKiH3QW
aOYk9phW+UnE9NpBg2ty1fzO87770hOumDMBhe16jKl+UIdVYGGwH2R4+gOZI0Cq
p74pxNr8QsO+Lj8TeRNQfUOF7TxaHkuZZsyq5vcwssX+6G1SlxrrJNMTzRTccpDz
LsBr8n685DSpjFxjCVVoUk5Jd3DVOHd/7kuqDfzTvcwKAes7Hfamxe9A1lDILbeW
gMUHzBvLSdx5QDpdOfi3v8YI+4Gw4x29rmPr7jDe5rPa1rNUua3zKCjxoCH69zCN
iADIgM4JwaQ+cpuYUaaPk8JvSjZw6UCgH0vrpAWi5BB12P01w1Vmo/5mGvbXiJgi
iQIDAQAB
-----END PUBLIC KEY-----$$,
  $$-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDzGGksFtSnJ5x+
gqIfdBZo5iT2mFb5ScT02kGDa3LV/M7zvvvSE66YMwGF7XqMqX5Qh1VgYbAfZHj6
A5kjQKqnvinE2vxCw74uPxN5E1B9Q4XtPFoeS5lmzKrm9zCyxf7obVKXGusk0xPN
FNxykPMuwGvyfrzkNKmMXGMJVWhSTkl3cNU4d3/uS6oN/NO9zAoB6zsd9qbF70DW
UMgtt5aAxQfMG8tJ3HlAOl05+Le/xgj7gbDjHb2uY+vuMN7ms9rWs1S5rfMoKPGg
Ifr3MI2IAMiAzgnBpD5ym5hRpo+Twm9KNnDpQKAfS+ukBaLkEHXY/TXDVWaj/mYa
9teImCKJAgMBAAECggEAIHXngVQmdDrwBN1OZxMkykAaZR/wKTHmY2hg1tAlEZmZ
oZGkkFJBfkr9TpQTSQTO/FN98onzhIBG6Tehc27MpZaD1FNbhlIbVeiP90W9eeSS
Kxy5JJIlZe/kIvA/Z/fUCIGkms8k4WdwHZ1GAeRaHKmOyzQ3kTojqRL4by7LkzBk
s8pRNngv6/C5CK86S50NolBPrszY6NCbtHobo9H+O+PPCnEn2kDA6pHP4zG93t+e
lUsbhDsQAwi5PhYjkX17xs1pJz60PQG9K3CrQwR17OpuvUAj3fdyfhDU/36OI1kv
7TJPkT1o/nh7rNrNOjrp84PwbTCwTaEKNGA+g7L3WwKBgQD6GRoO37yIJ8VsqUVc
+R5V5lnMpqvsrtxuwvc+DqrW0dDMAsNyIZiGUW1jNQ973D1F+AH/JOQVH40TNswY
LgH9PxIUglr3YPtzxK+osZjWLtQI8FLKzjRKoQ8+USBdAJ3vjipu70QNPIl493i2
FKmQws3plZ1KR2KecphVF3CHHwKBgQD41QERTLXOz/WN1TKNa3hm2pBpoY1dUsdj
+n/uVdKWPCh/GcLrQWpMxRLyX8hROIZiPxoBfzxd9FnR4a2FCM7jAqq5rkbiBi4b
DJUFAjJIQgUnhSn42ic/4ufKW+yl9k5x5/L2z17D43FbywD4Yj6D5ROe7qaUGwDB
2Tf9uMHpVwKBgQC1XKCl6p+ISPcEzldrjYfvGOVD4BXKxB87/wxWJ0LCF1MHrnVW
/X/i34eoqqC43EReyfOAt5riqoeeSF2Gp05v/F27G7ClteGC2T3c4jUIFNtURBp1
0UTgXZ11PlVuu/TL9FdXLRE3XBAA9czGlYNFY874tbNjWxLr/gPzqNTEVwKBgDtv
dW/SaOLbXYXhVM/eycWXk0MH6aJO8X16CjC9oy1rdSjW2G4lE+T+dcYbBtgPrlmt
ROLyp1Kx2Pp+81mBfxlOO8VaUWgPndesK7QkkCoeSujjr+DXCuUBp+f4CRCjQp2G
j8xQQAx+OUd5t+OcY95RS1x9GKDrykSDRBKAnSDFAoGBANI+dmNDvRgeksXT1LFE
eoq6kyQ4DUPf5Id8LQENkNWQepxU9uh+zmIRlWsYVIjUWKuv5gNvyuAKNhxxsH18
Brb/Z2o94Wfu50DvLjqPXNNveqdc/eXjQCjAJN/s8cbfcX5F1sPq+O92e8Lrl101
NIz4kdM5AwwvxI9aR3YBDJXM
-----END PRIVATE KEY-----$$
,
  NOW()
);


-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

auth-service : 
authentication-service : 
chat-service : 
notification-service : 
order-service : 
product-service :
user-service : 
uts-user-service :


-----------

User Service : 
Request : /users/signup
Method: POST
Body:
{
  "username": "sumeet14gupta",
  "firstName": "Sumeet",
  "middleName": "",
  "lastName": "Gupta",
  "email": "sumeet14gupta@example.com",
  "phone": "+91-XXXXXXXXXX",
  "address": "New Delhi, India",
  "role": "SuperAdmin",
  "password": "password"
}
{
  "id": "ce848c5d-e6bc-4c56-8a4a-056cba4c53d2",
  "username": "sumeetg",
  "firstName": "Sumeet",
  "middleName": "Kumar",
  "lastName": "Gupta",
  "email": "sumeetkumargupta@gmail.com",
  "phone": "7985220470",
  "address": "48 jk l",
  "role": "SuperAdmin",
  "created_at": "2025-08-13T19:22:48.794Z"
}
Response:
{
  "id": "7b208acb-be9e-4ec6-ab29-8b6b1e34c3fe",
  "username": "sumeet14gupta",
  "firstName": "Sumeet",
  "middleName": "",
  "lastName": "Gupta",
  "email": "sumeet14gupta@example.com",
  "phone": "+91-XXXXXXXXXX",
  "address": "New Delhi, India",
  "role": "SuperAdmin",
  "created_at": "2025-08-13T08:29:31.521Z"
}
for email : sumeetkumargupta@gmail.com. | valid : 1 day
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNlODQ4YzVkLWU2YmMtNGM1Ni04YTRhLTA1NmNiYTRjNTNkMiIsImVtYWlsIjoic3VtZWV0a3VtYXJndXB0YUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InN1bWVldGciLCJyb2xlIjoiU3VwZXJBZG1pbiIsImlhdCI6MTc1NTE2MDQ4MCwiZXhwIjoxNzU1MjQ2ODgwfQ.npA1pOcxuvIOLAHoxxMFrjVJfxoV3tqy0bEFc23nSUk"
}


Check if a Subscriber user is abe to create a product or not ::::
{
  "username": "sumeetgupta",
  "firstName": "Sumeet",
  "middleName": "",
  "lastName": "Gupta",
  "email": "sumeetgupta@example.com",
  "phone": "9453041659",
  "address": "New Delhi, India",
  "role": "Subscriber",
  "password": "password"
}
Created USER : 
{
  "id": "d73cade4-43f2-4a25-b779-4e34f31c2f70",
  "username": "sumeetgupta",
  "firstName": "Sumeet",
  "middleName": "",
  "lastName": "Gupta",
  "email": "sumeetgupta@example.com",
  "phone": "9453041659",
  "address": "New Delhi, India",
  "role": "Subscriber",
  "created_at": "2025-08-14T09:39:52.435Z"
}
Take the email and password and login to get the JWT token :
{
  "email": "sumeetkumargupta@gmail.com"",
  "password": "password"
}
{
  "email": "sumeetgupta@example.com",
  "password": "password"
}
Got the token :
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ3M2NhZGU0LTQzZjItNGEyNS1iNzc5LTRlMzRmMzFjMmY3MCIsImVtYWlsIjoic3VtZWV0Z3VwdGFAZXhhbXBsZS5jb20iLCJ1c2VybmFtZSI6InN1bWVldGd1cHRhIiwicm9sZSI6IlN1YnNjcmliZXIiLCJpYXQiOjE3NTU3NjIyMTgsImV4cCI6MTc1NTg0ODYxOH0.e-hy9SS1szOQZIFJyfBkvwZnt1bQLVSVr01Nm_rWvlc"
}
JWT.IO : token details : 
{
  "id": "d73cade4-43f2-4a25-b779-4e34f31c2f70",
  "email": "sumeetgupta@example.com",
  "username": "sumeetgupta",
  "role": "Subscriber",
  "iat": 1755164447,
  "exp": 1755250847
}
use this token in the store-facade service to create a product :
Request :
POST /facade/products
{
  "id": "97eb92ba-39cd-45c2-8867-cb7a5d7d6a44",
  "name": "Kaala Hit",
  "description": "Best macchar marne waala spray",
  "price": 220,
  "inStock": true,
  "created_at": "2025-08-19T21:55:43.679Z"
}


------------------------
Auth flow across services:

	1.	User logs in → login() issues JWT signed with process.env.JWT_SECRET.
	2.	Client sends token to any service.
	3.	That service calls jwt.verify(token, process.env.JWT_SECRET) internally.
	4.	If valid, request is authenticated — without calling user-service.

// DESIGN

1. the product service is not directly accessible , so only facade service will call all the required product apis ,
authorization can effectively be implemented only in facade service.


[error]
Request GET /users/me failed with status code 500. ResolutionError: The key 'security.user' is not bound to any value in context InterceptedInvocationContext-n65WBrJ2T4ugmH4zM-2XkQ-8 (context: InterceptedInvocationContext-n65WBrJ2T4ugmH4zM-2XkQ-8, binding: security.user, resolutionPath: @UserFacadeController.prototype.me[0])
    at InterceptedInvocationContext.getValueOrPromise (/Users/sumeet.gupta/Desktop/Sourcefuse/Assignment/Assignment/facades/store-facade/node_modules/@loopback/context/src/context.ts:904:13)
    at /Users/sumeet.gupta/Desktop/Sourcefuse/Assignment/Assignment/facades/store-facade/node_modules/@loopback/context/src/resolver.ts:157:20
    at /Users/sumeet.gupta/Desktop/Sourcefuse/Assignment/Assignment/facades/store-facade/node_modules/@loopback/context/src/resolution-session.ts:127:13
    at tryCatchFinally (/Users/sumeet.gupta/Desktop/Sourcefuse/Assignment/Assignment/facades/store-facade/node_modules/@loopback/context/src/value-promise.ts:222:14)
    at tryWithFinally (/Users/sumeet.gupta/Desktop/Sourcefuse/Assignment/Assignment/facades/store-facade/node_modules/@loopback/context/src/value-promise.ts:197:10)
    at Function.runWithInjection (/Users/sumeet.gupta/Desktop/Sourcefuse/Assignment/Assignment/facades/store-facade/node_modules/@loopback/context/src/resolution-session.ts:126:26)
    at resolve (/Users/sumeet.gupta/Desktop/Sourcefuse/Assignment/Assignment/facades/store-facade/node_modules/@loopback/context/src/resolver.ts:141:38)
    at /Users/sumeet.gupta/Desktop/Sourcefuse/Assignment/Assignment/facades/store-facade/node_modules/@loopback/context/src/resolver.ts:244:12
    at resolveList (/Users/sumeet.gupta/Desktop/Sourcefuse/Assignment/Assignment/facades/store-facade/node_modules/@loopback/context/src/value-promise.ts:169:28)
    at resolveInjectedArguments (/Users/sumeet.gupta/Desktop/Sourcefuse/Assignment/Assignment/facades/store-facade/node_modules/@loopback/context/src/resolver.ts:222:21)
    at invokeTargetMethodWithInjection (/Users/sumeet.gupta/Desktop/Sourcefuse/Assignment/Assignment/facades/store-facade/node_modules/@loopback/context/src/invocation.ts:223:49)
    at InterceptedInvocationContext.invokeTargetMethod (/Users/sumeet.gupta/Desktop/Sourcefuse/Assignment/Assignment/facades/store-facade/node_modules/@loopback/context/src/invocation.ts:119:14)
    at targetMethodInvoker (/Users/sumeet.gupta/Desktop/Sourcefuse/Assignment/Assignment/facades/store-facade/node_modules/@loopback/context/src/interceptor.ts:349:23)
    at /Users/sumeet.gupta/Desktop/Sourcefuse/Assignment/Assignment/facades/store-facade/node_modules/@loopback/context/src/interceptor-chain.ts:219:14
    at transformValueOrPromise (/Users/sumeet.gupta/Desktop/Sourcefuse/Assignment/Assignment/facades/store-facade/node_modules/@loopback/context/src/value-promise.ts:298:12)
    at GenericInterceptorChain.invokeNextInterceptor (/Users/sumeet.gupta/Desktop/Sourcefuse/Assignment/Assignment/facades/store-facade/node_modules/@loopback/context/src/interceptor-chain.ts:214:35)
    at GenericInterceptorChain.next (/Users/sumeet.gupta/Desktop/Sourcefuse/Assignment/Assignment/facades/store-facade/node_modules/@loopback/context/src/interceptor-chain.ts:202:17)
    at /Users/sumeet.gupta/Desktop/Sourcefuse/Assignment/Assignment/facades/store-facade/node_modules/@loopback/context/src/interceptor-chain.ts:219:42
    at AuthorizationInterceptor.intercept (/Users/sumeet.gupta/Desktop/Sourcefuse/Assignment/Assignment/facades/store-facade/node_modules/@loopback/authorization/src/authorize-interceptor.ts:69:28)
    at /Users/sumeet.gupta/Desktop/Sourcefuse/Assignment/Assignment/facades/store-facade/node_modules/@loopback/context/src/interceptor-chain.ts:219:14
    at transformValueOrPromise (/Users/sumeet.gupta/Desktop/Sourcefuse/Assignment/Assignment/facades/store-facade/node_modules/@loopback/context/src/value-promise.ts:298:12)
    at GenericInterceptorChain.invokeNextInterceptor (/Users/sumeet.gupta/Desktop/Sourcefuse/Assignment/Assignment/facades/store-facade/node_modules/@loopback/context/src/interceptor-chain.ts:214:35)





    Authentication -> jwt_token -> UserProfile{userId: , email, role}
    jwt.sign(token, secret);
    jwt.verify(token, secret);


    -----
    library -> validate(token, secret) , sign(token, secret)
    User Service - generate token , validate token. -> env -> secret 
    ABC service - token -> validate -> user-service -> userService.validate(token) -> .env -> secret


Admin , SuperAdmin, Subscriber

Allowed : Admin , SuperAdmin
User role : Subscriber ->. Access denied



Learnings [IMPORTANT]
1. 