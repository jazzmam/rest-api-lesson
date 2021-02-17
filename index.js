const Joi = require('joi'); // variable starts from upper case cause that is returned is class; pascal naming convention is used in js
const express = require('express');
const app = express();

app.use(express.json());

const courses = [
    { id: 1, name: 'course1'},
    { id: 2, name: 'course2'},
    { id: 3, name: 'course3'},
]

app.get('/', (req, res) => {
    res.send('lai lai asasas');
});

app.get('/api/courses', (req, res) => {
   res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
   const course = courses.find(c => c.id === parseInt(req.params.id));
   if (!course) res.status(404).send('The course does not exist');
   res.send(course);
});

app.post('/api/courses', (req, res) => {
    // using Joi we have to define a schema
    const result = validateCourse(req.body);

    if (result.error) {
        // 400 bad request
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    // validate if a course exists
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) res.status(404).send('The course does not exist');

    // validate if the request is correct
    // alternative - object distructuring 
    // const { error } = validateCourse(req.body);
    const result = validateCourse(req.body);

    // alternative - object distructuring 
    // if (error) {
    if (result.error) {
        // 400 bad request
        res.status(400).send(result.error.details[0].message);
        return;
    }

    // update course
    course.name = req.body.name;
    res.send(course);

})

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));

// validate if the request is correct
function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course, schema); 
}