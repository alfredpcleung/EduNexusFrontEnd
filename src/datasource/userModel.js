
/**
 * User Model
 * Represents a user in the system with the updated backend schema
 */
class UserModel {
    constructor(
        uid = '',
        displayName = '',
        email = '',
        role = 'student',
        bio = ''
    ) {
        this.uid = uid;
        this.displayName = displayName;
        this.email = email;
        this.role = role;
        this.bio = bio;
    }
}

export default UserModel;