import { router } from '../trpc'
import { healthRouter } from './health'
import { userRouter } from './user'

export const appRouter = router({ health: healthRouter, user: userRouter })
export type AppRouter = typeof appRouter
