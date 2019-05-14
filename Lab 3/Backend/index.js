var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var cors = require('cors');
app.set('view engine','ejs');
var mysql = require('mysql')
var config = require('./config/config');
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
const saltRounds = 10;
var UserModel = require('./models/user');
var CourseModel = require('./models/course');
var AnnouncementModel = require('./models/announcement');
var QuizModel = require('./models/quiz');
var AssignmentModel = require('./models/assignment');


// using cors to enable cross origin resource sharing
app.use(cors({origin: 'http://localhost:3000', credentials: true}));

// bodyParser to parse URL encoded request data
app.use(bodyParser.urlencoded({extended: true}))
// bodyParser to parse json request data
app.use(bodyParser.json());

// cookieParser for parsing request headers
app.use(cookieParser());

// use Session variable to store data between HTTP requests
app.use(session({
    secret: 'cmpe273-canvasPrototype-Lab1',
    resave: false,
    saveUninitialized: true,
    duration: 60 * 60 * 1000,
    activeDuration: 5 * 60 * 1000
}));

// allowing access control
// app.use((req, res) => {
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//     res.setHeader('Access-Control-Allow-Credentials', 'true');
//     res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
//     res.setHeader('Cache-Control', 'no-cache');
//     next();
// });


// Creating a connection object for connecting to mysql database
var con = mysql.createConnection({
    host: config.database_host,
    user: config.database_user,
    password: config.database_password,
    port: config.database_port,
    database: config.database_name
});

con.connect((err)=> {
    if (err) {
        console.error('Error occurred in connecting: ' + err.message);
        return;
    }
    console.log("Connected as ID " + con.threadId);
});

// Creating a connection object for connecting to MONGODB database
mongoose.connect(
	"mongodb+srv://aakashkanvinde:shobha4741@canvas-pcwil.mongodb.net/canvasDB?retryWrites=true", {
		useCreateIndex: true,
		useNewUrlParser: true,
		poolSize: 500
	}
).then(
	() => { 
		console.log("Successfully Connected to MongoDB"); 
	},
	err => { 
		console.log(`Error Connecting to MongoDB: ${err}`); 
	}
);

mongoose.Promise = global.Promise;

// Route to handle the Post Calls

var user = {};

/* ROUTE TO USER LOGIN */

app.post('/login',(req, res, next) => {
    console.log("Inside Login POST Request");
    console.log("Request Body: ",req.body);
    // console.log("Connected to Database as ID " + con.threadId);
    // Define sql query for comparing userId and password with DB stored userId and password
    // var sql = 'SELECT * FROM UsersInfo WHERE student_id = ' +mysql.escape(req.body.userId);
    let returnResult = {};

    UserModel.findOne({ UserId: req.body.userId })
	.then(doc => {
		console.log(`User found in db: ${doc}`);
		if(doc) {
			var hash = doc.Password;
			console.log("Hashed password from the Database, " + hash);
            bcrypt.compare(req.body.password, hash, (err, matches) => {
                if(err) throw err;
                if(matches){
                    console.log("User SESSION SET and started");
                    req.session.userId = doc.UserId;
                    console.log(req.session.userId);
                    returnResult.message = "Successful Login";
                    returnResult.status = 200;
                    returnResult.userId = req.session.userId;
                    returnResult.role = doc.Role;
                    user.userId = req.session.userId;
                    user.role = doc.Role;
                    res.cookie('login',"user",{maxAge: 900000, httpOnly: false, path : '/'});
                    res.json(returnResult);            
                }else {
                    console.log("Wrong Username or Password");
                    returnResult.message = "Error";
                    returnResult.status = 404;
                    res.json(returnResult);
                }
            })

			console.log(`Result: ${doc}`);
			// response.status(200).json(doc);

		} else {
			res.status(404).json({message: 'No such user found'});
		}
	})
	.catch(error => {
		console.log(`Error: ${error}`);
			response.status(500).json({error: error});
	});

    // MYSQL PART
    // con.query(sql, (err, result) => {
    //     if (err) throw err;
    //     if(!result[0]){
    //         // console.error('Error occurred: ' + err.message);
    //         res.json({
    //             status : 100,
    //             message : "No such user found"
    //         });
    //     }else{
    //         var hash = result[0].password;
    //         console.log("Hashed password from the Database, " + hash);
    //         bcrypt.compare(req.body.password, hash, (err, matches) => {
    //             if(err) throw err;
    //             if(matches){
    //                 console.log("User SESSION SET and started");
    //                 req.session.userId = result[0].student_id;
    //                 console.log(req.session.userId);
    //                 returnResult.message = "Successful Login";
    //                 returnResult.status = 200;
    //                 returnResult.userId = req.session.userId;
    //                 returnResult.role = result[0].role;
    //                 user.userId = req.session.userId;
    //                 user.role = result[0].role;
    //                 res.cookie('login',"user",{maxAge: 900000, httpOnly: false, path : '/'});
    //                 res.json(returnResult);
    //                 // res.writeHead(200,{
    //                 //     'Content-Type' : 'text/plain',
    //                 //     'result' : result[0].student_id,
    //                 //     'session' : req.session.userId,
    //                 // });
    //                 // res.end("Successful Login");              
    //             }else {
    //                 console.log("Wrong Username or Password");
    //                 // res.writeHead(404,{
    //                 //     'Content-Type' : 'text/plain',
    //                 //     message: '404',
    //                 // })
    //                 // res.end("Unsuccessful Login");
    //                 returnResult.message = "Error";
    //                 returnResult.status = 404;
    //                 res.json(returnResult);
    //             }
    //         })
    //     }
    // });     
});

/* ROUTE TO NEW USER SIGNUP */

app.post('/signup',(req,res) => {
    console.log("Within Signup POST");

    // const userId = req.body.userId;
    let password = req.body.password;
    // const email = req.body.email;
    // const role = req.body.role;
    // const userName = req.body.userName;
    let returnResult = {};


    bcrypt.hash(password, saltRounds, (err,hash) => {
        if (err) throw err;
        console.log("Inside Signup Password Hash: "+hash);
        // console.log("Connected to Database with Thread " + con.threadId);
        // INSERT A NEW USER IN THE MongoDB
        console.log(`${req.body.userName} 
                    \n ${req.body.userId}
                    \n ${hash}
                    \n ${req.body.email}
                    \n ${req.body.role}`);

        const newUser = new UserModel({
            Id: new mongoose.Types.ObjectId(),
            UserId: req.body.userId,
            UserName: req.body.userName,
            Email: req.body.email,
            Password: hash,
            Role: req.body.role
        });            

        newUser
        .save()
        .then( result => {
                console.log(`Result: ${result}`);
                // response.status(200).json(result);
                returnResult.status = 200;
                returnResult.message = "Successful User Addition";
                res.json(returnResult);
                console.log("New User Added Successfully");
            }
        )
        .catch(error => {
                console.log(`Error: ${error}`);
                res.status(500).json({error: error});
            }
        )

        // MYSQL part
        // var sqlInsert = "INSERT INTO UsersInfo(name,email,password,student_id,role) VALUES (?,?,?,?,?)";
        // var values = [
        //     userName,email,hash,userId,role
        // ];
        // con.query(sqlInsert, values, (err, result) => {
        //     if(err) {
        //     console.log('Error occurred in connecting: ' + err.name);
        //     console.log('Error message: ' + err.message);
        //     res.json("ERROR in connecting DB");
        // } else {
        //     console.log("Inserting new entry!")
        //     console.log("New user successfully Signed up!");
        //     // res.writeHead(200,{
        //     //     'Content-Type' : 'text/plain'
        //     // });
        //     // res.end("Successful User Addition");
        //     returnResult.status = 200;
        //     returnResult.message = "Successful User Addition";
        //     res.json(returnResult);
        //     // res.redirect('/home');
        //     console.log("New User Added Successfully");
        // }
        // });
    });
});


/* ROUTE TO GET COURSES */
app.get("/courses", (req,res) => {
    console.log("Inside COURSES GET");
    if(req.session.userId == "undefined"){
        console.log("Error in getting course details");
        //  res.redirect('/');
    } else{
        let returnResult = {};
        if(user.role === "Faculty"){
        //     console.log("User Role: "+user.role);
        //     UserModel.findOne({ UserId: user.userId })
        //     .then(doc => {
        //         // console.log(`User found in db: ${doc}`);
        //         if(doc) {
        //             let resultCourse = [];
        //             // console.log("doc.Courses: "+doc);
        //             doc.Courses.map((course) => {
        //                 CourseModel.find({ _id: course }).then(docu =>{
        //                     // console.log(`Result: ${docu}`);
        //                     resultCourse.push(docu[0]);
        //                 });
        //             });
        //             setTimeout(() => {
        //                 // console.log("resultCourse: "+resultCourse)
        //                 returnResult.status = 200;
        //                 returnResult.message = "success";
        //                 returnResult.data = resultCourse;  
        //                 res.end(JSON.stringify(returnResult));  
        //             }, 100);
        //         } else {
        //             // res.status(404).json({message: 'No such user found'});
        //             returnResult.status = 404;
        //             returnResult.message = "Error";
        //             console.log('Error occurred in getting courses: ' + err.name);
        //             console.log('Error message: ' + err.message);
        //             res.json(returnResult);
        //         }
        //     })
        // } else if(user.role === "Student"){
        //     console.log("User Role: "+user.role);
        //     EnrollmentModel.find({UserId: user.userId})
        //     .then(doc => {
        //         // console.log(`User found in db: ${doc}`);
        //         if(doc){
        //             let resultCourse = [];
        //             doc.Courses.map((course) => {
        //                 CourseModel.find({ _id: course }).then(docu =>{
        //                     // console.log(`Result: ${docu}`);
        //                     resultCourse.push(docu[0]);
        //                 });
        //             });
        //             setTimeout(() => {
        //                 // console.log("resultCourse: "+resultCourse)
        //                 returnResult.status = 200;
        //                 returnResult.message = "success";
        //                 returnResult.data = resultCourse;  
        //                 res.end(JSON.stringify(returnResult));  
        //             }, 100);
        //         } else {
        //             // res.status(404).json({message: 'No such user found'});
        //             returnResult.status = 404;
        //             returnResult.message = "Error";
        //             console.log('Error occurred in getting courses: ' + err.name);
        //             console.log('Error message: ' + err.message);
        //             res.json(returnResult);
        //         }
        //     });
        // }
            // MYSQL PART
            var sqlCourses = "SELECT * FROM courses WHERE facultyId='"+user.userId+"'"
            } else if(user.role === "Student"){
                console.log("User Role: "+user.role);
                sqlCourses = "SELECT * FROM courses WHERE courseId IN ( SELECT courseId FROM enrollment WHERE studentId = '"+user.userId+"' )"; 
            }
            con.query(sqlCourses,(err,result) => {
                if(err) {
                    returnResult.status = 404;
                    returnResult.message = "Error";
                    console.log('Error occurred in getting courses: ' + err.name);
                    console.log('Error message: ' + err.message);
                    res.json(returnResult);
                } else {
                    console.log(result);
                    returnResult.status = 200;
                    returnResult.message = "success";
                    returnResult.data = result;
                    res.end(JSON.stringify(returnResult));
                    // res.redirect('/home');
                    console.log("Courses displayed successfully");            
                }
            });
    }
});

/* ROUTE TO ADD NEW COURSE */
app.post("/courses/new", (req,res) => {
    console.log("Inside ADD COURSES POST");
    if(req.session.userId == "undefined"){
        console.log("Error in adding course");
        //  res.redirect('/');
    } else{
        let returnResult ={};
        // const courseId = req.body.courseId;
        // const courseName = req.body.courseName;
        // const courseDepartment = req.body.courseDepartment;
        // const courseDescription = req.body.courseDescription;
        // const courseRoom = req.body.courseRoom;
        // const courseCapacity = req.body.courseCapacity;
        // const courseWaitlist = req.body.courseWaitlist;
        // const courseTerm = req.body.courseTerm;
        // const facultyId = user.userId;

        const newCourse = new CourseModel({
            Id: new mongoose.Types.ObjectId(),
            CourseId: req.body.courseId,
            CourseName: req.body.courseName,
            CourseDepartment: req.body.courseDepartment,
            CourseDescription: req.body.courseDescription,
            CourseRoom: req.body.courseRoom,
            CourseCapacity: req.body.courseCapacity,
            WaitlistCapacity: req.body.courseWaitlist,
            CourseTerm: req.body.courseTerm,
            CourseTakenByUserId: user.userId
        }); 

        // MYSQL PART
        // var sqlAddCourse = "INSERT INTO courses (courseId,courseName,courseDepartment,courseDescription,courseRoom,courseCapacity,courseWaitlist,courseTerm,facultyId) VALUES ('" + req.body.courseId + "','" + req.body.courseName + "','" + req.body.courseDepartment + "','" + req.body.courseDescription + "','" + req.body.courseRoom + "','" + Number(req.body.courseCapacity) + "'," + Number(req.body.courseWaitlist) + "," + req.body.courseTerm + ",'" + user.userId + "')";

        // MYSQL PART
        // var sqlAddCourse = "INSERT INTO courses(courseId,courseName,courseDepartment,courseDescription,courseRoom,courseCapacity,courseWaitlist,courseTerm,facultyId) VALUES (?,?,?,?,?,?,?,?,?)";
        // var values = [
        //     courseId,courseName,courseDepartment,courseDescription,courseRoom,courseCapacity,courseWaitlist,courseTerm,facultyId
        // ];

        newCourse
        .save()
        .then( result => {
                console.log(`Result: ${result}`);
                UserModel.findOneAndUpdate(
                    { UserId: user.userId },
                    {
                        $push: {
                            Courses: newCourse
                        }
                    },
                    {new: true},
                    (err, doc) => {
                        if (err) {
                            console.log(`Error - ${err}`);
                            console.log(`Attaching Course to User Failure:\n ${err}`);
                            returnResult.status = 404;
                            returnResult.message = "Error";
                            res.json(returnResult);
                        } else {
                            console.log(`User - ${doc}`);
                            console.log(`Successfully Attached Course to User:\n ${doc}`);
                            // response.status(200).json({ course: result, user: doc});
                            returnResult.status = 200;
                            returnResult.message = "success";
                            res.json(returnResult);
                        }
                    }
                );
 
                // })
                // newUser.save(function(error) {
                //     if (!error) {
                //         UserModel.findOneAndUpdate({ UserId: req.body.userId })
                //             .populate('Courses')
                //             .exec(function(error, posts) {
                //                 console.log(JSON.stringify(posts, null, "\t"))
                //             })
                //     }
                // });
                console.log("New Course Added Successfully");
            }
        ).catch(error => {
                console.log(`Error: ${error}`);
                returnResult.status = 404;
                returnResult.message = "Error";
                res.json(returnResult);
            }
        )

        // MYSQL PART
        // con.query(sqlAddCourse, values, (err,result) => {
        //     if(err) {
        //         returnResult.status = 404;
        //         returnResult.message = "Error";
        //         console.log('Error occurred in adding course: ' + err.name);
        //         console.log('Error message: ' + err.message);
        //         res.json(returnResult);
        //     } else if(result.affectedRows === 1){
        //         returnResult.status = 200;
        //         returnResult.message = "success";
        //         // returnResult.data = result;
        //         // res.end(JSON.stringify(returnResult));
        //         res.json(returnResult);
        //         console.log(result);
        //         console.log("Course added successfully");            
        //     }
        // });
    }
});


/* ROUTE TO SEARCH A COURSE */
app.get("/courses/search", (req,res)=>{
    console.log("Inside SEARCH COURSES GET");
    if(req.session.userId == "undefined"){
        console.log("Error in adding course");
        //  res.redirect('/');
    } else{
        let returnResult ={}
        let sqlSearchCourse = "SELECT * FROM courses WHERE courseId NOT IN (SELECT courseId FROM enrollment WHERE studentId='"+user.userId+"')";
        con.query(sqlSearchCourse,(err,result)=>{
            if(err) throw err;
            returnResult.status = 200;
            returnResult.message = "success";
            returnResult.courses = result;
            console.log(result);
            // console.log("Course added successfully");   
            res.json(returnResult);
        });
    }
});



/* ROUTE TO A SPECIFIC COURSE's HOME  */
app.get("/courses/:id/home",(req,res)=>{
    console.log("Inside COURSE's GET");
    if(req.session.userId == "undefined"){
        console.log("Error in getting course home");
        //  res.redirect('/');
    } else{
        let returnResult = {}

        // var sqlCourseHome = "SELECT * FROM courses where courseId = '" + req.params.id + "'";

        CourseModel.find({CourseId: req.params.id}).then(doc => {
            if(doc){
                
                if(user.role === "Student"){
                    EnrollmentModel.find({CourseId: req.params.id, UserId: user.userId}).then(docu =>{
                        if(docu){
                            returnResult.status = docu[0].EnrollmentStatus;
                            console.log(returnResult.status);
                        }else{
                            returnResult.status = "none";
                        }
                    })
                }
            } 
        })
        // UserModel.findOne({ UserId: user.userId })
        //     .then(doc => {
        //         // console.log(`User found in db: ${doc}`);
        //         if(doc) {
        //             let resultCourse = [];
        //             // console.log("doc.Courses: "+doc);
        //             doc.Courses.map((course) => {
        //                 CourseModel.find({ _id: course }).then(docu =>{
        //                     // console.log(`Result: ${docu}`);
        //                     resultCourse.push(docu[0]);
        //                 });
        //             });
        //             setTimeout(() => {
        //                 // console.log("resultCourse: "+resultCourse)
        //                 returnResult.status = 200;
        //                 returnResult.message = "success";
        //                 returnResult.data = resultCourse;  
        //                 res.end(JSON.stringify(returnResult));  
        //             }, 100);
                    
                    
        //         } else {
        //             // res.status(404).json({message: 'No such user found'});
        //             returnResult.status = 404;
        //             returnResult.message = "Error";
        //             console.log('Error occurred in getting courses: ' + err.name);
        //             console.log('Error message: ' + err.message);
        //             res.json(returnResult);
        //         }
        //     })
        //     .catch(error => {
        //         console.log(`Error: ${error}`);
        //             response.status(500).json({error: error});
        //     });


        // MYSQL PART
        var sqlCourseHome = "SELECT * FROM courses where courseId = '" + req.params.id + "'";
        if (user.role === "Student") {

            var sqlCourseHome2 = "SELECT enrollmentStatus FROM enrollment where courseId = '" + req.params.id + "' and studentId='" + user.userId + "'";
            con.query(sqlCourseHome2, (err, result) => {
                if (!result[0]) {
                    returnResult.status = "none";
                }
                else if (result) {
                    returnResult.status = result[0].enrollmentStatus;
                    console.log(returnResult.status);
                }
            });
        }
        con.query(sqlCourseHome,(err,result)=>{
            if(err){
                // returnResult.status = 404;
                returnResult.message = "error";
                console.log('Error occurred in routing to course home: ' + err.name);
                console.log('Error message: ' + err.message);
                res.json(returnResult);
            }
            returnResult.message = "success";
            // returnResult.status = 200;
            returnResult.data = result[0];
            console.log(returnResult.data);
            res.json(returnResult);
        });
    }   
});

app.post("/courses/:id/home",(req,res)=>{
    console.log("Inside COURSE's POST");
    if(req.session.userId == "undefined"){
        console.log("Error in getting course home");
        //  res.redirect('/');
    } else{
        let returnResult = {};
        var sqlCourseHome3 = "";
        let facultyId = "";
        if(req.body.action==="enroll" || req.body.action==="waitlist"){
            new Promise((resolve,reject)=>{
                con.query("SELECT facultyId FROM courses where courseId='"+req.params.id+"'",(err,result)=>{
                    facultyId=result[0].facultyId;
                    console.log(facultyId);
                    resolve([req.params.id,facultyId,req.body.action]);
                });
            })
            .then((value)=>{
                sqlCourseHome3 = "INSERT INTO enrollment (courseId,studentId,facultyId,enrollmentStatus) values ('"+value[0]+"','"+user.userId+"','"+value[1]+"','"+value[2]+"');";
                con.query(sqlCourseHome3,(err,result)=>{
                    if(err){
                        returnResult.message="error";
                        returnResult.status = 404;
                        res.json(returnResult);
                    }
                    returnResult.message = "success";
                    returnResult.status = 200;
                    res.json(returnResult);
                })
            })
        }
        else if(req.body.action==="drop"){
            sqlCourseHome3="DELETE FROM enrollment where studentId='"+user.userId+"' and courseId='"+req.params.id+"'";
            con.query(sqlCourseHome3,(err,result)=>{
                if(err){
                    returnResult.message = "error";
                    returnResult.status = 404;
                    res.json(returnResult); 
                }
                else if(result.affectedRows===1){
                    returnResult.message = "success";
                    returnResult.status = 200;
                    res.json(returnResult);
                }
            });
        }
    }
});


/* ROUTE TO GET PEOPLE */
app.get("/courses/:id/people", (req,res) => {
    console.log("Inside COURSE's PEOPLE GET");
    if(req.session.userId == "undefined"){
        console.log("Error in getting people");
        //  res.redirect('/');
    } else{
        let returnResult = {};
        var sqlCoursePeople = "";
        if(user.role==="Faculty"){
            sqlCoursePeople = "SELECT UsersInfo.student_id, UsersInfo.name, UsersInfo.profileImage, enrollment.enrollmentStatus FROM UsersInfo, enrollment WHERE UsersInfo.student_id = enrollment.studentId AND enrollment.courseId='" + req.params.id + "'";
        }
        else{
            sqlCoursePeople = "SELECT UsersInfo.student_id, UsersInfo.name, UsersInfo.profileImage FROM UsersInfo, enrollment WHERE UsersInfo.student_id = enrollment.studentId AND enrollment.enrollmentStatus = 'enroll' AND enrollment.courseId='" + req.params.id + "'";
        }
        con.query(sqlCoursePeople,(err,result)=>{
            if(err){
                returnResult.message="error";
                returnResult.status = 404;
                res.json(returnResult);
            }
            returnResult.message = "success";
            returnResult.status = 200;
            returnResult.people = result;
            res.json(returnResult);
        });
    }
});

app.post("/courses/:id/people", (req,res) => {
    console.log("Inside COURSE's PEOPLE POST");
    if(req.session.userId == "undefined"){
        console.log("Error in getting people");
    } else{
        let permissionCode="";
        let returnResult = {};
        var sqlCoursePeople1 = "";
        if(req.body.action === "enroll"){
            sqlCoursePeople1 = "UPDATE enrollment SET enrollmentStatus='enroll' WHERE courseId='"+req.body.courseId+"' AND studentId='"+req.body.personId+"'";
            // Generating permissionCode
            let date = new Date();
            let ms = date.getMilliseconds();
            let y = date.getFullYear();
            let s = date.getSeconds();
            let m = date.getMonth();
            let min = date.getMinutes()
            let d = date.getDay();
            let h = date.getHours();
            let arr = [ms, y, s, m, min, d, h];
            permissionCode = arr.join("");
        }
        else if(req.body.action==="remove"){
            sqlCoursePeople1 = "DELETE FROM enrollment WHERE courseId='"+req.body.courseId+"' AND studentId='"+req.body.personId+"'";
        }
        con.query(sqlCoursePeople1,(err,result)=>{
            if(err){
                console.log("Error in updating enrollment status");
                returnResult.message="error";
                returnResult.status = 404;
                res.json(returnResult);
            }
            if(result.affectedRows === 1){
                console.log("Success in updating enrollment status");
                returnResult.message="success";
                returnResult.permissionCode = permissionCode;
                returnResult.status = 200;
                res.json(returnResult);
            }
        });
    }
});

/* ROUTE TO GET USER PROFILE */
app.get("/userprofile",(req,res) => {
    console.log("Inside User profile GET");
    // console.log("Inside User profile GET "+ session.userId)
    if(req.session.userId == "undefined"){
        console.log("Error in getting User details");
    } else{
        let returnResult = {};
        // query to get user details
        console.log(user.userId);
        var sqlUserProfile = "SELECT * FROM UsersInfo WHERE student_id='"+user.userId+"';";
        con.query(sqlUserProfile, (err,result) => {
            if(err) {
                console.log('Error occurred in getting User details: ' + err.name);
                console.log('Error message: ' + err.message);
                returnResult.message = "error";
                returnResult.status = 404;
                res.json(returnResult);
                // res.json({"ERROR":  err.message});
            }else{
                returnResult.data = result[0];
                console.log(returnResult);
                returnResult.message = "success";
                returnResult.status = 200;
                res.json(returnResult);
            }
        });
    }
});

/* ROUTE TO EDIT USER PROFILE */
app.post("/userprofile/edit", (req,res) => {
    console.log("Inside Edit User profile POST");
    let returnResult = {};
    if(req.session.userId == "undefined"){
        console.log("Error in editing user");
         res.redirect('/');
    } else{
        // query for updating user
        var sqlEditProfile = "UPDATE UsersInfo SET phone='"+req.body.phone+"',city='"+req.body.city+"',country='"+req.body.country+"',company='"+req.body.company+"',school='"+req.body.school+"',hometown='"+req.body.hometown+"',gender='"+req.body.gender+"',about='"+req.body.about+"',profileImage='"+req.body.profileImage+"',language='"+req.body.language+"' WHERE student_id='"+user.userId+"'";
        con.query(sqlEditProfile, (err, result) => {
            if(err) {
                console.log('Error occurred: ' + err.name);
                console.log('Error message: ' + err.message);
                returnResult.message = "error";
                returnResult.status = 404;
                res.json(returnResult);
            } else if(result.affectedRows === 1){
                returnResult.message = "success";
                returnResult.status = 200;
                res.json(returnResult);
                console.log("User Updated Successfully");
            }
        });
    }
})

/* ROUTE TO GET, POST ANNOUNCEMENT */

app.get("/courses/:id/announcement",(req,res) => {
    console.log("Inside ANNOUNCEMENT GET");
    if(req.session.userId == "undefined"){
        console.log("Error in getting announcement");
        //  res.redirect('/');
    } else{
        let returnResult = {};
        let sqlAnnouncement = "SELECT * FROM announcement WHERE courseId='"+req.params.id+"'";
        con.query(sqlAnnouncement,(err,result)=>{
            if(err){
                returnResult.message = "error";
                returnResult.status = 404;
                res.json(returnResult);
            }
            returnResult.message = "success";
            returnResult.status = 200;
            returnResult.data = result;
            console.log(returnResult);
            res.json(returnResult);
        });
    }
});

app.post("/courses/:id/announcement/new",(req,res) => {
    console.log("Inside ANNOUNCEMENT POST");
    if(req.session.userId == "undefined"){
        console.log("Error in creating announcement");
        //  res.redirect('/');
    } else{
        let returnResult = {};
        let sqlAnnouncementNew = "INSERT INTO announcement (name,description,time,courseId) VALUES ('"+req.body.announcementName+"','"+req.body.announcementDescription+"','"+req.body.announcementTime+"','"+req.body.courseId+"')";
        con.query(sqlAnnouncementNew,(err,result) => {
            if(err){
                returnResult.message = "error";
                returnResult.status = 404;
                res.json(returnResult);
            }
            else if(result.affectedRows===1){
                returnResult.message = "success";
                returnResult.status = 200;
                res.json(returnResult);
            }
        });
    }
});

app.get("/courses/:id/announcement/:announcementName",(req,res) => {
    console.log("Inside ANNOUNCEMENT NAME GET");
    if(req.session.userId == "undefined"){
        console.log("Error in getting named announcement");
        //  res.redirect('/');
    } else{
        let returnResult = {};
        let sqlAnnouncementName = "SELECT * from announcement WHERE courseId='" + req.params.id + "' AND name='"+req.params.name+"'";
        console.log("req.params.name: "+req.params.name);
        con.query(sqlAnnouncementName, (err, result) => {
            if (err) {
                returnResult.message = "error";
                returnResult.status = 404;
                res.json(returnResult);
            }
            returnResult.message = "success";
            returnResult.status = 200;
            returnResult.data = result[0];
            res.json(returnResult);
        });
    }
});

/* ROUTE TO GET, POST QUIZ */
app.get("/courses/:id/quiz",(req,res) => {
    console.log("Inside QUIZ GET");
    if(req.session.userId == "undefined"){
        console.log("Error in getting quiz");
        //  res.redirect('/');
    } else{
        let returnResult = {};
        let sqlQuiz = "SELECT * FROM quiz WHERE courseId='"+req.params.id+"'";
        con.query(sqlQuiz,(err,result)=>{
            if(err){
                returnResult.message = "error";
                returnResult.status = 404;
                res.json(returnResult);
            }
            returnResult.message = "success";
            returnResult.status = 200;
            returnResult.data = result;
            res.json(returnResult);
        });
    }
});

app.post("/courses/:id/quiz/new",(req,res) => {
    console.log("Inside QUIZ POST");
    if(req.session.userId == "undefined"){
        console.log("Error in creating quiz");
        //  res.redirect('/');
    } else{
        let returnResult = {};
        let sqlQuizNew = "INSERT INTO quiz (courseId,quizId,quizName,question1,option11,option12,option13,option14,correctoption1,question2,option21,option22,option23,option24,correctoption2,date1,date2) VALUES ('"+req.params.id+"','"+req.body.quizId+"','"+req.body.quizName+"','"+req.body.question1+"','"+req.body.option11+"','"+req.body.option12+"','"+req.body.option13+"','"+req.body.option14+"','"+req.body.correctoption1+"','"+req.body.question2+"','"+req.body.option21+"','"+req.body.option22+"','"+req.body.option23+"','"+req.body.option24+"','"+req.body.correctoption2+"','"+req.body.date1+"','"+req.body.date2+"')";
        con.query(sqlQuizNew,(err,result)=>{
            if(err){
                returnResult.message = "error";
                returnResult.status = 404;
                res.json(returnResult);
            }
            returnResult.message = "success";
            returnResult.status = 200;
            returnResult.data = result;
            res.json(returnResult);
        });
    }
});

app.get("/courses/:id/quiz/:quizId",(req,res) => {
    console.log("Inside QUIZ GET");
    if(req.session.userId == "undefined"){
        console.log("Error in getting quiz");
        //  res.redirect('/');
    } else{
        let returnResult = {};
        let sqlQuiz = "SELECT * FROM quiz WHERE courseId='"+req.params.id+"' AND quizId='"+req.params.quizId+"'";
        con.query(sqlQuiz,(err,result)=>{
            if(err){
                returnResult.message = "error";
                returnResult.status = 404;
                res.json(returnResult);
            }
            returnResult.message = "success";
            returnResult.status = 200;
            returnResult.data = result[0];
            res.json(returnResult);
        });
    }
});


app.post("/courses/:id/quiz/:quizId",(req,res) => {
    console.log("Inside QUIZ POST submit");
    if(req.session.userId == "undefined"){
        console.log("Error in submitting quiz");
        //  res.redirect('/');
    } else{
        let returnResult = {};
        let marks = 0;
        let sqlQuizSubmit = "SELECT correctoption1, correctoption2 FROM quiz WHERE courseId='"+req.params.id+"' AND quizId='"+req.params.quizId+"'";
        con.query(sqlQuizSubmit,(err,result)=>{
            if(err){
                returnResult.message = "error";
                returnResult.status = 404;
                res.json(returnResult);
            }
            // returnResult.message = "success";
            // returnResult.status = 200;
            // returnResult.data = result[0];
            // res.json(returnResult);
            new Promise((resolve,reject)=>{
                if (result[0].correctoption1 === req.body.answer1) {
                    marks++;
                }
                if (result[0].correctoption2 === req.body.answer2) {
                    marks++;
                }
                resolve(marks);
            })
            .then((value)=>{
                let sqlQuizSubmit1 = "INSERT INTO grades (courseId,studentId,grades,typeOf,typeId) values ('"+req.params.id+"','"+user.userId+"','"+value+"','quiz','"+req.params.quizId+"');";
                con.query(sqlQuizSubmit1,(err,result)=>{
                    if(result.affectedRows!==1){
                        returnResult.message = "error";
                        returnResult.status = 404;
                        res.json(returnResult);
                    }
                });
                returnResult.message="success";
                returnResult.status = 200;
                returnResult.data=value;
                res.json(returnResult);
            })
        });
    }
});

/* ROUTE TO GET GRADES */

app.get("/courses/:id/grades",(req,res) => {
    console.log("Inside GRADES GET");
    if(req.session.userId == "undefined"){
        console.log("Error in getting grades");
        //  res.redirect('/');
    } else{
        let returnResult = {};
        let sqlGrade = "";
        // let sqlGrade2 = "";
        if(user.role==="Faculty"){
            sqlGrade = "SELECT grades.studentId, UsersInfo.name, quiz.quizName, grades.grades FROM UsersInfo, quiz, grades WHERE grades.courseId = '"+req.params.id+"' AND grades.typeOf = 'quiz' AND grades.studentId = UsersInfo.student_id";
        } else if(currentUser.role==="student"){
            sqlGrade = "SELECT quiz.quizName, grades.grades FROM UsersInfo, quiz, grades WHERE grades.courseId='"+req.params.id+"' AND grades.typeOf = 'quiz' AND grades.studentId = UsersInfo.student_id AND grades.studentId='"+user.userId+"'";
        }
        con.query(sqlGrade, (err,result)=>{
            if(err){
                returnResult.message = "error";
                returnResult.status = 404;
                res.json(returnResult);
            }
            returnResult.message="success";
            returnResult.quiz = result;
            returnResult.status = 200;
            res.json(returnResult);
        });
    }
});

/* ROUTE TO POST ASSIGNMENT AND FILE */
// app.post("/courses/:id/file",upload.single('lecturefile'),(req,res)=>{
//     console.log("Inside FILE UPLOAD");
//     if(req.session.userId == "undefined"){
//         console.log("Error in uploading files");
//         //  res.redirect('/');
//     } else{
//         console.log(req.file);
//         res.send("success");
//     }
// });


/* ROUTE TO CHECK SESSION */

app.get('/checksession', (req,res) => {
    console.log("Inside Check Session GET");
    if(req.session.userId){
        res.json({"Session: " : req.session});
    } else{
        res.json({
            "session": "ERROR"
        });
    }
});

/* ROUTE TO USER LOGOUT */

app.post('/logout', (req,res) => {
    console.log("Inside Logout POST");
    console.log("Logging out..." + req.session.userId);
    req.session.destroy();
    res.clearCookie('login');
    res.writeHead(200,{
        'Content-Type' : 'text/plain'
    })
    res.end("Successful User Logout"); 

})

// starting the server on port 3001
app.listen(3001, () => {
    console.log('Server Listening on port 3001');
});


/*********************************************************************************************************/



// var sqlSelect = "SELECT `UsersInfo`.`idUsersInfo`,`UsersInfo`.`name`,`UsersInfo`.`username`,`UsersInfo`.`role`,`UsersInfo`.`student_id` FROM `canvas_DB`.`UsersInfo`;"

// con.connect((err)=> {
//     if(err) throw err;
//     console.log("Connected!")

//     con.query(sqlSelect, (err, result) => {
//         if(err) throw err;
//         console.log(result);
//     });
// });

