import type { FastifyReply, FastifyRequest } from "fastify";
import { getAuthenticatedUserFromRequest } from "../../utils/get-authenticated-user-from-request.ts";

export async function checkUserRole(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const user = getAuthenticatedUserFromRequest(request);

  if (user.role !== "manager") {
    return reply.status(403).send();
  }
}
