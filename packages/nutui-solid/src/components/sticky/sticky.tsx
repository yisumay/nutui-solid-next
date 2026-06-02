import { Component, JSX, ParentProps, createEffect, createMemo, mergeProps, onCleanup, onMount, splitProps } from 'solid-js'
import { createStore } from 'solid-js/store'
import { getRect } from '@/utils/get-rect'
import { getScrollParent } from '@/hooks/use-scroll-parent'

type StickyPosition = 'top' | 'bottom'

export type StickyProps = JSX.HTMLAttributes<HTMLDivElement> & Partial<{
  position: StickyPosition
  top: string | number
  bottom: string | number
  container: Element
  zIndex: string | number
  onChange: (fixed: boolean) => void
}>

const defaultProps: StickyProps = {
  position: 'top',
  top: 0,
  bottom: 0,
  container: null,
  zIndex: 99,
}

export const Sticky: Component<ParentProps<StickyProps>> = (props) => {
  let rootRef: HTMLDivElement
  let stickyRef: HTMLDivElement
  const merged = mergeProps(defaultProps, props)
  const [local, rest] = splitProps(merged, [
    'position',
    'top',
    'bottom',
    'container',
    'zIndex',
    'onChange',
    'class',
  ])

  const [store, setStore] = createStore({
    fixed: false,
    height: 0,
    width: 0,
    transform: 0,
  })

  const threshold = createMemo(() => {
    return local.position === 'top' ? Number(local.top) : Number(local.bottom)
  })

  const rootStyle = createMemo<JSX.CSSProperties | undefined>(() => {
    if (store.fixed)
      return { height: `${store.height}px` }
    return {}
  })

  const stickyStyle = createMemo<JSX.CSSProperties>(() => {
    if (!store.fixed)
      return {}
    return {
      [local.position]: `${threshold()}px`,
      height: `${store.height}px`,
      width: `${store.width}px`,
      transform: store.transform ? `translate3d(0, ${store.transform}px, 0)` : undefined,
      position: store.fixed ? 'fixed' : undefined,
      zIndex: Number(local.zIndex),
    }
  })

  const handleScroll = () => {
    const containerEle = local.container as HTMLElement
    if (!rootRef && !containerEle)
      return
    const rootRect = getRect(rootRef)
    const stCurrent = stickyRef as Element
    const stickyRect = getRect(stCurrent)
    const containerRect = getRect(containerEle)
    setStore({ height: rootRect.height })
    setStore({ width: rootRect.width })

    const getFixed = (): boolean => {
      let fixed = false
      if (local.position === 'top') {
        fixed = containerEle
          ? threshold() > rootRect.top && containerRect.bottom > 0
          : threshold() > rootRect.top
      }
      else {
        const clientHeight = document.documentElement.clientHeight
        fixed = containerEle
          ? containerRect.bottom > 0 && clientHeight - threshold() - stickyRect.height > containerRect.top
          : clientHeight - threshold() < rootRect.bottom
      }

      return fixed
    }

    const getTransform = () => {
      if (containerEle) {
        if (local.position === 'top') {
          const diff = containerRect.bottom - threshold() - stickyRect.height
          return diff < 0 ? diff : 0
        }
        else {
          const clientHeight = document.documentElement.clientHeight
          const diff = containerRect.bottom - (clientHeight - threshold())
          return diff < 0 ? diff : 0
        }
      }
      return 0
    }
    setStore({ transform: getTransform() })
    setStore({ fixed: getFixed() })
  }

  createEffect(() => {
    local?.onChange?.(store.fixed)
  })

  onMount(() => {
    handleScroll()
    const el = getScrollParent(rootRef)
    el.addEventListener('scroll', handleScroll, true)
  })

  onCleanup(() => {
    const el = getScrollParent(rootRef)
    el.removeEventListener('scroll', handleScroll)
  })

  console.log('[ local.class ] >', local.class)

  return (
    <div ref={rootRef} class="nut-sticky" style={rootStyle()} {...rest}>
      <div ref={stickyRef} class="nut-sticky__box" style={stickyStyle()}>{rest.children}</div>
    </div>
  )
}
