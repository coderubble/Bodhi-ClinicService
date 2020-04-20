# BodhClinicService
## Overview
This Service is used to manage clinic & doctor details of Bodhi application.

### Example of a Clinic request
#### Clinic Details:
```
{
  "name": "Kottakal",
  "email_id":"kottakkal@gmail.com",
  "street": "Street ABC",
  "city": "Bangalore",
  "postcode": "325495",
  "contact_no": "9485769876",
  "about": "Kottakal Aryavaidyasala",
  "doctors":[{
    "first_name": "Doctor",
    "last_name":"1",
    "address": "Street 1",
    "contact_no": "9485769876",
    "about": "MBBS",
    "schedule":"* 10-17 * * 1-5"
  }]
}
```
#### To-Do
```
Set an alarm when Cache_evict function could not delete cache
```