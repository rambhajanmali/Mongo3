class ExpressError extends Error{
    constructor(status, messsage) {
        super();
        this.status = status;
        this.message = this.message;
    }
}

module.exports = ExpressError;