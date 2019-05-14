const graphql = require('graphql');
const _ = require('lodash');
var mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const saltRounds = 10;
const cidMutator = function (result) {
    let copy = JSON.parse(JSON.stringify(result));
    copy.cid = result._id;
    return copy;
}

mongoose.Promise = global.Promise;
//Set up default mongoose connection
var mongoDB = 'mongodb+srv://aakashkanvinde:shobha4741@canvas-pcwil.mongodb.net/canvasDB?retryWrites=true';
mongoose.connect(mongoDB, { useCreateIndex: true, useNewUrlParser: true, poolSize: 500 }).then(
	() => { 
		console.log("Successfully Connected to MongoDB"); 
	},
	err => { 
		console.log(`Error Connecting to MongoDB: ${err}`); 
	}
);
var { UserModel, CourseModel } = require("../models/model");
//get all mongoDB Data
let users = [];
let courses = [];
(async () => {
    users = await UserModel.find({})
        .populate({ path: 'waitlistcourses', populate: { path: "uid", select: ["FirstName", "LastName"] } })
        .populate({ path: 'courses', populate: { path: "uid", select: ["FirstName", "LastName"] } })
        .exec();
    courses = CourseModel.find({}).populate({ path: "uid", select: "CourseName" }).exec();
})(users, courses);

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;

const UserType = new GraphQLObjectType({
    name: 'users',
    fields: () => ({
        _id: { type: GraphQLID },
        FirstName: { type: GraphQLString },
        LastName: { type: GraphQLString },
        Email: { type: GraphQLString },
        Password: { type: GraphQLString },
        AboutMe: { type: GraphQLString },
        Gender: { type: GraphQLString },
        City: { type: GraphQLString },
        Country: { type: GraphQLString },
        School: { type: GraphQLString },
        Hometown: { type: GraphQLString },
        Languages: { type: GraphQLString },
        PhoneNumber: { type: GraphQLString },
        Role: { type: GraphQLString }
    })
});
const courseType = new GraphQLObjectType({
    name: 'courses',
    fields: () => ({
        _id: { type: GraphQLID },
        CourseId: { type: GraphQLInt },
        CourseName: { type: GraphQLString },
        CourseTerm: { type: GraphQLString },
        CourseDepartment: { type: GraphQLString },
        CourseDescription: { type: GraphQLString },
        CourseRoom: { type: GraphQLString },
        CourseCapacity: { type: GraphQLString },
        WaitlistCapacity: { type: GraphQLString },
        CurrentEnrolled: { type: GraphQLString },
        CurrentWaitlisted: { type: GraphQLString },
        cid: { type: GraphQLString },
        uid: { type: UserType }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        login: {
            type: UserType,
            args: {
                Email: { type: GraphQLString },
                Password: { type: GraphQLString }
            },
            async resolve(parent, args, context) {
                let result = _.find(users, { Email: args.Email });
                try {
                    let { req, res } = context;
                    let { Email, Password } = args;
                    let data = null;
                    // console.log(args);
                    if (!result) {
                        data = {
                            loginSuccess: 0,
                            message: "Email or Password Incorrect"
                        };
                    } else {
                        const match = await bcrypt.compare(Password, result.Password);
                        if (match) {
                            var userOne = {
                                Email: result.Email
                            };
                            var token = jwt.sign(userOne, "Hardwork always pays off", {
                                expiresIn: 10080 // in seconds
                            });
                            data = {
                                loginSuccess: 1,
                                message: "Login Successfull!",
                                token: 'JWT ' + token
                            };
                            console.log("In GraphQL Login Route");
                            console.log("User Login Successful");
                            console.log("Email "+args.Email);

                            context.res.cookie('cookie', JSON.stringify({ Email: result._id, role: result.role, token: 'JWT ' + token }), { maxAge: 900000000, httpOnly: false, path: '/' });
                        } else {

                            data = { loginSuccess: 0, message: "Email or Password Incorrect" };
                        }
                    }
                    console.log(res);
                    return result;
                } catch (error) {
                    console.log(error);
                }
            }
        },
        allCourses: {
            type: new GraphQLList(courseType),
            args: {
                id: { type: GraphQLString },
            },
            resolve(parent, args) {
                console.log(args.id);
                let obj = _.find(users, { id: args.id });
                console.log("users");
                console.log(JSON.stringify(obj));
                let courseArray = [...obj.courses, ...obj.waitlistcourses];
                courseArray = courseArray.map((data) => {
                    let obj = cidMutator(data);
                    obj.status = "Enrolled";
                    obj.name = obj.uid.name;
                    return obj;
                })
                console.log("In GraphQL View All courses Route");
                console.log("Details:");
                console.log(courseArray);
                return courseArray;
            }
        },

    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        signup: {
            type: UserType,
            args: {
                Email: { type: GraphQLString },
                Password: { type: GraphQLString },
                FirstName: { type: GraphQLString },
                LastName: { type: GraphQLString },
                Role: { type: GraphQLString }
            },
            async resolve(parent, args) {
                let { Email, Password, FirstName, LastName, role } = args;
                try {
                    let responseOne = _.find(users, { Email });
                    if (responseOne) {
                        var body = {
                            message: "Signup failed! Email already exists",
                            insertStatus: 0
                        };
                        console.log("here");
                        return false;

                    } else {
                        let hash = await bcrypt.hash(Password, saltRounds);
                        var user = new UserModel({ Email, Password: hash, FirstName, LastName, role });
                        let response = await user.save();
                        console.log("user saved successfully");
                        console.log(response);
                        var body = {
                            message: "Sign up successful. Redirecting to Login Page...",
                            insertStatus: 1
                        };
                        console.log("In GraphQL Signup Route");
                        console.log("User Login Successfull");
                        console.log("Details :  ");
                        console.log(response);
                        return response;
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        },
        updateProfile: {
            type: UserType,
            args: {
                uid: { type: GraphQLString },
                LastName: { type: GraphQLString },
                FirstName: { type: GraphQLString },
                AboutMe: { type: GraphQLString },
                Hometown: { type: GraphQLString },
                City: { type: GraphQLString },
                Country: { type: GraphQLString },
                School: { type: GraphQLString },
                Languages: { type: GraphQLString },
                Gender: { type: GraphQLString },
                PhoneNumber: { type: GraphQLString }
            },
            async resolve(parent, args) {
                let { uid, FirstName, LastName, PhoneNumber, AboutMe, City, Country, School, Hometown, Languages, Gender } = args;
                try {
                    var post = { FirstName, LastName, PhoneNumber, AboutMe, City, Country, School, Hometown, Languages, Gender };
                   
                    let result = await UserModel.findOneAndUpdate({ _id: uid }, { $set: { ...post } });
                    console.log("In GraphQL Profile Update Route");
                    console.log("Details");
                    console.log(post);
                    return result;
                } catch (error) {
                    console.log(error);
                }

            }
        },
        addCourses: {
            type: courseType,
            args: {
                uid: { type: GraphQLString },
                CourseId: { type: GraphQLString },
                CourseName: { type: GraphQLString },
                CourseDepartment: { type: GraphQLString },
                CourseDescription: { type: GraphQLString },
                CourseRoom: { type: GraphQLString },
                CourseTerm: { type: GraphQLString },
                CourseCapacity: { type: GraphQLString },
                WaitlistCapacity: { type: GraphQLString },
            },
            async resolve(parent, args) {

                try {
                    console.log(args);
                    console.log("here");
                    let { CourseId, CourseName, CourseDepartment, CourseDescription, CourseRoom, CourseCapacity, WaitlistCapacity, CourseTerm, uid } = args;
                    let result = await CourseModel.findOne({ CourseId: CourseId });
                    if (result) {
                        return false;
                    } else {
                        let newCourse = new CourseModel({
                            CourseId, CourseName, CourseDepartment, CourseDescription, CourseRoom, CourseCapacity, WaitlistCapacity, CourseTerm, uid,
                            currEnrollment: 0,
                            currWaitlist: 0
                        });
                        let result2 = await newCourse.save();
                        let { _id: CourseId } = result2;
                        let result3 = await UserModel.update(
                            { _id: uid },
                            { $push: { courses: CourseId } }
                        );
                        console.log("In GraphQL Add Course Route");
                        console.log("Details");
                        console.log(newCourse);
                        return result2;
                    }
                } catch (error) {
                    console.log(error);
                }


            }
        }

    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});