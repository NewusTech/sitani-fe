import LayoutLanding from "@/components/landing-page/LayoutLanding"
import BerandaPage from "./(landing-page)/beranda/page"

export default function Home() {
  return (
    <div>
      <LayoutLanding>
        <BerandaPage />
      </LayoutLanding>
    </div>
  )
}
