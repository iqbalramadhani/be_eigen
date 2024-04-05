# User API Spec

## Register User

Enpoint : POST /api/user/login

Request Body : 

```json
{
    "username" : "iqbal",
    "passoword": "rahasia"
}
```

Response Body (Success):

```json
{
    "data" : {
        "username" : "iqbal",
        "name" : "iqbal ramadhani",
        "token": "generate_token"
    }
}
```

Response Body (Failed):

```json
{
    "errors" : "username or password is wrong"
}
```

## Get User

Enpoint : GET /api/user/login

Header : 
- authorization: token

Response Body (Success):

```json
{
    "data" : {
        "username" : "iqbal",
        "name" : "iqbal ramadhani",
    }
}
```

Response Body (Failed):

```json
{
    "errors" : "Unauthorized"
}
```


## Update User

Enpoint : PATCH /api/users/current

Headers :
- Authorization : token

Request Body : 

```json
{
    "username" : "iqbal",
    "passoword": "rahasia"
}
```

Response Body (Success):

```json
{
    "data" : {
        "username" : "iqbal",
        "name" : "iqbal ramadhani",
        "token": "generate_token"
    }
}
```

Response Body (Failed):

```json
{
    "errors" : "username or password is wrong"
}
```

## Logout User


Enpoint : DELETE /api/users/current

Headers :
- Authorization : token

Response Body (Success):

```json
{
    "data" : true
}
```