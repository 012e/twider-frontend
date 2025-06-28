"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Image from "next/image"
import { useState, useEffect } from "react"
import type { CarouselApi } from "@/components/ui/carousel"

export default function Component() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const totalSlides = 5

  useEffect(() => {
    if (!api) {
      return
    }

    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  const canScrollPrev = current > 0
  const canScrollNext = current < totalSlides - 1

  return (
    <div className="w-full max-w-md mx-auto relative group">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: "start",
          loop: false,
        }}
      >
        <CarouselContent>
          {Array.from({ length: totalSlides }).map((_, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="relative p-0">
                    <Image
                      src="/placeholder.svg"
                      width={400}
                      height={300}
                      alt={`Slide ${index + 1}`}
                      className="aspect-[4/3] object-cover rounded-lg w-full"
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation buttons - only show when navigation is possible */}
        {canScrollPrev && (
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 border-white/20 text-white hover:bg-black/70 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        )}

        {canScrollNext && (
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 border-white/20 text-white hover:bg-black/70 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        )}
      </Carousel>

      {/* Fixed dot indicators at bottom of carousel */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
        <div className="flex items-center gap-2 bg-black/40 px-3 py-2 rounded-full">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ease-out ${
                index === current ? "bg-white scale-125 shadow-lg" : "bg-white/50 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
