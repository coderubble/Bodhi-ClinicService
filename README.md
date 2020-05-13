# BodhClinicService
## Overview
This Service is used to manage clinic & doctor details of Bodhi application.

### Example of a Clinic request
#### Clinic Details:
```
{
  "name": "Vaidyaratnam",
  "email_id":"kottakkal@gmail.com",
  "street": "Street ABC",
  "city": "Bangalore",
  "postcode": "325495",
  "contact_no": "9485769876",
  "about": "Kottakal Aryavaidyasala",
  "doctors":[{
    "first_name": "Doctor",
    "last_name":"1",
    "joining_date":"2000-01-05",
    "address": "Street 1",
    "contact_no": "9485769876",
    "about": "MBBS",
    "schedule":"*/15 8-16 * * 1-5"
  },{
    "first_name": "Doctor",
    "last_name":"2",
    "joining_date":"2000-01-05",
    "address": "Street 2",
    "contact_no": "9485769876",
    "about": "MBBS",
    "schedule":"* 10-13 * * 1-5"
  },{
    "first_name": "Doctor",
    "last_name":"3",
    "joining_date":"2000-01-05",
    "address": "Street 3",
    "contact_no": "9485769876",
    "about": "MBBS",
    "schedule":"* 9-18 * * 1-5"
  }
  ]
}
```
#### To-Do
```
Set an alarm when Cache_evict function could not delete cache
```