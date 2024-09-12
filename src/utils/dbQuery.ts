import { Client } from "@libsql/client";
import { ZodTypeAny, z } from "zod";

type dbResults<T extends ZodTypeAny> =
  | {
      success: true;
      data: z.infer<T>[];
    }
  | {
      success: false;
      error: unknown;
    };

export async function dbQuery<T extends ZodTypeAny>(
  query: string,
  schema: T,
  db: Client
): Promise<dbResults<T>> {
  try {
    const data = await db.execute(query);
    const validation = schema.array().safeParse(data.rows);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error,
      };
    }
    return {
      success: true,
      data: validation.data as z.infer<T>,
    };
  } catch (e) {
    return {
      success: false,
      error: e,
    };
  }
}
