import { z } from 'zod'

import { t } from '../trpc'

export const helloProcedure = t.procedure
  .input(
    z
      .object({
        text: z.string().nullish(),
      })
      .nullish()
  )
  .query(({ input, ctx: { session } }) => {
    return {
      greeting: `hello ${input?.text ?? 'world'}`,
      session: session,
    }
  })
