const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(cors())

mongoose.set('strictQuery', true);
mongoose.connect('mongodb+srv://riju:riju@cluster0.s4hmv.mongodb.net/meetx', {
    useNewUrlParser: true
}).then(() => console.log('MongoDb is connected'))
    .catch(err => console.log(err));

const submissionSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    mobile: String,
    dob: Date,
    gender: String,
});

const Submission = mongoose.model("Submission", submissionSchema);

app.post("/submit", async (req, res) => {
    try {

        const isEmailExists = await Submission.findOne({
            $or: [
                { email: req.body.email },
            ]
        });

        if (isEmailExists) {
            return res.status(400).json({ error: "Please use other email." });
        }

        const isPhoneExists = await Submission.findOne({
            $or: [
                { mobile: req.body.mobile }
            ]
        });
        if (isPhoneExists) {
            return res.status(400).json({ error: "Please use other phone number." });
        }

        const submission = new Submission(req.body);
        await submission.save();
        res.status(201).json({ message: "Form submitted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});


app.get("/submissions", async (req, res) => {
    try {
        const submissions = await Submission.find();
        res.status(200).json(submissions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
