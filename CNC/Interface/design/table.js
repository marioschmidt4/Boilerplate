var updateInterval = 2000;
var tbody = document.querySelector("#trans1 tbody");

var loadData = function() {
	var xhr = new XMLHttpRequest();
	
	xhr.open("GET", server + "api/Status");
	
	xhr.responseType = "json";
	xhr.setRequestHeader("Content-Type", "application/json");

	xhr.send(null);
	
	xhr.onload = function() {
		var response = xhr.response;
		
		response.sort(function(a, b) {
			if (a.workload > b.workload)
				return 1;
			else 
				return -1;
		});
		
		updateTable(response);
	};
};

var updateTable = function(data) {
	var tableRows = [].slice.call(tbody.querySelectorAll("#trans1 tbody tr"));
	
	// delete rows
	while (tableRows.length > data.length) {
		tbody.removeChild(tableRows[tableRows.length - 1]); // html 
		tableRows.splice(tableRows.length - 1, 1);			// array
	}

	// update rows
	for (var i = 0; i < tableRows.length; i++) {
		tableRows[i].querySelector(".id").innerHTML = data[i].id;
		tableRows[i].querySelector(".ip").innerHTML = data[i].ip;
		tableRows[i].querySelector(".task").innerHTML = data[i].task;
		tableRows[i].querySelector(".workload").innerHTML = data[i].workload;
		tableRows[i].querySelector("td input").value = (data[i].workload === 0 ? "Start" : "Stop");
	}
	
	// add rows
	while (tableRows.length < data.length) {
		var tr = document.createElement("tr");
		
		addTableData(tr, data[tableRows.length].id, "id");
		addTableData(tr, data[tableRows.length].ip, "ip");
		addTableData(tr, data[tableRows.length].task, "task");
		addTableData(tr, data[tableRows.length].workload, "workload");
		addTableButton(tr, data[tableRows.length].workload);

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

var addTableButton = function(rowElement, workload) {
	var td = document.createElement("td");
	rowElement.appendChild(td);
	
	var btnText = (workload === 0 ? "Start" : "Stop");
	
	var input = document.createElement("input");
	input.setAttribute("type", "button");
	input.setAttribute("value", btnText);
	input.setAttribute("onclick", "toggle(this);");
	td.appendChild(input);
};

var toggle = function(element) {
	toggleRequest(element, element.value == "Stop" ? false : true);
	element.value = (element.value == "Stop" ? "Start" : "Stop");
};

loadData();
setInterval(function() {
	loadData();
}, updateInterval);

// ---------------------------------------------

var toggleRequest = function(inputElement, newState) {
	var parentTr = inputElement.parentElement.parentElement;
	var idString = parentTr.querySelector(".id").innerHTML;
	
	var idNumber = new Number(idString);
	
	var xhr = new XMLHttpRequest();
	
	xhr.open("POST", server + "api/Status");
	
	xhr.responseType = "json";
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.setRequestHeader("Token", token);

	var data = {
		id: idNumber,
		status: newState
	};
	
	xhr.send(JSON.stringify(data));
	
	xhr.onload = function() {
		//console.log("toggleRequest: " + JSON.stringify(xhr.response));
		loadData();
	};
};
