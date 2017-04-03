
var Message = function Message({ _id, name, createdAt, message }) {
    this.id = _id;
    this.name = name;
    this.createdAt = new Date(createdAt);
    this.message = message;
};