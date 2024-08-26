import React from 'react'
interface LabelProps {
    label?: string
}

const Label = (props: LabelProps) => {
  return (
    <div className='text-lg text-primary mb-3 font-semibold'>{props.label}</div>
  )
}

export default Label