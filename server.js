/*********************************************************************************
* WEB700 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
* of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students.
* 
* Name: Bhoomi Radadiya Student ID: 129796223 Date: 07/12/2023
*
* Online (Cyclic) Link: https://prussian-blue-haddock-toga.cyclic.app/
*
*********************************************************************************/

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var path = require("path");
const collegeData = require('./modules/collegeData'); 
const { log } = require("console");

app.use(bodyParser.urlencoded({ extended: true }));
app.use("/public", express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));


// GET /students
app.get('/students', (req, res) => {
  const { course } = req.query;
  if (course) {
    console.log(course)
    collegeData.getStudentsByCourse(course)
      .then(students => {
        if (students.length === 0) {
          res.json({ message: 'no results' });
        } else {
          res.json(students);
        }
      })
      .catch(error => {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' });
      });
  } else {
    collegeData.getAllStudents()
      .then(students => {
        if (students.length === 0) {
          res.json({ message: 'no results' });
        } else {
          res.json(students);
        }
      })
      .catch(error => {
        res.status(500).json({ message: 'Internal server error' });
      });
  }
});

// GET /tas
app.get('/tas', (req, res) => {
  collegeData.getTAs()
    .then(tas => {
      if (tas.length === 0) {
        res.json({ message: 'no results' });
      } else {
        res.json(tas);
      }
    })
    .catch(error => {
      res.status(500).json({ message: 'Internal server error' });
    });
});

// GET /courses
app.get('/courses', (req, res) => {
  collegeData.getCourses()
    .then(courses => {
      if (courses.length === 0) {
        res.json({ message: 'no results' });
      } else {
        res.json(courses);
      }
    })
    .catch(error => {
      res.status(500).json({ message: 'Internal server error' });
    });
});

// GET /student/num
app.get('/student/:num', (req, res) => {
  const num = req.params.num;

  collegeData.getStudentByNum(1)
    .then(student => {
      if (student) {
        res.json(student);
      } else {
        res.json({ message: 'no results' });
      }
    })
    .catch(error => {
      res.status(500).json({ message: 'Internal server error' });
    });
});

// GET /
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/home.html');
});

// GET /about
app.get('/about', (req, res) => {
  res.sendFile(__dirname + '/views/about.html');
});

// GET /htmlDemo
app.get('/htmlDemo', (req, res) => {
  res.sendFile(__dirname + '/views/htmlDemo.html');
});

app.get("/students/add", (req, res) => {
  res.sendFile(path.join(__dirname + "/views/addStudent.html"));
});

app.post("/students/add", (req, res) => {
  collegeData.addStudent(req.body).then((value) => {
      console.log(value)
      res.json(value);
    }).catch((err) => {
      res.send({ message: "no results" });
    });
});


// setup http server to listen on HTTP_PORT
collegeData.initialize()
  .then(() => {
    // Start the server
    app.listen(8080, () => {
      console.log('Server is running on port 8080');
    });
  })
  .catch((err) => {
    console.error('Error initializing data:', err);
  });




app.use((req, res) => {
  res.sendFile(path.join(__dirname + "/views/error.html"));
});