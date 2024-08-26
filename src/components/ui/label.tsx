import React from 'react'
interface LabelProps {
    label?: string
}

const Label = (props: LabelProps) => {
  return (
    <div className='text-sm text-[#828487]'>{props.label}</div>
  )
}

export default Label