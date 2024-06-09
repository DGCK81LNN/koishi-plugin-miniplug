import type {} from "@koishijs/plugin-notifier"
import { Context, Schema } from "koishi"
import rewriteExports from "rewrite-exports"
import { rewrite as rewriteImports } from "rewrite-imports"
import { inspect } from "util"

export const name = "miniplug"
export const inject = { optional: ["notifier"] }
export const reusable = true

export interface Config {
  code: string
}

export const Config: Schema<Config> = Schema.object({
  code: Schema.string()
    .role("codemirror", { lang: "javascript" })
    .default(
      /*js*/ `
export const name = "greet"

export function apply(ctx) {
  ctx.logger.info("Hello, World!")
}
      `.trim()
    ),
})

export function apply(ctx: Context, config: Config) {
  let expose = {
    module: {
      exports: {} as any,
    },
    require,
  }
  try {
    const pluginFunction = new Function(
      "{ " + Object.keys(expose).join(", ") + " }",
      rewriteExports(rewriteImports(config.code))
    )
    pluginFunction.call({}, expose)
    const plugin = expose.module.exports
    if (ctx.registry.resolve(plugin?.default)) ctx.plugin(plugin.default)
    else ctx.plugin(plugin)
  } catch (e) {
    ctx.logger.error(e)
    ctx.notifier?.create({
      type: "danger",
      content:
        e instanceof Error
          ? String(e)
          : "Uncaught " + inspect(e, { breakLength: Infinity }),
    })
  }
}
