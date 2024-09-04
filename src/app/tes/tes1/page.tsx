// import React from "react"
// import { useForm, FormProvider } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { InputSearch } from "@/components/ui/InputSearch"

// const frameworks = [
//     { value: "next.js", label: "Next.js" },
//     { value: "sveltekit", label: "SvelteKit" },
//     { value: "nuxt.js", label: "Nuxt.js" },
//     { value: "remix", label: "Remix" },
//     { value: "astro", label: "Astro" },
// ]

// const FormPage: React.FC = () => {
//   const methods = useForm({
//     resolver: zodResolver(schema),
//     defaultValues: {
//       framework: "",
//     },
//   })

//   const onSubmit = (data: any) => {
//     console.log(data)
//   }

//   return (
//     <FormProvider {...methods}>
//       <form onSubmit={methods.handleSubmit(onSubmit)} className="p-4">
//         <h1 className="text-2xl font-bold mb-4">Select a Framework</h1>
//         <InputSearch
//           frameworks={frameworks}
//           name="framework"
//           placeholder="Search for a framework..."
//           fullWidth
//         />
//         {methods.formState.errors.framework && (
//           <p className="text-red-500">{methods.formState.errors.framework.message}</p>
//         )}
//         <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white">
//           Submit
//         </button>
//       </form>
//     </FormProvider>
//   )
// }

// export default FormPage
import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page