import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  public type Course = {
    id : Text;
    name : Text;
    description : Text;
  };

  public type Student = {
    principal : Principal;
    name : Text;
    enrolledCourses : [Text];
  };

  public type Marketer = {
    principal : Principal;
    name : Text;
    referralCount : Nat;
  };

  public type UserProfile = {
    name : Text;
    role : Text;
  };

  public type StudentApplication = {
    name : Text;
    contactInfo : Text;
    courseSelected : Text;
    referredBy : ?Text;
  };

  public type Actor = {
    courses : Map.Map<Text, Course>;
    students : Map.Map<Principal, Student>;
    marketers : Map.Map<Principal, Marketer>;
    userProfiles : Map.Map<Principal, UserProfile>;
    studentApplications : Map.Map<Nat, StudentApplication>;
    nextApplicationId : Nat;
  };

  public func run(old : Actor) : Actor {
    let updatedCourses = Map.fromIter<Text, Course>(
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

    {
      old with
      courses = updatedCourses
    };
  };
};
