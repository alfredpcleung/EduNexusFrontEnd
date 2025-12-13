
/**
 * User Model
 * Represents a user in the system with the updated backend schema
 */

/**
 * User Model
 * Represents a user in the system with the updated backend schema
 * displayName is deprecated and only used for legacy UI compatibility (not sent to backend)
 */
class UserModel {
    constructor(
        uid = '',
        firstName = '',
        lastName = '',
        email = '',
        role = 'student',
        bio = '',
        school = '',
        fieldOfStudy = '',
        displayName = '' // Deprecated: for legacy UI only
    ) {
        this.uid = uid;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
        this.bio = bio;
        this.school = school;
        this.fieldOfStudy = fieldOfStudy;
        /**
         * @deprecated displayName is not used by the backend. Use firstName and lastName instead.
         */
        this.displayName = displayName || `${firstName} ${lastName}`.trim();
    }
}

export default UserModel;