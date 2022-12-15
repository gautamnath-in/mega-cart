class customError extends Error{

    constructor(message, code) {
        super(message); //super-> represents a parent class
        this.code = code;
    }

}

export default customError;