import React from 'react'

interface LayoutProps {
  name: string;
}

const Layout = (props: LayoutProps) => {
  return (
    <div>{props.name}</div>
  )
}

export default Layout