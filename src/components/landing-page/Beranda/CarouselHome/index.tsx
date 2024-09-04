import * as React from "react"
import Autoplay from "embla-carousel-autoplay"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image"

export function CarouselHome() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  )

  const images = [
    "https://plus.unsplash.com/premium_photo-1661854008793-8ce54b2e622b?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1716524875766-fdebfb275fd3?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1664299124175-e2c793325bfa?q=80&w=1401&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://biroadpim.lampungprov.go.id/berkas/uploads/CqgGhOQhTrse06LbRLlcXKyBzjglU2xNdavYWbLl.jpg",
  ]

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full h-full overflow-hidden"
    // onMouseEnter={plugin.current.stop}
    // onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {images.map((src, index) => (
          <CarouselItem key={index}>
            <div className="">
              <Card>
                <CardContent className="flex items-center justify-center p-0">
                  <Image
                    src={src}
                    alt={`Carousel image ${index + 1}`}
                    width={800}
                    height={600}
                    objectFit="cover"
                    objectPosition="center"
                    unoptimized
                    className="w-full h-full object-cover"
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
