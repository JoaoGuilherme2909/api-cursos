import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../database/client.ts";
import { z } from "zod";
import { courses } from "../database/schema.ts";
import { eq } from "drizzle-orm";
import { checkRequestJWT } from "./hooks/check-request-jwt.ts";

export const getCourseByIdRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/courses/:id",
    {
      preHandler: [checkRequestJWT],
      schema: {
        tags: ["courses"],
        summary: "Get course by id",
        params: z.object({
          id: z.uuid(),
        }),
        response: {
          200: z.object({
            course: z.object({
              id: z.uuid(),
              title: z.string(),
              description: z.string().nullable(),
            }),
          }),
          404: z.null(),
        },
      },
    },
    async (request, reply) => {
      const courseId = request.params.id;

      const result = await db
        .select()
        .from(courses)
        .where(eq(courses.id, courseId));

      if (result.length > 0) return reply.send({ course: result[0] });

      return reply.status(404).send();
    },
  );
};
