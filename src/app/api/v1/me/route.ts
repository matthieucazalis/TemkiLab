import { apiError, apiJson, withUser } from "@/lib/api";
import { serializeUser } from "@/lib/api-serializers";
import { getUserById } from "@/services/user.service";

export const GET = withUser(async ({ userId }) => {
  const user = await getUserById(userId);
  if (!user) return apiError(404, "not_found", "Resource not found.");
  return apiJson(serializeUser({ ...user, avatar: user.avatar ?? null }));
});
