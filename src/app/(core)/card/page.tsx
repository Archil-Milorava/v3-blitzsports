'use client'
import React, { useState, useCallback } from 'react'
import NextImage from 'next/image'
import localFont from 'next/font/local'
import Cropper from 'react-easy-crop'
import { Area, Point } from 'react-easy-crop'

const mtavruli = localFont({
  src: [
    { path: '../../../../public/fonts/nino_mtavruli_normal.ttf', weight: '400', style: 'normal' },
    { path: '../../../../public/fonts/nino_mtavruli_bold.otf', weight: '700', style: 'normal' },
  ],
  variable: '--mtavruli',
  display: 'swap',
})


const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })

const getCroppedImg = async (imageSrc: string, crop: Area): Promise<string | null> => {
  const image = await loadImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  canvas.width = crop.width
  canvas.height = crop.height
  ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height)

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) return resolve(null)
      resolve(URL.createObjectURL(blob))
    }, 'image/png')
  })
}

const toBase64 = (src: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const c = document.createElement('canvas')
      c.width = img.naturalWidth
      c.height = img.naturalHeight
      c.getContext('2d')!.drawImage(img, 0, 0)
      resolve(c.toDataURL('image/png'))
    }
    img.onerror = reject
    img.src = src
  })


const CARD_W = 720 
const CARD_H = 900 


const Page = () => {
  const [uploadedImg, setUploadedImg] = useState<string | null>(null)
  const [selectedFrame, setSelectedFrame] = useState<string | null>(null) 
  const [selectedFrameSrc, setSelectedFrameSrc] = useState<string | null>(null) 
  const [caption, setCaption] = useState<string>('')
  const [textColor, setTextColor] = useState<string>('#000000')
  const [isBold, setIsBold] = useState<boolean>(false)
  const [fontSize, setFontSize] = useState<number>(40) 

  // crop
  const [isCropping, setIsCropping] = useState(false)
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState<number>(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadedImg(URL.createObjectURL(file))
    setIsCropping(true)
  }

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels)
  }, [])

  const applyCrop = async () => {
    if (!uploadedImg || !croppedAreaPixels) return
    const cropped = await getCroppedImg(uploadedImg, croppedAreaPixels)
    setUploadedImg(cropped)
    setIsCropping(false)
  }

  const handleFrameSelect = async (src: string) => {
    setSelectedFrameSrc(src)
    setSelectedFrame(await toBase64(src))
  }

  const exportImage = async () => {
    if (!uploadedImg) return

    const canvas = document.createElement('canvas')
    canvas.width = CARD_W
    canvas.height = CARD_H
    const ctx = canvas.getContext('2d')!

    const photo = await loadImage(uploadedImg)
    const scale = Math.max(CARD_W / photo.width, CARD_H / photo.height)
    const sw = CARD_W / scale
    const sh = CARD_H / scale
    const sx = (photo.width - sw) / 2
    const sy = (photo.height - sh) / 2
    ctx.drawImage(photo, sx, sy, sw, sh, 0, 0, CARD_W, CARD_H)

    if (selectedFrame) {
      const frame = await loadImage(selectedFrame)
      ctx.drawImage(frame, 0, 0, CARD_W, CARD_H)
    }

    if (caption.trim()) {
      const fontFamily = 'Nino Mtavruli, sans-serif'
      const weight = isBold ? 'bold' : 'normal'
      ctx.font = `${weight} ${fontSize}px ${fontFamily}`
      ctx.fillStyle = textColor
      ctx.textAlign = 'center'
      ctx.textBaseline = 'bottom'

      ctx.shadowColor = 'rgba(0,0,0,0.25)'
      ctx.shadowBlur = 6
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 2

      const maxWidth = CARD_W - 80
      const lineHeight = fontSize * 1.25
      const words = caption.split(' ')
      const lines: string[] = []
      let current = ''

      for (const word of words) {
        const test = current ? `${current} ${word}` : word
        if (ctx.measureText(test).width > maxWidth && current) {
          lines.push(current)
          current = word
        } else {
          current = test
        }
      }
      if (current) lines.push(current)

      const totalHeight = lines.length * lineHeight
      let y = CARD_H - 56 - totalHeight + lineHeight

      for (const line of lines) {
        ctx.fillText(line, CARD_W / 2, y)
        y += lineHeight
      }
    }

    const link = document.createElement('a')
    link.download = 'card.png'
    link.href = canvas.toDataURL('image/png', 1.0)
    link.click()
  }

  const frames = [
    '/frames/frame-1.png',
    '/frames/frame-2.png',
    '/frames/frame-3.png',
    '/frames/frame-4.png',
    '/frames/frame-5.png',
    '/frames/frame-6.png',
    '/frames/frame-7.png',
    '/frames/frame-8.png',
  ]

  const presetColors = ['#DCF303', '#67206E', '#FFFFFF', '#000000']

  const previewFontSize = fontSize / 2

  const fontSizeOptions = [
    { label: 'XS', value: 24 },
    { label: 'Small', value: 32 },
    { label: 'Medium', value: 40 },
    { label: 'Large', value: 48 },
    { label: 'XL', value: 56 },
    { label: 'XXL', value: 64 },
    { label: 'XXXL', value: 72 },
  ]

  return (
    <div className="flex flex-col overflow-hidden md:max-h-screen md:flex-row">
      {/* Left Panel — frames */}
      <div className="flex gap-3 overflow-y-scroll bg-gradient-to-br from-[#F4FCFB] via-[#EEF4FA] to-[#ECEAFB] py-4 md:w-[20%] md:flex-col md:items-center md:py-4">
        {frames.map((src, i) => (
          <NextImage
            key={i}
            src={src}
            alt={`Frame ${i + 1}`}
            width={100}
            height={100}
            onClick={() => handleFrameSelect(src)}
            className={`cursor-pointer rounded border-2 transition ${
              selectedFrameSrc === src ? 'scale-110 border-green-500' : 'border-transparent'
            } hover:border-gray-400`}
          />
        ))}
      </div>

      {/* Middle — preview */}
      <div className="flex w-full items-center justify-center p-4 md:w-[40%]">
        <div
          id="preview"
          className={`relative aspect-[4/5] w-[360px] overflow-hidden rounded ${mtavruli.className}`}
        >
          {uploadedImg ? (
            <>
              <img
                src={uploadedImg}
                alt="Uploaded"
                className="absolute inset-0 h-full w-full object-cover"
              />
              {selectedFrame && (
                <img
                  src={selectedFrame}
                  alt="Frame"
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                />
              )}
              {caption && (
                <p
                  className="absolute bottom-7 z-10 w-full px-4 text-center break-words"
                  style={{
                    color: textColor,
                    fontWeight: isBold ? 'bold' : 'normal',
                    fontSize: `${previewFontSize}px`,
                    lineHeight: 1.25,
                    textShadow: '0 1px 3px rgba(0,0,0,0.25)',
                  }}
                >
                  {caption}
                </p>
              )}
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-sm text-gray-500">
              Upload an image to start editing
            </div>
          )}
        </div>
      </div>

      {/* Right Panel — controls */}
      <div className="flex w-full flex-col gap-4 overflow-y-auto bg-gradient-to-br from-[#EDF5F8] to-[#DDEAF8] p-4 shadow-xl md:w-[45%]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
            id="upload"
          />
          <label
            htmlFor="upload"
            className="cursor-pointer rounded-lg bg-gradient-to-r from-emerald-400 to-teal-500 px-5 py-3 text-sm font-medium text-white transition-all hover:shadow-md"
          >
            Upload Image
          </label>

          {uploadedImg && (
            <button
              onClick={exportImage}
              className="rounded-lg bg-gradient-to-r from-indigo-400 to-purple-500 px-5 py-3 text-sm font-medium text-white transition-all hover:shadow-md"
            >
              Export Final Image
            </button>
          )}
        </div>

        <textarea
          placeholder="Write your caption here..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="h-28 w-full resize-none rounded-lg border border-gray-300 bg-white/80 p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-300"
        />

        <div className="flex flex-col gap-6">
          {/* Color picker */}
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="h-10 w-10 cursor-pointer rounded border border-gray-300"
            />
            {presetColors.map((color) => (
              <button
                key={color}
                onClick={() => setTextColor(color)}
                style={{ backgroundColor: color }}
                className={`h-8 w-8 rounded-full border-2 transition-all hover:scale-105 ${
                  textColor === color ? 'border-gray-800' : 'border-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Bold + font size */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setIsBold((p) => !p)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                isBold
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {isBold ? 'Bold ✓' : 'Bold'}
            </button>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium whitespace-nowrap">Font Size</label>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="rounded-lg border border-gray-300 bg-white/80 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-300"
              >
                {fontSizeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Crop Modal */}
      {isCropping && uploadedImg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="relative flex w-[90vw] max-w-lg flex-col gap-4 rounded-xl bg-white p-4">
            <div className="relative h-80 w-full bg-black">
              <Cropper
                image={uploadedImg}
                crop={crop}
                zoom={zoom}
                aspect={4 / 5}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="mt-3 flex justify-between">
              <button
                onClick={() => setIsCropping(false)}
                className="rounded-lg bg-gray-300 px-4 py-2 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={applyCrop}
                className="rounded-lg bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-600"
              >
                Apply Crop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Page
