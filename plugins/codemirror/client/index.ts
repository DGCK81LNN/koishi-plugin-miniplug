import { Context } from "@koishijs/client"
import type {} from "@koishijs/plugin-console"

import CodeMirror from "./components/codemirror.vue"

import "virtual:uno.css"

export default (ctx: Context) => {
  // @ts-ignore
  ctx.schema.component({
    type: "string",
    role: "codemirror",
    component: CodeMirror,
    validate: (value: unknown) => typeof value === "string",
  })
}
