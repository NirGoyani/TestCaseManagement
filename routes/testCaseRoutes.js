// routes/testCaseRoutes.js
const express = require('express');
const TestCase = require('../models/testCaseModel');
const multer = require('multer');    
const xlsx = require('xlsx');          

const router = express.Router();

const app = express();
app.use(express.json());


// Configure Multer to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Create a test case
router.post('/', async (req, res) => {
    try {
        const testCase = new TestCase(req.body);
        await testCase.save();
        res.status(201).send(testCase);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Read all test cases
router.get('/', async (req, res) => {
    try {
        const testCases = await TestCase.find();
        res.status(200).send(testCases);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Read a specific test case
router.get('/:id', async (req, res) => {
    try {
        const testCase = await TestCase.findById(req.params.id);
        if (!testCase) {
            return res.status(404).send({ message: 'Test case not found' });
        }
        res.status(200).send(testCase);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Find test cases by domain name
router.post('/findByDomain', async (req, res) => {
    const { domain } = req.body;
    try {
        const testCases = await TestCase.find({ domain: domain });
        if (testCases.length === 0) {
            return res.status(404).send({ message: 'No test cases found for the specified domain' });
        }
        res.status(200).send(testCases);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Find test cases by platform
router.post('/findByPlatform', async (req, res) => {
    const { platform } = req.body;
    try {
        const testCases = await TestCase.find({ platform: platform });
        if (testCases.length === 0) {
            return res.status(404).send({ message: 'No test cases found for the specified platform' });
        }
        res.status(200).send(testCases);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update a test case by ID
router.put('/:id', async (req, res) => {
    try {
        const testCase = await TestCase.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!testCase) {
            return res.status(404).send({ message: 'Test case not found' });
        }
        res.status(200).send(testCase);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete a test case
router.delete('/:id', async (req, res) => {
    try {
        const testCase = await TestCase.findByIdAndDelete(req.params.id);
        if (!testCase) {
            return res.status(404).send({ message: 'Test case not found' });
        }
        res.status(200).send({ message: 'Test case deleted successfully' });
    } catch (error) {
        res.status(500).send(error);
    }
});

// API to handle Excel file upload and insert data into the database
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        // Read the uploaded file
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const testCases = xlsx.utils.sheet_to_json(worksheet);

        // Insert the data into the database
        await TestCase.insertMany(testCases);

        res.status(200).send({ message: 'Test cases uploaded and stored successfully!' });
    } catch (error) {
        res.status(500).send({ message: 'Failed to upload and store test cases', error: error.message });
    }
});



module.exports = router;
