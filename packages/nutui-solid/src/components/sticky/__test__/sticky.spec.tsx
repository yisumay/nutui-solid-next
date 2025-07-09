import { test, expect } from "vitest"
import { render } from "@solidjs/testing-library"
import { Sticky } from 'nutui-solid'
import { mockScrollTop } from "@/utils/unit"

Object.defineProperty(window.HTMLElement.prototype, 'clientHeight', {
  value: 667
})

function mockStickyRect(wrapper: HTMLElement, rect: Partial<DOMRect>) {
  const mocked = vi.spyOn(wrapper, 'getBoundingClientRect').mockReturnValue(rect as DOMRect)

  return () => mocked.mockRestore()
}


test('should sticky to top after scroll', async () => {
  const { container } = render(() =>  <Sticky />)
  const restore = mockStickyRect(container, {
    top: -100,
    bottom: -90
  })

  await mockScrollTop(1000)
  expect(container.children[0]).toMatchSnapshot()

  restore()
})

test('should sticky to bottom after scroll', async () => {
   const { container } = render(() =>  <Sticky />)
  const restore = mockStickyRect(container, {
    top: 667,
    bottom: 690
  })

  await mockScrollTop(0)
  expect(container.children[0]).toMatchSnapshot()

  restore()
})