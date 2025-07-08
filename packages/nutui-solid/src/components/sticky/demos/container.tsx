import { Button, Sticky } from 'nutui-solid'

function Container() {
  let container: HTMLDivElement
  return (
    <>
      <div ref={container} style={{ height: '200px', background: 'pink' }}>
        <Sticky top={57} container={container}>
          <div style={{ 'display': 'flex', 'justify-content': 'flex-end' }}>
            <Button type="info">Button</Button>
          </div>

        </Sticky>
      </div>
    </>

  )
}

export default Container
