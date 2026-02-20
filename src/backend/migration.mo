import Map "mo:core/Map";

module {
  type Course = {
    id : Text;
    name : Text;
    description : Text;
  };

  type Actor = {
    courses : Map.Map<Text, Course>;
  };

  public func run(old : Actor) : Actor {
    // Remove the institutional course if it existed
    let filteredCourses = old.courses.filter(func(id, _) { id != "institution" });
    { old with courses = filteredCourses };
  };
};
