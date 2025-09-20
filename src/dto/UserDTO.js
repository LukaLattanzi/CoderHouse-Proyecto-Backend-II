export class UserDTO {
    constructor(user) {
        this.id = user._id;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.email = user.email;
        this.age = user.age;
        this.role = user.role;
        this.cart = user.cart;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
    }

    static create(user) {
        return new UserDTO(user);
    }

    static createArray(users) {
        return users.map(user => new UserDTO(user));
    }
}

export class UserCurrentDTO {
    constructor(user) {
        this.id = user._id;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.email = user.email;
        this.role = user.role;
        this.cart = user.cart?._id || user.cart;
    }

    static create(user) {
        return new UserCurrentDTO(user);
    }
}

export class UserProfileDTO {
    constructor(user) {
        this.id = user._id;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.email = user.email;
        this.age = user.age;
        this.role = user.role;
        this.createdAt = user.createdAt;
    }

    static create(user) {
        return new UserProfileDTO(user);
    }
}