$("#form").submit(function(event){

	// prevent standard submission
	event.preventDefault();

	// Reetrieve search data from input form
	var searchTerm = $("#search").val();
	var inStock = $("#inStock").val();
	var maxPrice = $("#maxPrice").val();

	if(searchTerm.length === 0){
		alert("Please enter something inside the search bar.");
		return;
	}

	// Targeting html elements
	var listContainer = $("#list-items")[0];
	var tableContainer = $("#table-items")[0].childNodes[1];

	// Empty the table using remove class
	$(".appended-row").remove();

	$.ajax({
		url: "http://localhost:3000/products/search=" + searchTerm + "/instock=" + inStock + "/maxprice=" + maxPrice,
		dataType:"json",
		success: function(Data){
			for (var i = 0; i < Data.length; i++) {

				// Setting variables using json data
				var itemName = Data[i].name;
				var itemPrice = Data[i].price;
				
				if(Data[i].inStock === true){
					var itemStock = "Yes";
				} else if(Data[i].inStock === false){
					var itemStock = "No";
				}

				// Appending information to table
				tableContainer.innerHTML += "<tr class='appended-row'><td>" + itemName + "</td><td>" + itemStock + "</td><td>$" + itemPrice + ".00</td></tr>";
			}
		}, error: function(){
			console.log("Error, server not responding!");
		}
	})
});