import { createFileBackedCmsEngine, CMS_ROLES } from "./global-content";

export type CmsActor = {
  userId: string;
  role: string;
};

const engine = createFileBackedCmsEngine();

export function getCmsEngine() {
  return engine;
}

export function actorFromRequest(request: Request): CmsActor {
  const role = (request.headers.get("x-cms-role") || "read_only").toLowerCase();
  if (!CMS_ROLES.includes(role)) {
    throw new Error(`Unsupported CMS role ${role}`);
  }

  return {
    userId: request.headers.get("x-cms-user") || "anonymous",
    role,
  };
}
