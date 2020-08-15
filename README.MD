# DEMO ENDPOINTS

### CARRIER

#### GET CARRIERS
**endpoint**: ${{ PATH_BASE }}/demo/carrier

**method**: GET

#### Response 200

    {
        "message": "Success",
        "data": [
            {
            "_id": "5ef3c99dc6375d26fd999980",
            "scac": "TEST",
            "carrierId": 500,
            "name": "TEST CARRIER",
            "mcNumber": "09812",
            "dotNumber": "21890",
            "feinNumber": "",
            "createdAt": "2020-06-24T21:46:05.522Z",
            "updatedAt": "2020-06-24T21:46:05.522Z",
            "__v": 0
            },
            {
            "_id": "5ef3d78337f17039ad93fd05",
            "scac": "NEWTEST",
            "carrierId": 510,
            "name": "NEW TEST CARRIER",
            "mcNumber": "09812",
            "dotNumber": "21890",
            "feinNumber": "123",
            "createdAt": "2020-06-24T22:45:23.252Z",
            "updatedAt": "2020-06-24T22:45:23.252Z",
            "__v": 0
            }
        ]
    }

#### Response 404

    {
        "statusCode": 404,
        "error": "Not Found",
        "message": "Any document found",
        "stack": "Any document found"
    }

#### GET CARRIER
**endpoint**: ${{ PATH_BASE }}/demo/carrier/ID_CARRIER

**method**: GET

#### Response 200

    {
        "message": "Success",
        "data": {
            "_id": "5ef3c99dc6375d26fd999980",
            "scac": "TEST",
            "carrierId": 500,
            "name": "TEST CARRIER",
            "mcNumber": "09812",
            "dotNumber": "21890",
            "feinNumber": "",
            "createdAt": "2020-06-24T21:46:05.522Z",
            "updatedAt": "2020-06-24T21:46:05.522Z",
            "__v": 0
        }
    }

#### Response 404

    {
        "statusCode": 404,
        "error": "Not Found",
        "message": "Any document found",
        "stack": "Any document found"
    }

#### CREATE CARRIER
**endpoint**: ${{ PATH_BASE }}/demo/carrier

**method**: POST

**Note:** The fields **scac** and **carrierId** are **UNIQUE** fields

**Body**

    {
    	"scac": "NEWTEST",
    	"carrierId": 510,
    	"name": "NEW TEST CARRIER",
    	"mcNumber": "09812",
    	"dotNumber": "21890",
    	"feinNumber": "123"
    }

#### Response 200

    {
        "message": "Success",
        "data": {
            "_id": "5ef3c99dc6375d26fd999980",
            "scac": "TEST",
            "carrierId": 500,
            "name": "TEST CARRIER",
            "mcNumber": "09812",
            "dotNumber": "21890",
            "feinNumber": "",
            "createdAt": "2020-06-24T21:46:05.522Z",
            "updatedAt": "2020-06-24T21:46:05.522Z",
            "__v": 0
        }
    }

**Note:** Joi is implemented, and will send a **http status error 400** in field validations 

#### Response 400
    
    {
        "statusCode": 400,
        "error": "MongoError",
        "message": "E11000 duplicate key error collection: demo.carriers index: scac_1 dup key: { scac: \"NEWTEST\" }",
        "stack":.....
    }

#### UPDATE CARRIER
**endpoint**: ${{ PATH_BASE }}/demo/carrier/ID_CARRIER

**method**: PUT

**Note:** The fields **scac** and **carrierId** are **UNIQUE** fields

**Body**

    {
    	"scac": "NEWTEST",
    	"carrierId": 510,
    	"name": "NEW TEST CARRIER",
    	"mcNumber": "09812",
    	"dotNumber": "21890",
    	"feinNumber": "123"
    }

#### Response 200

    {
        "message": "Success",
        "data": {
            "_id": "5ef3c99dc6375d26fd999980",
            "scac": "TEST",
            "carrierId": 500,
            "name": "TEST CARRIER",
            "mcNumber": "09812",
            "dotNumber": "21890",
            "feinNumber": "",
            "createdAt": "2020-06-24T21:46:05.522Z",
            "updatedAt": "2020-06-24T21:46:05.522Z",
            "__v": 0
        }
    }

#### Response 404

    {
        "statusCode": 404,
        "error": "Not Found",
        "message": "Failed on update process",
        "stack": "Failed on update process"
    }

#### Response 400
    
    {
        "statusCode": 400,
        "error": "MongoError",
        "message": "E11000 duplicate key error collection: demo.carriers index: scac_1 dup key: { scac: \"NEWTEST\" }",
        "stack":.....
    }

#### DELETE CARRIER
**endpoint**: ${{ PATH_BASE }}/demo/carrier/ID_CARRIER

**method**: DELETE

#### Response 200

    {
        "message": "Success",
        "data": {
            "_id": "5ef3d78337f17039ad93fd05",
            "scac": "NEWTEST",
            "carrierId": 510,
            "name": "NEW TEST CARRIER",
            "mcNumber": "09812",
            "dotNumber": "21890",
            "feinNumber": "123",
            "createdAt": "2020-06-24T22:45:23.252Z",
            "updatedAt": "2020-06-24T22:45:23.252Z",
            "__v": 0
        }
    }

#### Response 404

    {
        "statusCode": 404,
        "error": "Not Found",
        "message": "Failed on delete process",
        "stack": "Failed on delete process"
    }

### SHIPMENT

#### GET SHIPMENTS
**endpoint**: ${{ PATH_BASE }}/demo/shipment

**method**: GET

#### Response 200

    {
        "message": "Success",
        "data": [
            {
            "_id": "5ef3dd30b8042e3f8656671f",
            "originCountry": "US",
            "originState": "FL",
            "originCity": "California",
            "destinationCountry": "US",
            "destinationState": "FL",
            "destinationCity": "Miami",
            "pickupDate": "2020-06-28T00:00:00.000Z",
            "deliveryDate": null,
            "status": "Rate",
            "carrierRate": 1230,
            "createdAt": "2020-06-24T23:09:36.675Z",
            "updatedAt": "2020-06-24T23:13:38.383Z",
            "__v": 0
            },
            {
            "_id": "5ef3dd44b8042e3f86566721",
            "originCountry": "US",
            "originState": "FL",
            "originCity": "Tampa",
            "destinationCountry": "US",
            "destinationState": "FL",
            "destinationCity": "Miami",
            "pickupDate": "2020-07-28T00:00:00.000Z",
            "deliveryDate": null,
            "status": "Rate",
            "carrierRate": 0,
            "createdAt": "2020-06-24T23:09:56.624Z",
            "updatedAt": "2020-06-24T23:09:56.624Z",
            "__v": 0
            }
        ]
    }

#### Response 404

    {
        "statusCode": 404,
        "error": "Not Found",
        "message": "Any document found",
        "stack": "Any document found"
    }

#### GET SHIPMENT
**endpoint**: ${{ PATH_BASE }}/demo/shipment/ID_SHIPMENTS

**method**: GET

#### Response 200

    {
        "message": "Success",
        "data": {
            "_id": "5ef3dd30b8042e3f8656671f",
            "originCountry": "US",
            "originState": "FL",
            "originCity": "California",
            "destinationCountry": "US",
            "destinationState": "FL",
            "destinationCity": "Miami",
            "pickupDate": "2020-06-28T00:00:00.000Z",
            "deliveryDate": null,
            "status": "Rate",
            "carrierRate": 1230,
            "createdAt": "2020-06-24T23:09:36.675Z",
            "updatedAt": "2020-06-24T23:13:38.383Z",
            "__v": 0
        }
    }

#### Response 404

    {
        "statusCode": 404,
        "error": "Not Found",
        "message": "Any document found",
        "stack": "Any document found"
    }

#### GET SHIPMENT QUERY FILTER
**endpoint**: ${{ PATH_BASE }}/demo/shipment-filters?q=FILTERS&&page=1&&date=20190101

**method**: GET

**Note:** The fields **page** and **date** are **OPTIONAL** fields. The field page must be a number **integer**, the field date must be the a number with the next date format **YYYYMMDD**

#### Response 200

    {
        "message": "Success",
        "data": [
            "hola",
            "1",
            "US",
            "camilo"
        ],
        "shipments": [
            {
            "_id": "5ef3dd30b8042e3f8656671f",
            "originCountry": "CO",
            "originState": "FL",
            "originCity": "California",
            "destinationCountry": "US",
            "destinationState": "FL",
            "destinationCity": "Miami",
            "pickupDate": "2020-06-28T00:00:00.000Z",
            "deliveryDate": null,
            "status": "Rate",
            "carrierRate": 1230,
            "createdAt": "2020-06-24T23:09:36.675Z",
            "updatedAt": "2020-06-24T23:13:38.383Z",
            "__v": 0
            },
            {
            "_id": "5ef3dd44b8042e3f86566721",
            "originCountry": "CO",
            "originState": "FL",
            "originCity": "Tampa",
            "destinationCountry": "CO",
            "destinationState": "FL",
            "destinationCity": "Miami",
            "pickupDate": "2020-07-28T00:00:00.000Z",
            "deliveryDate": null,
            "status": "Rate",
            "carrierRate": 0,
            "createdAt": "2020-06-24T23:09:56.624Z",
            "updatedAt": "2020-06-24T23:09:56.624Z",
            "__v": 0
            }
        ]
    }

#### Response 404

    {
        "statusCode": 404,
        "error": "Not Found",
        "message": "Any shipment match with search criteria",
        "stack": "Any shipment match with search criteria"
    }

#### CREATE SHIPMENT
**endpoint**: ${{ PATH_BASE }}/demo/shipment

**method**: POST

**Body**

    {
        "originCountry":"US",
        "originState":"FL",
        "originCity":"Tampa",
        "destinationCountry":"US",
        "destinationState":"FL",
        "destinationCity":"Miami",
        "pickupDate":"2020-07-28",
        "deliveryDate":"",
        "status":"Rate",
        "carrierRate":0
    }

#### Response 200

    {
        "message": "Success",
        "data": {
            "_id": "5ef3dd44b8042e3f86566721",
            "originCountry": "US",
            "originState": "FL",
            "originCity": "Tampa",
            "destinationCountry": "US",
            "destinationState": "FL",
            "destinationCity": "Miami",
            "pickupDate": "2020-07-28T00:00:00.000Z",
            "deliveryDate": null,
            "status": "Rate",
            "carrierRate": 0,
            "createdAt": "2020-06-24T23:09:56.624Z",
            "updatedAt": "2020-06-24T23:09:56.624Z",
            "__v": 0
        }
    }

#### Response 400

**Note:** Joi is implemented, and will send a **http status error 400** in field validations 

    {
        "statusCode": 400,
        "error": "Bad Request",
        "message": "\"originCountry\" length must be less than or equal to 2 characters long",
        "stack": "\"originCountry\" length must be less than or equal to 2 characters long"
    }

#### UPDATE SHIPMENT
**endpoint**: ${{ PATH_BASE }}/demo/shipment/ID_SHIPMENTS

**method**: PUT

**Body**

    {
        "originCountry":"US",
        "originState":"FL",
        "originCity":"Tampa",
        "destinationCountry":"US",
        "destinationState":"FL",
        "destinationCity":"Miami",
        "pickupDate":"2020-07-28",
        "deliveryDate":"",
        "status":"Rate",
        "carrierRate":0
    }

#### Response 200

    {
        "message": "Success",
        "data": {
            "_id": "5ef3dd30b8042e3f8656671f",
            "originCountry": "US",
            "originState": "FL",
            "originCity": "California",
            "destinationCountry": "US",
            "destinationState": "FL",
            "destinationCity": "Miami",
            "pickupDate": "2020-06-28T00:00:00.000Z",
            "deliveryDate": null,
            "status": "Rate",
            "carrierRate": 1230,
            "createdAt": "2020-06-24T23:09:36.675Z",
            "updatedAt": "2020-06-24T23:13:38.383Z",
            "__v": 0
        }
    }

#### Response 404

    {
        "statusCode": 404,
        "error": "Not Found",
        "message": "Failed on update process",
        "stack": "Failed on update process"
    }

#### DELETE SHIPMENT
**endpoint**: ${{ PATH_BASE }}/demo/shipment/ID_SHIPMENTS

**method**: DELETE

#### Response 200

    {
        "message": "Success",
        "data": {
            "_id": "5ef3dd42b8042e3f86566720",
            "originCountry": "US",
            "originState": "FL",
            "originCity": "Tampa",
            "destinationCountry": "US",
            "destinationState": "FL",
            "destinationCity": "Miami",
            "pickupDate": "2020-07-28T00:00:00.000Z",
            "deliveryDate": null,
            "status": "Rate",
            "carrierRate": 0,
            "createdAt": "2020-06-24T23:09:54.737Z",
            "updatedAt": "2020-06-24T23:09:54.737Z",
            "__v": 0
        }
    }

#### Response 404

    {
        "statusCode": 404,
        "error": "Not Found",
        "message": "Failed on delete process",
        "stack": "Failed on delete process"
    }

#### AUTHENTICATION

I decided to use jsonwebtoken as a request validation mechanism. The REST interface is stateless, which is what the CRUD exercise consists of, so they are endpoints enabled through the HTTP protocol, since it is not required to manage the server side, states or user sessions, the most efficient, easy and fast way to implement to protect and restrict access to resources is using this mechanism.

It is implemented in 2 parts, the first is the user authentication process, once the authentication process is successful, using this utility, a token is generated, which consists of a payload, a secret that serves as a key to verify the life and authenticity of the token and a third element which is an object of configuration options of the token, among the most important, the time of this.

The second part is the endpoint protection process. A middleware was implemented which once the endpoint receives the request, before the controller or other previously implemented middleware is executed, this is in charge of verifying the token, after this, inside this middleware a validation is added, in which the user's role and the HTTP method used in the request is verified. If the method is different from GET and the user's role is the same as READONLY, it will reject the request as a 401 unauthorized error

#### IMPORT SHIPMENTS SYSTEM

The following endpoint is available for the import of shipments into the system.

**endpoint**: ${{ PATH_BASE }}/demo/shipment-import

**method**: POST

**body**: NO BODY REQUIRED

For this solution we implemented the express middleware, **multer**. Multer is a tool that makes it easy to handle this **multipart/form-data** when the users upload files. Within the configurations of the middleware, we can restrict what types of files will be sent, this being validated through the mimetype of the file. For the current problem, only the following mimetype was enabled:

    'application/vnd.ms-excel',
    'application/msexcel',
    'application/x-msexcel',
    'application/x-ms-excel',
    'application/x-excel',
    'application/x-dos_ms_excel',
    'application/xls',
    'application/x-xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv'

If the file does not meet this condition, an http 400 status response will be sent to the user with a message to that effect. In case of passing the validations made in the middleware, in the controller, it is validated what type of file it is, if it is a .xls or if it is a .csv, there are 2 procedures designed for each of them.

It should be noted that **multer** returns within the **req** object a property named **file**, which is an object that contains several properties, including a property that has stored the contents of the file and is named **buffer**.

For both processes the buffer property is used, for the case of .xls files, the xlsx package is used, which is a library that allows to manipulate the content of this type of files and to which the buffer obtained previously can be passed as initial parameter. In the case of .csv files, a different manipulation was performed, likewise, taking advantage of the buffer, the streamifier package is used, which passing as a parameter the buffer, can create a readable stream, which in turn serves as a parameter for the csvtojson package, which allows to take the content of the .csv file and transpose it to an array of JSON objects, where each object corresponds to a row of the file, and the properties of each object relate to the headers of the file.

In both cases, the following processes are carried out, with slight variations, because of how the data must be manipulated for each type of file.

- The mimetype of the files is verified.

- It is verified that the columns of the files, correspond with the initially indicated ones.

- Through a scheme, it is verified that the data of each one of the shipments, is the suitable one, if the shipment in some of its fields, the die does not fulfill the conditions of initially raised, this will not be entered in the data base.

- Using mongo's bulkInsert functionality, the insertion of the shipments that are satisfactory is performed.

- Finally, the user is sent the corresponding answer, where it is indicated how many shipments were registered in the database, and which shipments did not comply, in which row of the document and which was the error presented.

#### EXPORT TO GOOGLE DRIVE

The following endpoint is created for this process:

**endpoint**: ${{ PATH_BASE }}/demo/export?type=FILE_TYPE

**method**: GET

The parameter receives through the req.query object the type of file to be generated and stored in Google Drive. To use this endpoint, you must be a user with ADMIN role and you must send a valid Bearer token. For the user creation and token retrieval processes, the following endpoints are enabled:

**endpoint**: ${{ PATH_BASE }}/demo/user

**method**: POST

**Body**

    {
        "username":"camiloae",
        "password":"12345",
        "role":"admin",
        "email":"c.acevedo1993@gmail.com"
    }

All fields are marked as required and all are String type. If the payload presents any inconvenience, the endpoint will respond with an http status 400 response. Once the user is successfully created, the following response will be obtained:

**Response 200**
    
    {
        "_id": "5ef909a2cf9f3a692dd1cc1d",
        "username": "camiloae",
        "password": "$2b$10$cCRoseOm0wSNm9hQj.8Pm.x8Df45erykTgkQGyGFQDiUXIVjm4ARq",
        "role": "ADMIN",
        "email": "c.acevedo1993@gmail.com",
        "createdAt": "2020-06-28T21:20:34.541Z",
        "updatedAt": "2020-06-28T21:20:34.541Z",
        "__v": 0
    }

**Note:** It is important to clarify that to be able to do the complete exercise, the e-mail that is registered must be existing and have access to it, so that once the later parts are done, you can observe that the mail arrives in a satisfactory way.

The next step is to obtain a token, for which the next endpoint with its respective payload is used:

**endpoint**: ${{ PATH_BASE }}/demo/auth

**method**: POST

**Body**

    {
        "username":"camiloae",
        "password":"$2b$10$cCRoseOm0wSNm9hQj.8Pm.x8Df45erykTgkQGyGFQDiUXIVjm4ARq"
    }

Once the request is sent, if the credentials are not valid, you will get a response http status 401 unauthorized. If we are successful, we will get the following answer:

**Response 200**

    {
        "_id": "5ef909a2cf9f3a692dd1cc1d",
        "username": "camiloae",
        "password": "$2b$10$cCRoseOm0wSNm9hQj.8Pm.x8Df45erykTgkQGyGFQDiUXIVjm4ARq",
        "role": "ADMIN",
        "email": "c.acevedo1993@gmail.com",
        "createdAt": "2020-06-28T21:20:34.541Z",
        "updatedAt": "2020-06-28T21:20:34.541Z",
        "__v": 0,
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWY5MDlhMmNmOWYzYTY5MmRkMWNjMWQiLCJ1c2VybmFtZSI6ImNhbWlsb2FlIiwicGFzc3dvcmQiOiIkMmIkMTAkY0NSb3NlT20wd1NObTloUWouOFBtLng4RGY0NWVyeWtUZ2tRR3lHRlFEaVVYSVZqbTRBUnEiLCJyb2xlIjoiQURNSU4iLCJlbWFpbCI6ImMuYWNldmVkbzE5OTNAZ21haWwuY29tIiwiY3JlYXRlZEF0IjoiMjAyMC0wNi0yOFQyMToyMDozNC41NDFaIiwidXBkYXRlZEF0IjoiMjAyMC0wNi0yOFQyMToyMDozNC41NDFaIiwiX192IjowLCJpYXQiOjE1OTMzNzkyNzksImV4cCI6MTU5MzM4Mjg3OX0.0OULzvwWbN244Z6oCyLb2pJPmYl1nx3vR2J2QqkufVA"
    }

Once the token is obtained, the request for the endpoint is made to generate and send the corresponding report. In the request, as indicated in this section, the endpoint receives a FILE_TYPE in the query params of the request, only **csv** or **xls** values are allowed, but also the value can be empty, if so it will be assumed that the file will be generated as a default xls. Finally the endpoint will perform a query to the database, with a parameterization, to bring the records that meet these conditions, it will also make a request to the EIA API, to obtain the weekly prices of gasoline by area. To add the corresponding zone, it is validated if the city is within the resources provided by the EIA API, if not, it will be assigned the price provided by the API for all the pasi (U.S. price).

Using the Google Drive V3 API, the process of uploading the files through a readable stream, prior to this, it will be verified if the user who makes the request (identified by the token), has a folder already created, if not, a folder will be created and the generated file will be uploaded to the corresponding user's folder. It is guaranteed that there will be no repeated folders, since in the schema used for the creation of users in the database, a constraint was implemented to guarantee that the username is unique, which is the data used as a name in the creation of the folders.

Finally, an email is sent to the user's registration email with the URL of the generated file.

#### REPORT

Within the demo directory, a component called report is implemented. In this component the export process of the reports is carried out. For this process we work in union with the previous point. Every time an export to Google Drive is generated, the information of this process will be registered in a database, which will be used to generate the report. A query is implemented which will vary according to the request made to the endpoint enabled for this operation. The endpoint in question is the following:

**endpoint**: ${{ PATH_BASE }}/demo/status

**method**: GET

**Note:** The format field, is required to define what type of response the endpoint will return, if this field is not sent, the default value will be pdf. The allowed values are **pdf** and **json**.

**Body**

    {
        "allUsers": true,
        "format": "pdf"
    }

**Response 200 (JSON format)**

In the case of requesting the JSON format, the following structure will be provided.

    {
        "message": "",
        "data": [
            {
                "totalGenerated": [
                    {
                        "_id": "cacevedo@lean-tech.io",
                        "count": 1
                    },
                    {
                        "_id": "c.acevedo1993@gmail.com",
                        "count": 3
                    }
                ],
                "totalPending": [
                    {
                        "_id": "c.acevedo1993@gmail.com",
                        "count": 2
                    }
                ],
                "averageGeneration": [
                    {
                        "_id": "c.acevedo1993@gmail.com",
                        "average": 11.451
                    },
                    {
                        "_id": "cacevedo@lean-tech.io",
                        "average": 9.451
                    }
                ],
                "reportByMonth": [
                    {
                        "_id": "June",
                        "count": 6
                    }
                ],
                "reportByWeek": [
                    {
                        "_id": 5,
                        "count": 6
                    }
                ],
                "reportsByUser": [
                    {
                        "_id": "5efa15969412ba1d5e558584",
                        "startDate": "2020-06-29T16:23:50.225Z",
                        "endDate": "2020-06-29T16:23:54.630Z",
                        "status": "generated",
                        "link": "https://drive.google.com/file/d/1S2BNR0O_ojnZb0x0APfMBEJqQZJmvLuE/view?usp=sharing"
                    },
                    .
                    .
                ]
            }
        ]
    }

**Response 200 (PDF format)**

In case you want to obtain the PDF, you will answer with the URL of the generated PDF.

    {
        "message": "Success",
        "data": {
            "downloadLink": "https://drive.google.com/file/d/1PWjt28c_rHlUXlge1vTav0sPkoMEXvLr/view?usp=sharing"
        }
    }