import { Button, Sticky } from 'nutui-solid'

function Bottom() {
  return (
    <>
      <div style={{ height: '100vh' }} />
      <Sticky bottom={50} position="bottom">
        <Button type="primary">Bottom 50px</Button>
      </Sticky>
      <div style={{ height: '100vh' }} />
    </>

  )
}

export default Bottom
