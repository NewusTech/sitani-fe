import { Input } from '@/components/ui/input'
import React from 'react'
import SearchIcon from '../../../../public/icons/SearchIcon'
import { Button } from '@/components/ui/button'
import UnduhIcon from '../../../../public/icons/UnduhIcon'
import PrintIcon from '../../../../public/icons/PrintIcon'
import FilterIcon from '../../../../public/icons/FilterIcon'

const KepegawaianPage = () => {
  return (
    <div title='Kepegawaian' className=''>
      <div className="header flex justify-between items-center">
        <div className="search w-[50%]">
          <Input
            type="text"
            placeholder="Cari"
            rightIcon={<SearchIcon />}
            className='border-primary'
          />
        </div>
        <div className="btn flex gap-3">
          <Button variant={"outlinePrimary"} className='flex gap-3 items-center text-primary'>
            <UnduhIcon />
            Download
          </Button>
          <Button variant={"outlinePrimary"} className='flex gap-3 items-center text-primary'>
            <PrintIcon />
            Print
          </Button>
        </div>
      </div>
      <div className="date mt-3 gap-2 flex justify-start items-center">
        <div className="">
          <Input
            type='date'
            className='w-fit'
          />
        </div>
        <div className="">to</div>
        <div className="">
          <Input
            type='date'
            className='w-fit'
          />
        </div>
        <div className=" w-[50px] h-[50px]">
          <Button variant="outlinePrimary" className='w-full h-full'>
            <FilterIcon />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default KepegawaianPage