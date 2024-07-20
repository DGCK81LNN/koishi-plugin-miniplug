import { Context, Schema } from "koishi"
import {} from "@koishijs/plugin-console"
import { resolve } from "path"

export const name = "codemirror"
export const inject = ["console"]
export const filter = false

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  ctx.console.addEntry({
    dev: resolve(__dirname, "../client/index.ts"),
    prod: resolve(__dirname, "../dist"),
  })
}
