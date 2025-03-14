import { Component, JSX, ParentProps, Show, createMemo, mergeProps, splitProps } from 'solid-js'
import { ArrowRight } from '@nutui/icons-solid'
import { pxCheck } from '@/utils/pxCheck'

export type CellSize = 'normal' | 'large'

export type CellProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, 'title'> & Partial<{
  title: JSX.Element
  subTitle: JSX.Element
  desc: JSX.Element
  icon: JSX.Element
  descTextAlign: string
  isLink: boolean
  roundRadius: string | number
  center: boolean
  size: CellSize
  /**
   * @deprecated It will be removed in next major version.
   */
  replace: boolean
  /**
   * @deprecated It will be removed in next major version.
   */
  url: string
  link: JSX.Element
}>

const defaultProps: CellProps = {
  title: '',
  subTitle: '',
  desc: '',
  descTextAlign: 'right',
  isLink: false,
  roundRadius: '',
  center: false,
  size: 'normal',
  replace: false,
  url: '',
}

export const Cell: Component<ParentProps<CellProps>> = (props) => {
  const merged = mergeProps(defaultProps, props)
  const [local, rest] = splitProps(merged, [
    'title',
    'subTitle',
    'desc',
    'icon',
    'descTextAlign',
    'isLink',
    'roundRadius',
    'center',
    'size',
    'replace',
    'url',
    'replace',
    'link',
    'onClick',
    'children',
  ])

  const classes = createMemo(() => {
    const prefixCls = 'nut-cell'
    return {
      [prefixCls]: true,
      [`${prefixCls}--clickable`]: local.isLink,
      [`${prefixCls}--center`]: local.center,
      [`${prefixCls}--large`]: local.size === 'large',
    }
  })

  const baseStyle = createMemo(() => {
    if (local.roundRadius) {
      return {
        'border-radius': pxCheck(local.roundRadius),
      } as JSX.CSSProperties
    }
  })

  const descStyle = createMemo(() => {
    return {
      'text-align': local.descTextAlign,
    } as JSX.CSSProperties
  })

  const descClasses = createMemo(() => {
    return {
      'nut-cell__value': true,
      'nut-cell__value--alone': !local.title && !local.subTitle,
    }
  })

  const handleClick: JSX.EventHandlerUnion<HTMLDivElement, MouseEvent> = (e) => {
    if (typeof local?.onClick === 'function') {
      local.onClick(e)
    }
    if (props.url)
      props.replace ? location.replace(props.url) : (location.href = props.url)
  }

  return (
    <div classList={classes()} style={baseStyle()} {...rest} onClick={handleClick}>
      {local?.children
        ? local?.children
        : (
            <>
              <Show when={local.icon}>
                <div class="nut-cell__icon">
                  {local.icon}
                </div>
              </Show>
              <Show when={local.title || local.subTitle}>
                <div class="nut-cell__title">
                  <div class="title">{local.title}</div>
                  <Show when={local.subTitle}>
                    <div class="nut-cell__title-desc">{ local.subTitle}</div>
                  </Show>
                </div>
              </Show>
              <Show when={local.desc}>
                <div classList={descClasses()} style={descStyle()}>{local.desc}</div>
              </Show>
              {
                local?.link
                ?? (
                  <Show when={local.isLink || local.url}>
                    <ArrowRight class="nut-cell__link" />
                  </Show>
                )
              }
            </>
          )}
    </div>
  )
}
