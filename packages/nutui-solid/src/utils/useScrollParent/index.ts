import { onMount } from "solid-js"

type ScrollElement = HTMLElement | Window

const overflowScrollReg = /scroll|auto|overlay/i
const defaultRoot = window

function isElement(node: Element) {
  const ELEMENT_NODE_TYPE = 1
  return node.tagName !== 'HTML' && node.tagName !== 'BODY' && node.nodeType === ELEMENT_NODE_TYPE
}

export function getScrollParent(el: Element, root: ScrollElement | undefined = defaultRoot) {
  let node = el

  while (node && node !== root && isElement(node)) {
    const { overflowY } = window.getComputedStyle(node)
    if (overflowScrollReg.test(overflowY)) {
      return node
    }
    node = node.parentNode as Element
  }

  return root
}

export function useScrollParent(el: Element | undefined, root: ScrollElement | undefined = defaultRoot) {
  let scrollParent: Element | Window

  onMount(() => {
    if (el) {
      scrollParent = getScrollParent(el, root)
    }
  })

  return scrollParent
}
