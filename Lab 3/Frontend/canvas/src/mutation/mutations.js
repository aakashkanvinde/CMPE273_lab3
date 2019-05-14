
import { gql } from 'apollo-boost';

const loginMutation=gql`
mutation Login($Email: String, $Password: String){
    login(Email: $Email, Password: $Password){
      _id,
Role,
Email
    }
}
`
const signupMutation=gql`
    mutation Signup($Email: String, $Password: String,$FirstName:String,$LastName:String,$Role:String){
        signup(Email: $Email, Password: $Password,FirstName:$FirstName,LastName:$LastName,Role:$Role){
        _id,
        Role,
        Email
        }
    }
`
const addCourse=gql`
    mutation addCourses($uid:String,$CourseId: String, $CourseDepartment: String,$CourseTerm:String,$courseDepartment:String,$CourseDescription:String,$CourseRoom:String,
        $CourseCapacity:String,$WaitlistCapacity:String){
        addCourse(uid:$uid,CourseId: $CourseId,CourseTerm:$CourseTerm, CourseDepartment: $CourseDepartment,courseDepartment:$courseDepartment,CourseDescription:$CourseDescription,
            CourseRoom:$CourseRoom,CourseCapacity:$CourseCapacity,WaitlistCapacity:$WaitlistCapacity){
       _id
        }
    }
`
const updateProfileMutation=gql`
    mutation updateProfile($uid:String,$FirstName:String,
        $LastName:String,$Gender:String,$PhoneNumber:String,$AboutMe:String,$Hometown:String,$Languages:String,$City:String,$Country:String,$School:String){
        updateProfile(uid:$uid,FirstName:$FirstName,LastName:$LastName,Gender:$Gender,PhoneNumber:$PhoneNumber,AboutMe:$AboutMe, 
            Hometown:$Hometown,Languages:$Languages,City:$City,Country:$Country,School:$School){
        _id,
        Role,
        Email,
        FirstName,
        LastName,
        AboutMe,
        PhoneNumber,
        Languages,
        Hometown,
        Gender,
        City,
        Country,
        School
        }
    }
`
const allCourses=gql`
mutation allCourses($id: String){
    allCourses(id: $id){
    _id,
    CourseDepartment,
    cid,
    CourseId,
  CourseTerm,
  courseDepartment,
  CourseDepartment,
  CourseDescription,
  CourseRoom,
  CourseCapacity,
  WaitlistCapacity,
  currEnrollment,
  currWaitlist,
  uid{
      FirstName,
      LastName
  }
    }
}
`

export {addCourse,allCourses,loginMutation,signupMutation,updateProfileMutation};