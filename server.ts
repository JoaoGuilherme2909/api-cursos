import fastify from "fastify";
import crypto from "node:crypto";

const server = fastify({
    logger: {
        transport: {
            target: "pino-pretty",
            options: {
                translateTime: "HH:MM:ss Z",
                ignore: 'pid,hostname',
            }
        }
    }
});

const courses = [{ id: '1', title: 'Curso de node.js' }, { id: '2', title: 'Curso de React' }, { id: '3', title: 'Curso de Python' }];

server.get('/courses', () => {
    return { "courses": courses };
});

server.get('/courses/:id', (req, res) => {
    const courseId = req.params.id;

    const course = courses.find(i => i.id === courseId);

    if (!course)
        res.status(404).send();

    return course
});

server.post('/courses', (req, res) => {
    const courseTitle = req.body?.title;

    if (!courseTitle)
        res.status(400).send({ message: "Title is required" });

    courses.push({ id: crypto.randomUUID(), title: courseTitle });
    res.status(201).send();
});

server.listen({ port: 3333 }).then(() => {
    console.log("HTTP server running");
}); 