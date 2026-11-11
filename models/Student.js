const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: Number,
    isActive: Boolean,
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
        },
});

module.exports = mongoose.model('Student', studentSchema);