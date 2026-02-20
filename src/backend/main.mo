import Map "mo:core/Map";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  // Initialize Access Control System
  let accessControlState = AccessControl.initState();

  include MixinAuthorization(accessControlState);

  // Define User Roles
  type UserRole = AccessControl.UserRole;

  // Define Course structure
  public type Course = {
    id : Text;
    name : Text;
    description : Text;
  };

  // Define Student structure
  public type Student = {
    principal : Principal;
    name : Text;
    enrolledCourses : [Text]; // Course IDs
  };

  // Define Marketing Representative structure
  public type Marketer = {
    principal : Principal;
    name : Text;
    referralCount : Nat;
  };

  // Define User Profile
  public type UserProfile = {
    name : Text;
    role : Text; // "Student", "Management", or "Marketer"
  };

  // Student Application Entry
  public type StudentApplication = {
    name : Text;
    contactInfo : Text;
    courseSelected : Text;
    referredBy : ?Text;
  };

  let studentApplications : Map.Map<Nat, StudentApplication> = Map.empty<Nat, StudentApplication>();

  var nextApplicationId = 0;

  // Predefined courses
  let courses : Map.Map<Text, Course> = Map.fromIter<Text, Course>(
    [
      (
        "basic",
        {
          id = "basic";
          name = "Basic Midbrain Activation Course";
          description = "Introduction to midbrain activation techniques. Duration: 3 Days, 1 hour of online classes daily";
        },
      ),
      (
        "advanced",
        {
          id = "advanced";
          name = "Advanced Midbrain Activation Course";
          description = "Advanced concepts and practices in midbrain activation. Duration: 15 Days, 1+ hours of online classes daily";
        },
      ),
      (
        "super",
        {
          id = "super";
          name = "Super Advanced Intuition Course";
          description = "Comprehensive course on developing intuition through midbrain activation.";
        },
      ),
      (
        "institution",
        {
          id = "institution";
          name = "Institution Program";
          description = "Course for teachers/founders of educational institutions. Duration: 1 month, 1+ hours of online classes daily.";
        },
      ),
      // New course for 18+
      (
        "meditation",
        {
          id = "meditation";
          name = "Meditation Program (18+)";
          description = "Course for Adults aged 18+. Duration: 21 Days, 1+ hours of daily meditation.";
        },
      ),
    ].values(),
  );

  // Persistent storage for students and marketers
  let students = Map.empty<Principal, Student>();
  let marketers = Map.empty<Principal, Marketer>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  //------------------ Student Application Submission ------------------

  public shared ({ caller }) func submitStudentApplication(application : StudentApplication) : async Nat {
    // No authentication required for public form submission
    let applicationId = nextApplicationId;
    studentApplications.add(applicationId, application);
    nextApplicationId += 1;
    applicationId;
  };

  public query ({ caller }) func getAllStudentApplications() : async [(Nat, StudentApplication)] {
    // Only admins can view submitted applications
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only management can view student applications");
    };
    studentApplications.entries().toArray();
  };

  public query ({ caller }) func getStudentApplication(applicationId : Nat) : async ?StudentApplication {
    // Only admins can view individual applications
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only management can view student applications");
    };
    studentApplications.get(applicationId);
  };

  //------------------ User Profile Management ------------------

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  //------------------ Student Section ------------------

  public shared ({ caller }) func enrollInCourse(courseId : Text) : async () {
    // Check if caller is a student (user role)
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only students can enroll in courses");
    };

    // Validate course existence
    switch (courses.get(courseId)) {
      case (null) { Runtime.trap("Cannot enroll in non-existing course") };
      case (_) {};
    };

    // Fetch or create student record
    let updatedStudent = switch (students.get(caller)) {
      case (null) {
        {
          principal = caller;
          name = "Unknown"; // Initial name, can be updated later
          enrolledCourses = [courseId];
        };
      };
      case (?existingStudent) {
        if (existingStudent.enrolledCourses.values().contains(courseId)) {
          Runtime.trap("Student already enrolled in this course");
        };
        {
          principal = existingStudent.principal;
          name = existingStudent.name;
          enrolledCourses = existingStudent.enrolledCourses.concat([courseId]);
        };
      };
    };

    students.add(caller, updatedStudent);
  };

  public query ({ caller }) func getEnrolledCourses(studentPrincipal : Principal) : async [Course] {
    // Students can only view their own courses, admins can view any student's courses
    if (caller != studentPrincipal and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own enrolled courses");
    };

    switch (students.get(studentPrincipal)) {
      case (null) { Runtime.trap("Student not found") };
      case (?student) {
        student.enrolledCourses.map(func(courseId) { courses.get(courseId) }).values().toArray().filter(
          func(course) { course != null }
        ).map(
          func(optCourse) {
            switch (optCourse) {
              case (?course) { course };
              case (null) { Runtime.trap("Course not found in system") };
            };
          }
        );
      };
    };
  };

  public shared ({ caller }) func updateStudentName(newName : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only students can update their name");
    };

    switch (students.get(caller)) {
      case (null) { Runtime.trap("Student record not found") };
      case (?existingStudent) {
        let updatedStudent = {
          principal = existingStudent.principal;
          name = newName;
          enrolledCourses = existingStudent.enrolledCourses;
        };
        students.add(caller, updatedStudent);
      };
    };
  };

  //------------------ Management Section ------------------

  public query ({ caller }) func getAllCourses() : async [Course] {
    // Public access - anyone including guests can view the course catalog
    courses.values().toArray();
  };

  public query ({ caller }) func getAllStudents() : async [Student] {
    // Only management (admins) can view all students
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only management can view all students");
    };
    students.values().toArray();
  };

  //------------------ Marketing Section ------------------

  public shared ({ caller }) func trackMarketerReferral() : async () {
    // Only authenticated marketers can track referrals
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated marketers can track referrals");
    };

    let updatedMarketer = switch (marketers.get(caller)) {
      case (null) {
        {
          principal = caller;
          name = "Unknown"; // Initial name, can be updated later
          referralCount = 1;
        };
      };
      case (?existingMarketer) {
        {
          principal = existingMarketer.principal;
          name = existingMarketer.name;
          referralCount = existingMarketer.referralCount + 1;
        };
      };
    };

    marketers.add(caller, updatedMarketer);
  };

  public shared ({ caller }) func updateMarketerName(newName : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only marketers can update their name");
    };

    switch (marketers.get(caller)) {
      case (null) { Runtime.trap("Marketer record not found") };
      case (?existingMarketer) {
        let updatedMarketer = {
          principal = existingMarketer.principal;
          name = newName;
          referralCount = existingMarketer.referralCount;
        };
        marketers.add(caller, updatedMarketer);
      };
    };
  };

  public query ({ caller }) func getMarketerStats(marketerPrincipal : Principal) : async (Text, Nat) {
    // Marketers can only view their own stats, admins can view any marketer's stats
    if (caller != marketerPrincipal and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own marketer stats");
    };

    switch (marketers.get(marketerPrincipal)) {
      case (null) { Runtime.trap("Marketer not found") };
      case (?marketer) { (marketer.name, marketer.referralCount) };
    };
  };

  public query ({ caller }) func getAllMarketers() : async [Marketer] {
    // Only management (admins) can view all marketers
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only management can view all marketers");
    };
    marketers.values().toArray();
  };
};
