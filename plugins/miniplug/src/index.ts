import type {} from "@koishijs/plugin-notifier"
import { Context, Schema } from "koishi"
import { inspect } from "util"
import jsYaml from "js-yaml"
import esmToCjs from "@dgck81lnn/esm-to-cjs"

export const name = "miniplug"
export const inject = { optional: ["notifier"] }
export const reusable = true

export interface Config {
  code: string
  config: string
}

export const Config: Schema<Config> = Schema.object({
  code: Schema.string()
    .role("codemirror", { lang: "javascript" })
    .default(
      /*js*/ `
export const name = "greet"

export function apply(ctx, config) {
  ctx.logger.info("Hello, World!")
}
        `.trim()
    ),
  config: Schema.string().role("codemirror", { lang: "yaml" }).description("YAML"),
})

export function apply(ctx: Context, config: Config) {
  function loadConfig() {
    return jsYaml.load(config.config)
  }

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
    const mod = expose.module.exports
    const plugin = ctx.registry.resolve(mod?.default) ? mod.default : mod
    ctx.plugin(plugin, loadConfig())
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
