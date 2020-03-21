const path = require('path')
const express = require('express')
const hbs = require('hbs')
const app = express()
var {getCFTDetails}=require("./getAWSDetails.js")
// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')
console.log(partialsPath)
// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))


// Parse URL-encoded bodies (as sent by HTML forms)
//app.use(express.urlencoded());
app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());


var queryStr="";



app.get('/CFTDetails',async (req, res) => {

res.render('CFTDetails')
})


// Access the parse results as request.body
app.post('/CFTDetails', function(request, response){
    console.log("returned Value: ", getCFTDetails(request.body.txtRoleName))
    response.render('CFTDetails')
});


app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})
