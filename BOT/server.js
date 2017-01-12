const express = require("express");
const app     = express();
const cors    = require("cors");
const parser  = require("body-parser");
const router  = express.Router();
const fs      = require("fs");

app.use(parser.urlencoded({extended : true}));
app.use(parser.json());
app.use(cors());

app.listen(3000, () => {
	console.log("Server listening on http://localhost:3000");
});

var saveJSON = function(path, jsonData) {
	return new Promise(function(resolve, reject) {
		fs.writeFile(path, JSON.stringify(jsonData), function(err) {
			if(err) {
				return console.log(err);
			}

			console.log(path + " saved!");
		}); 
	});
};

// Status

var status = [];

// lade aus json Datei
fs.readFile("data/Status.json", (err, data) => {
	if (err) throw err;
	
	status = JSON.parse(data);
});

// Status Tabelle senden
router.get("/Status", (req, res) => {
	res.send(status);
	//console.log("/api/Status");
});

// nur eine Status Zeile senden
router.get("/Status/:id", (req, res) => {
	res.send(status[req.params.id - 1]);
	console.log("status: " + req.params.id);
});

// toggeln (workload)
router.post("/Status", (req, res) => {
	
	if (req.header("Token") === undefined) {
		console.log("Status (POST): Token is undefined");
		res.send({"message":"NOT OK"});
		return;
	}
	
	
	
	
	if (req.body.id == 0) {
		res.send({"message":"NOT OK"});
		console.log("id null");
		
	} else if(req.body.id > status.length){
		res.send({"message":"OK"}); //
		console.log("neue erstellen");
		
	} else {
		res.send({"message":"OK"});
		
		console.log("ersetzen"); // => workload aendern
		console.log(req.body.id);
		
		if (status[req.body.id-1].workload == 0) {
			status[req.body.id-1].workload = 1;
		} else {
			status[req.body.id-1].workload = 0;
		}
		
	}

	console.log(req.body);
	
	saveJSON("data/Status.json", status);	
});

router.post("/Status/:id", (req, res) => {
	res.send({"message":"OK"});
});


// Tasks
	
var tasks = [];

// lade aus json Datei
fs.readFile("data/Tasks.json", "utf8", (err, data) => {
	if (err) throw err;
	
	tasks = JSON.parse(data);
});

// Task Tabelle senden
router.get("/Tasks", (req, res) => {
	res.send(tasks);
});

// nur eine Task Zeile senden
router.get("/Tasks/:id", (req, res) => {
	res.send(tasks[req.params.id - 1]);
	console.log("tasks: " + req.params.id);
});

// neuen Task zu Tabelle hinzufuegen
router.post("/Tasks", (req, res) => {
	
	if (req.header("Token") === undefined) {
		console.log("Tasks (POST): Token is undefined");
		res.send({"message":"NOT OK"});
		return;
	}
	
	
	res.send({"message":"OK"});
	
	tasks.push(req.body);
	tasks[tasks.length-1].id = tasks.length;
	
	tasks[tasks.length-1].data.output = null;
	
	
	saveJSON("data/Tasks.json", tasks);	
});

router.post("/Tasks/:id", (req, res) => {
	
	if (req.header("Token") === undefined) {
		console.log("Tasks (POST): Token is undefined");
		res.send({"message":"NOT OK"});
		return;
	}
	
	
	if (tasks[req.params.id - 1].data.output == null) {
		tasks[req.params.id - 1].data.output = req.body.output;
		res.send({"message":"OK"});
		console.log("/Tasks/:id       OK");
	} else {
		// wurde schon berechnet 
		res.send({"message":"NOT OK"}); 
		console.log("/Tasks/:id       NOT OK");
	}
	
	saveJSON("data/Tasks.json", tasks);	
});


// Reports

var report = [];

// Report Tabelle senden
router.get("/Report", (req, res) => {
	res.send(report);
});

// nur eine Report Zeile senden
router.get("/Report/:id", (req, res) => {
	res.send(report[req.params.id - 1]);
	console.log("report: " + req.params.id);
});

router.post("/Report/:id", (req, res) => {
	res.send({"message":"OK"});
});




app.use("/api", router);
