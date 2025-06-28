"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useState, useEffect } from "react";
import type { CarouselApi } from "@/components/ui/carousel";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface ImageCarouselProps {
  images: string[];
}

function IndexIndicator({
  images,
  current,
}: {
  images: string[] | null;
  current: number;
}) {
  if (!images || images?.length <= 1) {
    return null;
  }

  return (
    <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2">
      <div className="flex gap-2 items-center py-2 px-3 rounded-full bg-black/40">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ease-out ${
              index === current
                ? "bg-white scale-125 shadow-lg"
                : "bg-white/50 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function SingleImageFrame({ imageSrc }: { imageSrc: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative mx-auto w-full hover:cursor-pointer group">
      <div onClick={() => setOpen(true)}>
        <img
          src={imageSrc}
          width={400}
          height={300}
          alt="Single slide"
          className="object-cover w-full aspect-[4/3]"
        />
      </div>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={[{ src: imageSrc }]}
        carousel={{
          finite: true,
        }}
      />
    </div>
  );
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const totalSlides = images.length;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
      console.log(api.selectedScrollSnap());
    });
  }, [api]);

  const canScrollPrev = current > 0;
  const canScrollNext = current < totalSlides - 1;

  if (images.length <= 1) {
    return <SingleImageFrame imageSrc={images[0]} />;
  }

  const slides = images.map((src) => ({ src }));

  return (
    <div className="relative mx-auto w-full hover:cursor-pointer group">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: "start",
          loop: false,
        }}
      >
        <CarouselContent>
          {images.map((imageSrc, index) => (
            <CarouselItem key={index} className="pl-1">
              <img
                onClick={() => setOpen(true)}
                src={imageSrc}
                width={400}
                height={300}
                alt={`Slide ${index + 1}`}
                className="object-cover w-full aspect-[4/3]"
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        {canScrollPrev && (
          <CarouselPrevious className="absolute left-4 top-1/2 z-10 text-white opacity-0 transition-opacity duration-200 -translate-y-1/2 group-hover:opacity-100 hover:text-white shadow-2xl/50 bg-black/50 border-white/20 shadow-black hover:bg-black/70" />
        )}

        {canScrollNext && (
          <CarouselNext className="absolute right-4 top-1/2 z-10 text-white opacity-0 transition-opacity duration-200 -translate-y-1/2 group-hover:opacity-100 hover:text-white shadow-2xl/50 bg-black/50 border-white/20 shadow-black hover:bg-black/70" />
        )}
      </Carousel>
      <IndexIndicator images={images} current={current} />
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        carousel={{
          finite: true,
        }}
        on={{
          view: ({ index }) => {
            setCurrent(index);
            if (api) {
              api.scrollTo(index);
            }
          },
        }}
        slides={slides}
        index={current}
      />
    </div>
  );
}
