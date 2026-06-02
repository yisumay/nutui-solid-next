import { Component, JSX, ParentProps, createEffect, createMemo, mergeProps, onCleanup, onMount, splitProps } from 'solid-js'

export type OverlayProps = JSX.HTMLAttributes<HTMLDivElement> & Partial<{
  zIndex: number
  duration: number
  closeOnOverlayClick: boolean
  visible: boolean
  lockScroll: boolean | 'strict'
  afterShow: () => void
  afterClose: () => void
}>

export const defaultOverlayProps = {
  zIndex: 1000,
  duration: 300,
  closeOnOverlayClick: true,
  visible: false,
  lockScroll: true,
} as OverlayProps
