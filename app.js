var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var cors = require("cors");

var app = express();
var data = require("./data/products");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(function(request, response, next){
	console.log(`${request.method} request for ${request.url}`);
	next();
});


app.use(express.static("./public"));
app.use("/js", express.static(path.join(__dirname, "node_modules/jquery/dist")));
app.use("/js", express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")));
app.use("/css", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")));

// Getting information from url bar
app.get("/allProducts", function(request, response){
	response.json(data);
});

// Getting stocked otems using a function
app.get("/stocked", function(request, response){
	instock(response);
});

// Getting items below 50
app.get("/belowFifty", function(request, response){
	belowFifty(response);
});

// Getting items above 50
app.get("/aboveFifty", function(request, response){
	aboveFifty(response);
});
// Calling the about page
app.get("/about", function(request, response){
	response.sendFile(path.join(__dirname + "/public/about.html"));
});

app.use(cors);

app.listen(3000);
console.log("Server running on port 3000.");

// Calling Functions
function instock(response){
	var available = data.filter(function(item){
		return item.inStock === true;
	});

	response.json(available);
}

function belowFifty(response){
	var cheaper = data.filter(function(item){
		return item.price < 50;
	});

	response.json(cheaper);
}

function aboveFifty(response){
	var costlier = data.filter(function(item){
		return item.price >= 51;
	});

	response.json(costlier);
}