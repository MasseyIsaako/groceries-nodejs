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

// Connecting all files inside public folder
app.use(express.static("./public"));

// Finding the path of modules using the path module.
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

// Creating our own search parameters
app.get("/products/search=:term", function(request, response){
	// This where you can find the search term entered into the url bar using the search form.
	var term = request.params.term;
	console.log(request.params.term);
	searchData(response, term);
});

app.get("/products/search=:term/instock=:instock", function(request, response){
	var term = request.params.term;
	var stock = request.params.instock;
	console.log(request.params);
	searchDataInStock(response, term, stock);
})

app.get("/products/search=:term/instock=:instock/maxprice=:maxprice", function(request, response){
	var term = request.params.term;
	var stock = request.params.instock;
	var price = request.params.maxprice;
	console.log(request.params);
	searchAvailAndPrice(response, term, stock, price);
})

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

// Parameter for search
function searchData(response, term){
	term = term.toLowerCase();
	var list = data.filter(function(item){
		var name = item.name.toLowerCase();

		if(name.indexOf(term) !== -1){
			return item;
		}
	});

	response.end(JSON.stringify(list));
}

// For item in stock
function searchDataInStock(response, term, stock){
	term = term.toLowerCase();

	if(stock === "true"){
		var avail = true;
	} else if(stock === "false"){
		var avail = false;
	}

	var list = data.filter(function(item){
		var name = item.name.toLowerCase();

		// This asks whether the search term is included in the json file
		if( (name.indexOf(term) !== -1) && (item.inStock === avail) ){
			console.log(item);
			return item;
		}
	})

	response.end(JSON.stringify(list));
}

function searchAvailAndPrice(response, term, stock, price){
	term = term.toLowerCase();

	if(stock === "true"){
		var avail = true;
	} else if(stock === "false"){
		var avail = false;
	}

	var list = data.filter(function(item){
		var name = item.name.toLowerCase();

		// This asks whether the search term is included in the json file
		if( (name.indexOf(term) !== -1) && (item.inStock === avail) && (item.price <= price) ){
			console.log(item);
			return item;
		}
	})

	response.end(JSON.stringify(list));
}