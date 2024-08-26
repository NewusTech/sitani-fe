import React from 'react'
interface LayoutProps {
    children: React.ReactNode
}

const layout = (props: LayoutProps) => {
  return (
    <div>
        <h1>Layout</h1>
        {props.children}
    </div>
  )
}

export default layout