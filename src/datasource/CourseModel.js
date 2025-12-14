/**
 * Course Model
 * Represents a course in the system with the updated backend schema
 */
class CourseModel {
    constructor({
        id = '',
        school = '',
        courseSubject = '',
        courseNumber = '',
        title = '',
        description = '',
        credits = 4,
        syllabusRevisionDate = '',
        prerequisites = [],
        corequisites = [],
        status = 'active',
    } = {}) {
        this.id = id;
        this.school = school;
        this.courseSubject = courseSubject;
        this.courseNumber = courseNumber;
        this.title = title;
        this.description = description;
        this.credits = credits;
        this.syllabusRevisionDate = syllabusRevisionDate;
        this.prerequisites = prerequisites;
        this.corequisites = corequisites;
        this.status = status;
    }
}

export default CourseModel;