var tbodyTasks = document.querySelector("#trans2 tbody");
var tasks = []; // cache

var loadDataTasks = function() {
	var xhr = new XMLHttpRequest();
	
	xhr.open("GET", server + "api/Tasks");
	
	xhr.responseType = "json";
	xhr.setRequestHeader("Content-Type", "application/json");

	xhr.send(null);
	
	xhr.onload = function() {
		var response = xhr.response;
		tasks = response;
		
		updateTableTasks(response);
	};
};

var updateTableTasks = function(data) {
	var tableRows2 = [].slice.call(tbodyTasks.querySelectorAll("tr"));
	
	// delete rows
	while (tableRows2.length > data.length) {
		tbodyTasks.removeChild(tableRows2[tableRows2.length - 1]); // html 
		tableRows2.splice(tableRows2.length - 1, 1);			// array
	}

	// update rows
	for (var i = 0; i < tableRows2.length; i++) {
		tableRows2[i].querySelector(".id").innerHTML = data[i].id;
		tableRows2[i].querySelector(".type").innerHTML = data[i].type;
		tableRows2[i].querySelector(".input").innerHTML = data[i].data.input;
		tableRows2[i].querySelector(".output").innerHTML = data[i].data.output;
	}
	
	// add rows
	while (tableRows2.length < data.length) {
		var tr = document.createElement("tr");
		
		addTableDataTasks(tr, data[tableRows2.length].id, "id");
		addTableDataTasks(tr, data[tableRows2.length].type, "type");
		addTableDataTasks(tr, data[tableRows2.length].data.input, "input");
		addTableDataTasks(tr, data[tableRows2.length].data.output, "output");

		tbodyTasks.appendChild(tr); // html
		tableRows2.push(tr);		// array
	}
};

var addTableDataTasks = function(rowElement, val, newElementClass) {
	var td = document.createElement("td");
	td.setAttribute("class", newElementClass);
	rowElement.appendChild(td);
	td.innerHTML = val;
};

loadDataTasks();
setInterval(function() {
	loadDataTasks();
}, updateInterval);

// ---------------------------

var sendTask = function() {
	var taskInput = document.querySelector("#trans2 #taskInput");
	var taskSelect = document.querySelector("#trans2 #taskSelect");
	
	
	// eingabe mit bereits vorhandenen Daten vergleichen...
	//console.log(tasks[0].data.input);
	
	function findInput(content) { 
		//console.log("findInput test");
		return content.data.input === taskInput.value &&
				content.type === taskSelect.value;
	}

	//console.log(tasks.find(findInput));
	
	var findSomething = tasks.find(findInput);
	if (findSomething !== undefined) {
		//console.log(findSomething.type + " " + taskSelect.value);
		alert("input already exists");
		return;
	}
	
	
	
	
	var data = {
		type: taskSelect.value,
		data: {
			input: taskInput.value
		}
	};
	
	var xhr = new XMLHttpRequest();
	
	xhr.open("POST", server + "api/Tasks");
	
	xhr.responseType = "json";
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.setRequestHeader("Token", token);
	
	xhr.send(JSON.stringify(data));
	
	xhr.onload = function() {
		//console.log("sendTask: " + JSON.stringify(xhr.response));
		loadDataTasks();
	};
};
