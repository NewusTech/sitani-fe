import React from 'react'
interface LabelProps {
  label?: string
  className?: string
}

const Label = (props: LabelProps) => {
  return (
    <div className={`text-lg text-primary mb- font-semibold ${props.className}`}>{props.label}</div>
  )
}

export default Label