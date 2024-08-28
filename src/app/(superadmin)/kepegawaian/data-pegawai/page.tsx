import { Input } from '@/components/ui/input'
import React from 'react'
import { Button } from '@/components/ui/button'
import UnduhIcon from '../../../../../public/icons/UnduhIcon'
import PrintIcon from '../../../../../public/icons/PrintIcon'
import SearchIcon from '../../../../../public/icons/SearchIcon'
import FilterIcon from '../../../../../public/icons/FilterIcon'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


const DataPegawaiPage = () => {
  return (
    <div title='Kepegawaian' className=''>
      {/* title */}
      <div className="text-2xl mb-5 font-semibold text-primary uppercase">Kepegawaian</div>
      {/* title */}
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
      {/* table */}
      <div className="table mt-5 w-full">
        <Table>
          <TableHeader className='bg-primary-600'>
            <TableRow className='text-primary'>
              <TableHead className='text-primary'>Invoice</TableHead>
              <TableHead className='text-primary'>Status</TableHead>
              <TableHead className='text-primary'>Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">INV001</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell className="text-right">$250.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">INV001</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell className="text-right">$250.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      {/* table */}
    </div>
  )
}

export default DataPegawaiPage