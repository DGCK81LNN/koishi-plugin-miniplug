<template>
  <schema-base>
    <template #title><slot name="title"></slot></template>
    <template #desc><slot name="desc"></slot></template>
    <template #menu><slot name="menu"></slot></template>
    <template #prefix><slot name="prefix"></slot></template>
    <template #suffix><slot name="suffix"></slot></template>
    <template #control>
      <el-button-group>
        <el-tooltip content="全选" placement="top">
          <el-button :disabled @mousedown.prevent @click="() => selectAll(view)">
            <k-icon name="select-all" />
          </el-button>
        </el-tooltip>
        <el-tooltip content="撤销" placement="top">
          <el-button :disabled @mousedown.prevent @click="() => undo(view)">
            <k-icon name="undo" />
          </el-button>
        </el-tooltip>
        <el-tooltip content="重做" placement="top">
          <el-button :disabled @mousedown.prevent @click="() => redo(view)">
            <k-icon name="redo" />
          </el-button>
        </el-tooltip>
        <el-tooltip content="减少缩进" placement="top">
          <el-button :disabled @mousedown.prevent @click="() => indentLess(view)">
            <k-icon name="indent-less" />
          </el-button>
        </el-tooltip>
        <el-tooltip content="增加缩进" placement="top">
          <el-button :disabled @mousedown.prevent @click="() => indentMore(view)">
            <k-icon name="indent-more" />
          </el-button>
        </el-tooltip>
        <el-tooltip content="自动缩进" placement="top">
          <el-button :disabled @mousedown.prevent @click="() => indentSelection(view)">
            <k-icon name="auto-indent" />
          </el-button>
        </el-tooltip>
        <el-tooltip content="查找/替换" placement="top">
          <el-button :disabled @mousedown.prevent @click="toggleFindReplace()">
            <k-icon name="find-replace" />
          </el-button>
        </el-tooltip>
      </el-button-group>
    </template>
    <div class="bottom" ref="parent"></div>
  </schema-base>
</template>
<script setup lang="ts">
import {
  indentLess,
  indentMore,
  indentSelection,
  redo,
  selectAll,
  undo,
} from "@codemirror/commands"
import { javascript } from "@codemirror/lang-javascript"
import { json } from "@codemirror/lang-json"
import { searchPanelOpen, closeSearchPanel, openSearchPanel } from "@codemirror/search"
import { Compartment, EditorState } from "@codemirror/state"
import { oneDark } from "@codemirror/theme-one-dark"
import { EditorView, ViewUpdate } from "@codemirror/view"
import { SchemaBase } from "@koishijs/client"
import { basicSetup } from "codemirror"
import { Schema } from "schemastery-vue"
import { PropType, computed, ref, watch } from "vue"
import "../icons"

const props = defineProps({
  schema: {} as PropType<Schema>,
  modelValue: {} as PropType<string>,
  disabled: {} as PropType<boolean>,
  prefix: {} as PropType<string>,
  initial: {} as PropType<{}>,
})

const config = SchemaBase.useModel()
let currentContent: string = config.value

const language = new Compartment()
const disable = new Compartment()

const languagePlugs = computed(() => {
  const lang = props.schema.meta.extra?.lang
  if (lang === "json") return json()
  return javascript()
})
const disablePlugs = computed(() => {
  if (props.disabled)
    return [EditorView.editable.of(false), EditorState.readOnly.of(true)]
  return []
})

const parent = ref<HTMLElement>()
let view: EditorView | null = null

function onUpdate(update: ViewUpdate) {
  if (update.docChanged) {
    config.value = currentContent = update.state.doc.toString()
  }
}

watch(parent, () => {
  if (!parent.value) {
    view.destroy()
    view = null
  }
  view = new EditorView({
    doc: currentContent,
    extensions: [
      basicSetup,
      language.of(languagePlugs.value),
      EditorView.lineWrapping,
      EditorView.updateListener.of(onUpdate),
      oneDark,
      disable.of(disablePlugs.value),
    ],
    parent: parent.value,
  })
})

watch(languagePlugs, plugs => {
  language.reconfigure(plugs)
})
watch(disablePlugs, plugs => {
  disable.reconfigure(plugs)
})

watch(config, value => {
  if (value === currentContent) return
  view.dispatch({
    changes: { from: 0, to: view.state.doc.length, insert: value },
  })
  currentContent = value
})

function toggleFindReplace() {
  if (searchPanelOpen(view.state)) closeSearchPanel(view)
  else openSearchPanel(view)
}
</script>
