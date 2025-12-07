/**
 * Course Model
 * Represents a course in the system with the updated backend schema
 */
class CourseModel {
    constructor(
        id = '',
        title = '',
        description = '',
        credits = 0,
        status = 'active',
        instructor = ''
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.credits = credits;
        this.status = status;
        this.instructor = instructor;
    }
}

export default CourseModel;