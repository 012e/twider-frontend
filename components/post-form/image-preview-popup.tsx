"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ZoomIn, ZoomOut, RotateCw } from "lucide-react"

interface ImagePreviewPopupProps {
  imageUrl?: string;
  isOpen: boolean;
  onClose: () => void;
  imageIndex?: number;
  totalImages?: number;
}

export default function ImagePreviewPopup({
  imageUrl,
  isOpen,
  onClose,
  imageIndex,
  totalImages
}: ImagePreviewPopupProps) {
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5))
  }

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const handleReset = () => {
    setZoom(1)
    setRotation(0)
  }

  const handleClose = () => {
    setZoom(1)
    setRotation(0)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && imageUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/90"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-background rounded-3xl shadow-2xl overflow-hidden w-[80vw] h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 right-0 z-10 bg-background/95 backdrop-blur-md border-b">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleZoomOut}
                    disabled={zoom <= 0.5}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ZoomOut className="w-5 h-5" />
                  </button>

                  <div className="bg-secondary px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-secondary-foreground">{Math.round(zoom * 100)}%</span>
                  </div>

                  <button
                    onClick={handleZoomIn}
                    disabled={zoom >= 3}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ZoomIn className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleRotate}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                  >
                    <RotateCw className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-full text-sm font-medium transition-colors"
                  >
                    Reset
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleClose}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center h-full overflow-y-auto">
              <motion.div
                animate={{
                  scale: zoom,
                  rotate: rotation,
                }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="relative max-w-full max-h-full"
              >
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                />
              </motion.div>
            </div>

            {(typeof imageIndex !== 'undefined' && typeof totalImages !== 'undefined') && (
              <div className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t p-4">
                <div className="text-center">
                  <p className="text-foreground font-medium">
                    Image {imageIndex + 1} of {totalImages}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Use controls to zoom, rotate, or download • Press ESC or click outside to close
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
