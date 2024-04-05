# Contact API Spec

## Create Contact

Enpoint : POST /api/contacts

Request Body : 

```json
{
    "first_name" : "iqbal",
    "last_name": "rahasia",
    "email": "rahasia",
    "phone": "rahasia"
}
```

Response Body (Success):

```json
{
    "data" : {
        "id" : 1,
        "first_name" : "iqbal",
        "last_name": "rahasia",
        "email": "rahasia",
        "phone": "rahasia"
    }
}
```

## Get Contact

Enpoint : GET /api/contacts/:contactId

Headers : 
- Authorization : token

Response Body (Success):

```json
{
    "data" : {
        "id" : 1,
        "first_name" : "iqbal",
        "last_name": "rahasia",
        "email": "rahasia",
        "phone": "rahasia"
    }
}
```

## Update Contact

Enpoint : PUT /api/contacts/:contactId

Headers : 
- Authorization : token

Request Body : 

```json
{
    "first_name" : "iqbal",
    "last_name": "rahasia",
    "email": "rahasia",
    "phone": "rahasia"
}
```

Response Body (Success):

```json
{
    "data" : {
        "id" : 1,
        "first_name" : "iqbal",
        "last_name": "rahasia",
        "email": "rahasia",
        "phone": "rahasia"
    }
}
```

## Delete Contact

Enpoint : DELETE /api/contacts/:contactId

Headers : 
- Authorization : token

Response Body (Success):

```json
{
    "data" : true
}
```

## Search Contact

Enpoint : GET /api/contacts

Headers : 
- Authorization : token

Query Params : 
- name : string
- phone : string
- email : string
- page : number
- size : number


Response Body (Success):

```json
{
    "data" : [
        {
            "id" : 1,
            "first_name" : "iqbal",
            "last_name": "rahasia",
            "email": "rahasia",
            "phone": "rahasia"
        },
        {
            "id" : 2,
            "first_name" : "iqbal",
            "last_name": "rahasia",
            "email": "rahasia",
            "phone": "rahasia"
        }
    ],
    "pagging" : {
        "current_page" : 1,
        "total_page" : 10,
        "size" : 10
    }
}
```