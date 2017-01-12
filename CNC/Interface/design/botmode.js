var connection = false;

var tasksCalc = [];
var oldTasksLength;

var scope = function() {

	var updateInterval = 2000;
	var tbody = document.querySelector("#trans3 tbody");



	setTimeout(function() {
		for (let i = 0; tasksCalc.length < tasks.length; i++) {
			tasksCalc.push(tasks[i]);
		}
		oldTasksLength = tasks.length;

		function filterTasks(value) {
			return value.data.output === null;
		}
		tasksCalc = tasksCalc.filter(filterTasks);

	}, updateInterval - 200);


	var loadData = function() {


	// neue daten an tasksCalc anhaengen

		for (let i = oldTasksLength; i < tasks.length; i++) {
			if (tasks[i].data.output === null)
				tasksCalc.push(tasks[i]);
		}
		oldTasksLength = tasks.length;
	

		updateTable(tasksCalc);
	};

	var updateTable = function(data) {
		console.log("data: ");
		console.log(data);
	
		var tableRows = [].slice.call(tbody.querySelectorAll("#trans3 tbody tr"));
	
	// delete rows
		while (tableRows.length > data.length) {
			tbody.removeChild(tableRows[tableRows.length - 1]); // html 
			tableRows.splice(tableRows.length - 1, 1);			// array
		}

	// update rows
		for (var i = 0; i < tableRows.length; i++) {
			tableRows[i].querySelector(".id").innerHTML = data[i].id;
			tableRows[i].querySelector(".type").innerHTML = data[i].type;
			tableRows[i].querySelector(".input").innerHTML = data[i].data.input;
			tableRows[i].querySelector(".output").innerHTML = data[i].data.output;
			tableRows[i].querySelector(".sync").innerHTML = data[i].sync;
		}
	
	// add rows
		while (tableRows.length < data.length) {
			var tr = document.createElement("tr");
		
			addTableData(tr, data[tableRows.length].id, "id");
			addTableData(tr, data[tableRows.length].type, "type");
			addTableData(tr, data[tableRows.length].data.input, "input");
			addTableData(tr, data[tableRows.length].data.output, "output");
			addTableData(tr, null, "sync");
		
			tbody.appendChild(tr); // html
			tableRows.push(tr);		// array
		}
	};

	var addTableData = function(rowElement, val, newElementClass) {
		var td = document.createElement("td");
		td.setAttribute("class", newElementClass);
		rowElement.appendChild(td);
		td.innerHTML = val;
	};


	const crypto = require("crypto");

	var calcHash = function(input, hashType) {

		var hash;

		if (hashType == "hash-md5") {
			let md5sum = crypto.createHash("md5");

			md5sum.update( input );

			hash = md5sum.digest("hex");
		} else if (hashType == "hash-sha256") {
			let md5sum = crypto.createHash("sha256");

			md5sum.update( input );

			hash = md5sum.digest("hex");
				
		} else {
			hash = "crack-md5 not supportet";
		}


		return hash;
	};


	setInterval(function() {
		if (connection) {
			tasksCalc.forEach(function(element, index, array) {
			

			
				element.data.output = calcHash(element.data.input, element.type);
			

			
				if (element.sync == null) {
					sendData(element);
				} else {
					return;
				}
			});
		
		
		}

		loadData();
	}, updateInterval);



// berechnete Daten an Server senden
	var sendData = function(element) {
		var xhr = new XMLHttpRequest();
	
		xhr.open("POST", server + "api/Tasks/" + element.id);
	
		xhr.responseType = "json";
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.setRequestHeader("Token", token);

		var data = {
			id: element.id,
			output: element.data.output
		};
	
		xhr.send(JSON.stringify(data));
	
		xhr.onload = function() {
			console.log("sendData: " + JSON.stringify(xhr.response));
			loadData();
			element.sync = xhr.response.message;
		};
	};

}; // scope end


// ---------------------------------------------

var toggle1 = function(element) {
	element.value = (element.value == "Pause" ? "Resume" : "Pause");
	
	if (element.value == "Pause") {
		connection = true;
	} else {
		connection = false;
	}
};
scope();
