import React from 'react'

interface HelperErrorProps {
    children ?: React.ReactNode
    ClassName ?: string
}

const HelperError = (props: HelperErrorProps) => {
  return (
    <p className={`mt-1 text-sm text-red-600 ${props.ClassName}`}>{props.children}</p>
  )
}

export default HelperError