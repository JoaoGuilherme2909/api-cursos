import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../database/client.ts";
import { courses } from "../database/schema.ts";

export const createCourseRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/courses",
    {
      schema: {
        tags: ["courses"],
        summary: "Create a course",
        body: z.object({
          title: z.string().min(5, "Title needs at least 5 characters"),
        }),
        response: {
          201: z
            .object({ courseId: z.uuid() })
            .describe("Course creation succeded"),
          400: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const courseTitle = request.body.title;

      if (!courseTitle)
        return reply.status(400).send({ message: "Title is required" });

      const result = await db
        .insert(courses)
        .values({ title: courseTitle })
        .returning();

      return reply.status(201).send({ courseId: result[0].id });
    }
  );
};
