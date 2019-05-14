const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var UserSchema = new Schema({
	Id: {
		type: mongoose.Schema.Types.ObjectId
	},
	FirstName: {
		type: String,
		required: true
	},
	LastName: {
		type: String,
		required: true
	},
	Email: {
		type: String,
		required: true
	},
	Password: {
		type: String,
		required: true
	},
	AboutMe: {
		type: String
	},
	PhoneNumber: {
		type: Number
	},
	ProfileImage: {
		type: String
	},
	City: {
		type: String
	},
	Country: {
		type: String
	},
	Company: {
		type: String
	},
	School: {
		type: String
	},
	HomeTown: {
		type: String
	},
	Languages: {
		type: [String]
	},
	Gender: {
		type: String
	},
	Role: {
		type: String
	},
	Enrolled: {
		type: String
	},
	Courses: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "course"
		}
	],
	waitlistcourses: [
		{
			type: Schema.Types.ObjectId,
			ref: "courses"
		}
	],
	Chats: [
		{
			uid: { type: Schema.Types.ObjectId, ref: "users" },
			messages: [
				{
					action: String,
					messagetext: String
				}
			]
		}
	]
});

var CourseSchema = new Schema({
	Id: {
		type: mongoose.Schema.Types.ObjectId
	},
	CourseId: {
		type: String,
		required: true,
		unique: true
	},
	CourseName: {
		type: String,
		required: true
	},
	CourseDepartment: {
		type: String,
		required: true
	},
	CourseDescription: {
		type: String
	},
	CourseRoom: {
		type: String
	},
	CourseCapacity: {
		type: Number
	},
	WaitlistCapacity: {
		type: Number
	},
	CourseYear: {
		type: Number
	},
	CourseTerm: {
		type: String,
		required: true
	},
	CurrentEnrolled: {
		type: Number,
		default: 0
	},
	CurrentWaitlisted: {
		type: Number,
		default: 0
	},
	CourseTakenByUserId: {
		type: Number
	},
	Assignments: [{
    header:String,
    bodyText:String,
    plainText:String,
    posted:Date,
    due:Date,
    available:Date, 
    points:Number,
    submission:[{
      uid: {type:Schema.Types.ObjectId,ref:'users'},
      grades:Number,
      submissionfile:[{
        file:String,
        filename:String
      }]
    }],
  }],
	Announcements: [{
		header:String,
		bodyText:String,
		plainText:String,
		posted:Date
	}],
	Quizzes: [{
    heading:String,
    description:String,
    posted:Date,
    due:Date,
    availablefrom:Date,
    availableto:Date,
    timelimit:Number,
    published:Number,
    points:Number,
    questions:[{
      question:String,
      answer:String,
      options:[{
        type:String
      }]
    }],
    quizsubmission:[{
      uid:{type:Schema.Types.ObjectId,ref:'users'},
      answers:[{
        questionId:Schema.Types.ObjectId,
        answer:String
      }],
      grades:Number
    }]
  }],
	EnrollmentStatus: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "enrollment"
		}
	],
	Files: [
		{
			file: String,
			filename: String,
			posted: Date
		}
	]
});

var CourseModel = mongoose.model("courses", CourseSchema);
var UserModel = mongoose.model("users", UserSchema);

module.exports = {
	UserModel,
	CourseModel
};
