import { gql } from 'apollo-boost';

const loginQuery=gql`
query Login($Email: String, $Password: String){
    login(Email: $Email, Password: $Password){
      _id,
Role,
Email
    }
}
`
const allCoursesQuery=gql`
query allCourses($id: String){
    allCourses(id: $id){
    _id,
    CourseName,
    cid,
    CourseId,
  CourseTerm,
  CourseDepartment,
  CourseName,
  CourseDescription,
  CourseRoom,
  CourseCapacity,
  WaitlistCapacity,
  CurrentEnrolled,
  CurrentWaitlisted,
  uid{
      FirstName,
      LastName
  }
    }
}
`

export { loginQuery,allCoursesQuery };