const express = require('express')
const app = express()
// express is a framework that helps us build web applications
// express package helps us to create servers easily
// express() gives us an object that contains all the methods and properties of express
// that means express() server created not server started
// server started is different thing , we need to tell the server to start listening on a port
// listen() is a method that tells the server to start listening on a port
// 3000 is the port number
// the first argument is the port number
// the second argument is a callback function that will be executed when the server starts

app.get('/', (req, res) => {
    console.log(req);
    console.log('------req------');
    console.log(res);
    console.log('------res------');
    res.send('Hello World!')
})
app.get('/home', (req, res) => {
    res.send('this is home page')
})
// localhost:3000
// localhost:3000/home
app.listen(3000, () => {
    console.log('Server is running on port 3000');
})


// req is a object that contains all the information about the incoming request
// res is a object that contains all the information about the outgoing response

// API is a set of rules and protocols that allows different software applications to communicate with each other
// it is like a messenger that takes request from one application and gives response to another application
// localhost:3000 is the address of the server
// localhost:3000/home in browser we get the response from the server
// that api communicates with the server and the server gives response to the api
// localhost:3000/home in browser we get the response from the server
// /home is the route or endpoint or url that we are accessing
// localhost:3000/home in postman 

// REST API(REPRESENTATIONAL STATE TRANSFER)
// REST is a architectural style for designing networked applications
// REST is not a protocol or standard, it is a set of principles
// known for statelessness, client-server architecture, and use of standard HTTP methods.

// GET => used for requesting data from a server
// POST => used for sending data to a server to create a new resource
// PUT => used for sending data to a server to update an existing resource
// DELETE => used for deleting a resource from a server
// PATCH => used for sending data to a server to update an existing resource (partial update)
// HEAD => used for requesting data from a server (only headers)
// OPTIONS => used for requesting data from a server (only headers)
// TRACE => used for requesting data from a server (only headers)