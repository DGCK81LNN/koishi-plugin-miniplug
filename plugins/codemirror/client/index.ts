import { Context } from "@koishijs/client"
import type {} from "@koishijs/plugin-console"

import CodeMirror from "./components/codemirror.vue"

import "virtual:uno.css"

export default (ctx: Context) => {
  ctx.schema({
    type: "string",
    role: "codemirror",
    component: CodeMirror,
    validate: (value: unknown) => typeof value === "string",
  })
}
