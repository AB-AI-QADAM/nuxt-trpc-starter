import { createSelectSchema } from 'drizzle-zod'
import { protectedProcedure, router } from '../trpc'
import { user } from '../../database/schema'

// Proves drizzle-zod resolves and types correctly against the existing
// Better Auth `user` table (server/database/schema.ts).
export const userSelectSchema = createSelectSchema(user)

// Better Auth's session `ctx.user` shape (see @better-auth/core's
// `userSchema` in `packages/@better-auth/core/src/db/schema/user.ts`) types
// `image` as `z.string().nullish()` — nullable AND optional. `createSelectSchema`
// on the Drizzle `user` table types `image` as `.nullable()` only, because the
// column is merely nullable, not absent-able — it reflects "column may be null",
// not "field may be missing from the object". If `ctx.user.image` is `undefined`
// (a real possibility for Better Auth sessions), validating the FULL
// `userSelectSchema` as `.output()` would throw at runtime and 500 real
// requests. The remaining fields (id, name, email, emailVerified, createdAt,
// updatedAt) match exactly in both shape and nullability, so `.output()` is
// wired against a `.pick()` of just those fields instead of the full schema.
const meOutputSchema = userSelectSchema.pick({
  id: true,
  name: true,
  email: true,
  emailVerified: true,
  createdAt: true,
  updatedAt: true
})

export const userRouter = router({
  me: protectedProcedure.output(meOutputSchema).query(({ ctx }) => ctx.user)
})
