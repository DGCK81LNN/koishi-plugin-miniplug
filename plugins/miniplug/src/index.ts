import type {} from "@koishijs/plugin-notifier"
import { Context, Schema } from "koishi"
import { inspect } from "util"
import esmToCjs from "@dgck81lnn/esm-to-cjs"

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
  const exports = {} as any
  let expose = {
    module: {
      exports,
    },
    exports,
    require,
  }
  try {
    const pluginFunction = new Function(
      "{ " + Object.keys(expose).join(", ") + " }",
      esmToCjs(config.code)
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
