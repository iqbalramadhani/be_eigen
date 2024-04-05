# Address API Spec

## Create Address

Enpoint : POST /api/contacts/:contactId/address/:addressId

Headers : 
- Authorization : token

Requst Body : 

```json
{
    "street" : "Jalan Contoh, optional",
    "city" : "Kota, optional",
    "province" : "Provinsi, optional",
    "country" : "Bandung",
    "post_code" : "123456"
}
```

Response Bdoy : 
```json
{
    "data" {
        "street" : "Jalan Contoh, optional",
        "city" : "Kota, optional",
        "province" : "Provinsi, optional",
        "country" : "Bandung",
        "post_code" : "123456"
    }
}
```

## Get Address

Enpoint : GET /api/contacts/:contactId/address/:addressId

Headers : 
- Authorization : token


Response Bdoy : 
```json
{
    "data" {
        "street" : "Jalan Contoh, optional",
        "city" : "Kota, optional",
        "province" : "Provinsi, optional",
        "country" : "Bandung",
        "post_code" : "123456"
    }
}
```

## Update Address

Enpoint : PUT /api/contacts/:contactId/address/:addressId

Headers : 
- Authorization : token

Requst Body : 

```json
{
    "street" : "Jalan Contoh, optional",
    "city" : "Kota, optional",
    "province" : "Provinsi, optional",
    "country" : "Bandung",
    "post_code" : "123456"
}
```

Response Bdoy : 
```json
{
    "data" {
        "street" : "Jalan Contoh, optional",
        "city" : "Kota, optional",
        "province" : "Provinsi, optional",
        "country" : "Bandung",
        "post_code" : "123456"
    }
}
```

## Remove Address

Enpoint : DELETE /api/contacts/:contactId/address/:addressId

Headers : 
- Authorization : token

Response Bdoy : 
```json
{
    "data" : true
}
```

## List Address

Enpoint : PUT /api/contacts/:contactId/address/:addressId

Headers : 
- Authorization : token

Response Bdoy : 
```json
{
    "data" [
        {
            "id" :1
            "street" : "Jalan Contoh, optional",
            "city" : "Kota, optional",
            "province" : "Provinsi, optional",
            "country" : "Bandung",
            "post_code" : "123456"
        }
    ]
    
}
```

