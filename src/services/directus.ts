import type { ServicesContext } from "../types";

export async function getDirectusServices(
  context: any
): Promise<ServicesContext> {
  const { services, getSchema, database } = context;
  const schema = await getSchema();
  const { UsersService, RolesService } = services;
  const accountability = { admin: true };

  const usersService = new UsersService({
    schema,
    accountability,
  });
  const rolesService = new RolesService({
    schema,
    accountability,
  });

  return { usersService, rolesService, database };
}
