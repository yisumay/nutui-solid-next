import { Component, JSX, ParentProps, createEffect, createMemo, mergeProps, onCleanup, onMount, splitProps } from 'solid-js'
import { createStore } from 'solid-js/store'
import { usePageScroll } from '@tarojs/taro'
import { getTaroRect } from '@/utils/get-taro-rect'

export type StickyProps = JSX.HTMLAttributes<HTMLDivElement> & Partial<{
  top: string | number
  scrollTop: string | number
  zIndex: string | number
  onChange: (fixed: boolean) => void
}>

const defaultProps: StickyProps = {
  top: 0,
  scrollTop: -1,
  zIndex: 99,
}

export const Sticky: Component<ParentProps<StickyProps>> = (props) => {
  let rootRef: HTMLDivElement
  let stickyRef: HTMLDivElement
  const merged = mergeProps(defaultProps, props)
  const [local, rest] = splitProps(merged, [
    'top',
    'scrollTop',
    'zIndex',
    'onChange',
  ])

  const [store, setStore] = createStore({
    fixed: false,
    height: 0,
    width: 0,
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
      top: `${props.top}px`,
      height: `${store.height}px`,
      width: `${store.width}px`,
      position: store.fixed ? 'fixed' : undefined,
      zIndex: Number(local.zIndex),
    }
  })

  const handleScroll = (top: number | string) => {
    getTaroRect(rootRef).then(
      (rootRect: any) => {
        setStore({ height: rootRect.height, width: rootRect.width, fixed: Number(top) >= rootRect.top })
      },
      () => {},
    )
  }

  createEffect(() => {
    local?.onChange?.(store.fixed)
  })

  createEffect(() => {
    if (props.scrollTop === -1) {
      usePageScroll(() => handleScroll(props.top))
    }
    else {
      handleScroll(props.top)
    }
  })

  onMount(() => {
    handleScroll(props.top)
  })

  onCleanup(() => {
    handleScroll(props.top)
  })

  return (
    <div ref={rootRef} class="nut-sticky" style={rootStyle()}>
      <div ref={stickyRef} class="nut-sticky__box" style={stickyStyle()}>{rest.children}</div>
    </div>
  )
}
