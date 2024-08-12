// models/testCaseModel.js
const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    platform: { type: String, required: true },
    domain: { type: String, required: true },
    steps: [String],
    expectedResult: String,
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('TestCase', testCaseSchema);
