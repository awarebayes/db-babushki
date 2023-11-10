import { Prisma, PrismaClient } from "@prisma/client";

const WRITE_METHODS = [
  "create",
  "update",
  "upsert",
  "delete",
  "createMany",
  "updateMany",
  "deleteMany",
] as const;

const ReadonlyClient = Prisma.defineExtension({
  name: "ReadonlyClient",
  model: {
    $allModels: Object.fromEntries(
      WRITE_METHODS.map((method) => [
        method,
        function(args: never) {
          throw new Error(
            `Calling the \`${method}\` method on a readonly client is not allowed`
          );
        },
      ])
    ) as {
        [K in typeof WRITE_METHODS[number]]: (
          args: `Calling the \`${K}\` method on a readonly client is not allowed`
        ) => never;
      },
  },
});


export function get_prisma(): PrismaClient {
  if (process.env.DB__READONLY) {

    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: 'postgres://postgres:postgres@db-replica/public',
        },
      },
    });
    const readonlyPrisma = prisma.$extends(ReadonlyClient);
    return readonlyPrisma as unknown as PrismaClient;
  }

  const prisma = new PrismaClient();
  return prisma;
}
