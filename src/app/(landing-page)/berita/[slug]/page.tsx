type DetailPageProps = {
    params: {
        slug: string
    }
}
const page = (props: DetailPageProps) => {
  return (
    <div>ini slug <br />
        {props.params.slug}
    </div>
  )
}

export default page