import { test, expect } from "vitest";
import request from "supertest";
import { server } from "../app.ts";
import { makeCourse } from "../tests/factories/make-course.ts";
import { makeAutheticatedUser } from "../tests/factories/make-user.ts";

test("Get course by id", async () => {
  await server.ready();

  const { token } = await makeAutheticatedUser("student");

  const course = await makeCourse();

  const response = await request(server.server)
    .get(`/courses/${course.id}`)
    .set("Authorization", token);

  expect(response.status).toEqual(200);
  expect(response.body).toEqual({
    course: {
      id: expect.any(String),
      title: expect.any(String),
      description: null,
    },
  });
});

test("return 404 for non existing courses", async () => {
  await server.ready();

  const { token } = await makeAutheticatedUser("student");

  const response = await request(server.server)
    .get(`/courses/43008bc9-07dc-4c19-bc36-02e2327ed75a`)
    .set("Authorization", token);

  expect(response.status).toEqual(404);
});
