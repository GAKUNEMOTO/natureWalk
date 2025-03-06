"use client"

import { useState } from "react"
import { useDropzone } from "react-dropzone"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"
import { createItem } from "@/actions/natures"
import { useNatureContext } from "@/context/NatureContext"
import KenSelecter from "./ken-selecter"
import SeasonSelecter from "./season-selector"
import type { NatureFormData } from "@/types/nature"
import { formSchema, sanitizeFileName } from "@/schema/schema"
import { Leaf, Upload, Camera, MapPin, Calendar, Send, Type, FileText, CheckCircle2, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

export default function ItemForm() {
  const router = useRouter()
  const { toast } = useToast()
  const { addNatureItem } = useNatureContext()
  const [file, setFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [selectedKenTag, setSelectedKenTag] = useState<string | null>(null)
  const [selectedSeasonTag, setSelectedSeasonTag] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<NatureFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      natureImg: "",
      tags: [],
    },
  })

  const onDrop = (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0]
    setFile(selectedFile)
    setFileName(selectedFile.name)
    form.setValue("natureImg", selectedFile)

    // Create preview URL
    const objectUrl = URL.createObjectURL(selectedFile)
    setPreviewUrl(objectUrl)

    // Clean up preview URL when component unmounts
    return () => URL.revokeObjectURL(objectUrl)
  }

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  const onSelectKenTag = (value: string) => {
    setSelectedKenTag(value)
    form.setValue("tags", [value, ...form.getValues("tags").filter((tag: string) => tag !== value)])
  }

  const onSelectSeasonTag = (value: string) => {
    setSelectedSeasonTag(value)
    form.setValue("tags", [value, ...form.getValues("tags").filter((tag) => tag !== value)])
  }

  const onSubmit: SubmitHandler<NatureFormData> = async (data) => {
    console.log("Form submitted with data:", data)
    try {
      if (!file) {
        throw new Error("ファイルが選択されていません")
      }

      const sanitizedFileName = sanitizeFileName(file.name)
      const filePath = `nature_img/${Date.now()}_${sanitizedFileName}`
      const supabase = createClient()
      console.log("Uploading file:", file)
      const { error: uploadError } = await supabase.storage.from("nature").upload(filePath, file)

      if (uploadError) {
        console.error("Upload error:", uploadError)
        throw new Error(uploadError.message)
      }

      const { data: urlData } = supabase.storage.from("nature").getPublicUrl(filePath)

      if (!urlData) {
        throw new Error("Failed to get public URL")
      }

      console.log("File uploaded to:", urlData.publicUrl)

      const newItemData = {
        ...data,
        natureImg: urlData.publicUrl,
        tags: [selectedKenTag, selectedSeasonTag].filter(Boolean) as string[],
        likes: 0, 
      }

      console.log("Creating item with data:", newItemData)
      const newItem = await createItem(newItemData)

      addNatureItem({
        ...newItem,
        tags: newItem.tags ?? [],
      })
      toast({
        title: "シェアしました",
        description: "投稿一覧をご確認ください",
      })
      form.reset()
      setFile(null)
      setFileName(null)
      setSelectedKenTag(null)
      setSelectedSeasonTag(null)
      router.push("/dashboard")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "エラーが発生しました。",
        description: (error as Error).message,
      })
      console.error("Submit error:", error)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      <Card className="overflow-hidden border-0 shadow-xl">
        <div className="bg-gradient-to-r from-green-700 via-green-600 to-green-700 p-6 flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full">
            <Leaf className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-ghibli text-white">自然の風景をシェア</h1>
        </div>

        <CardContent className="p-0">
          <div
            className="bg-[url('/placeholder.svg?height=400&width=800')] bg-cover bg-center bg-no-repeat h-40 relative"
            style={{ backgroundImage: "url('/placeholder.svg?height=400&width=800')" }}
          >
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <p className="text-lg md:text-xl font-ghibli">美しい自然の瞬間を共有しましょう</p>
                <p className="text-sm mt-2 max-w-md mx-auto">
                  あなたが見つけた素晴らしい景色や季節の移り変わりを記録して、みんなと共有しましょう
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 bg-gradient-to-b from-green-50 to-white">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="bg-white rounded-xl p-4 shadow-sm border border-green-100 transition-all duration-300 hover:shadow-md group">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="bg-green-100 p-1.5 rounded-full group-hover:bg-green-200 transition-colors duration-300">
                            <Type className="h-4 w-4 text-green-700" />
                          </div>
                          <FormLabel className="text-green-800 font-ghibli text-lg">タイトル</FormLabel>
                        </div>
                        <FormControl>
                          <Input
                            placeholder="タイトル"
                            {...field}
                            className="border-2 border-green-100 rounded-lg p-3 bg-white focus:border-green-500 focus:ring-green-500 transition-all duration-300"
                          />
                        </FormControl>
                        <div className="mt-2 flex items-start gap-2">
                          <Leaf className="h-3.5 w-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                          <FormDescription className="text-amber-700 text-xs italic">最大15文字まで</FormDescription>
                        </div>
                        <FormMessage className="text-red-500 mt-2" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="bg-white rounded-xl p-4 shadow-sm border border-green-100 transition-all duration-300 hover:shadow-md group">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="bg-green-100 p-1.5 rounded-full group-hover:bg-green-200 transition-colors duration-300">
                            <FileText className="h-4 w-4 text-green-700" />
                          </div>
                          <FormLabel className="text-green-800 font-ghibli text-lg">説明</FormLabel>
                        </div>
                        <FormControl>
                          <Textarea
                            placeholder="風景の説明を入力してください"
                            {...field}
                            className="border-2 border-green-100 rounded-lg p-3 bg-white focus:border-green-500 focus:ring-green-500 transition-all duration-300 min-h-[80px] resize-none"
                          />
                        </FormControl>
                        <div className="mt-2 flex items-start gap-2">
                          <Leaf className="h-3.5 w-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                          <FormDescription className="text-amber-700 text-xs italic">最大50文字まで</FormDescription>
                        </div>
                        <FormMessage className="text-red-500 mt-2" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormItem className="bg-white rounded-xl p-4 shadow-sm border border-green-100 transition-all duration-300 hover:shadow-md group">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-green-100 p-1.5 rounded-full group-hover:bg-green-200 transition-colors duration-300">
                      <Camera className="h-4 w-4 text-green-700" />
                    </div>
                    <FormLabel className="text-green-800 font-ghibli text-lg">画像</FormLabel>
                  </div>
                  <FormControl>
                    <div
                      {...getRootProps()}
                      className={`
                        border-3 border-dashed border-green-300 rounded-xl p-6 
                        text-center cursor-pointer bg-green-50 
                        transition-all duration-300 relative
                        ${file ? "bg-green-100 border-green-500" : "hover:bg-green-100"}
                      `}
                    >
                      <input {...getInputProps()} />

                      {previewUrl ? (
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300">
                            <p className="text-white font-medium">クリックして画像を変更</p>
                          </div>
                          <img
                            src={previewUrl || "/placeholder.svg"}
                            alt="Preview"
                            className="max-h-[200px] mx-auto rounded-lg shadow-md"
                          />
                          <div className="mt-2 flex items-center justify-center gap-2 text-green-700">
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="text-sm font-medium">{fileName}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="py-8 flex flex-col items-center justify-center">
                          <div className="bg-white p-4 rounded-full mb-4 shadow-md group-hover:shadow-lg transition-all duration-300">
                            <Upload className="h-10 w-10 text-green-600" />
                          </div>
                          <p className="text-green-800 font-ghibli">
                            ここにファイルをドラッグアンドドロップするか、
                            <br />
                            クリックしてファイルを選択してください
                          </p>
                          <p className="mt-2 text-sm text-green-600">JPG, PNG, GIF形式 (最大10MB)</p>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <div className="mt-2 flex items-start gap-2">
                    <Leaf className="h-3.5 w-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <FormDescription className="text-amber-700 text-xs italic">
                      美しい自然の写真をアップロードしてください
                    </FormDescription>
                  </div>
                  <FormMessage className="text-red-500 mt-2" />
                </FormItem>

                <div className="grid md:grid-cols-2 gap-6">
                  <FormItem className="bg-white rounded-xl p-4 shadow-sm border border-green-100 transition-all duration-300 hover:shadow-md group">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-green-100 p-1.5 rounded-full group-hover:bg-green-200 transition-colors duration-300">
                        <MapPin className="h-4 w-4 text-green-700" />
                      </div>
                      <FormLabel className="text-green-800 font-ghibli text-lg">県タグ</FormLabel>
                    </div>
                    <FormControl>
                      <div className="border-2 border-green-100 rounded-lg p-3 bg-white transition-all duration-300 hover:border-green-300">
                        <KenSelecter onSelect={onSelectKenTag} />
                      </div>
                    </FormControl>
                    <div className="mt-2 flex items-start gap-2">
                      <Leaf className="h-3.5 w-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <FormDescription className="text-amber-700 text-xs italic">
                        写真が撮影された都道府県を選択してください
                      </FormDescription>
                    </div>
                    {selectedKenTag && (
                      <div className="mt-3 bg-green-100 text-green-800 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="text-sm font-medium">{selectedKenTag}</span>
                      </div>
                    )}
                  </FormItem>

                  <FormItem className="bg-white rounded-xl p-4 shadow-sm border border-green-100 transition-all duration-300 hover:shadow-md group">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-green-100 p-1.5 rounded-full group-hover:bg-green-200 transition-colors duration-300">
                        <Calendar className="h-4 w-4 text-green-700" />
                      </div>
                      <FormLabel className="text-green-800 font-ghibli text-lg">シーズンタグ</FormLabel>
                    </div>
                    <FormControl>
                      <div className="border-2 border-green-100 rounded-lg p-3 bg-white transition-all duration-300 hover:border-green-300">
                        <SeasonSelecter onSelect={onSelectSeasonTag} />
                      </div>
                    </FormControl>
                    <div className="mt-2 flex items-start gap-2">
                      <Leaf className="h-3.5 w-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <FormDescription className="text-amber-700 text-xs italic">
                        写真が撮影された季節を選択してください
                      </FormDescription>
                    </div>
                    {selectedSeasonTag && (
                      <div className="mt-3 bg-green-100 text-green-800 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span className="text-sm font-medium">{selectedSeasonTag}</span>
                      </div>
                    )}
                  </FormItem>
                </div>

                <div className="flex justify-center mt-10">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-green-600 to-green-700 text-white border-none rounded-full 
                              px-10 py-6 text-xl font-ghibli cursor-pointer transition-all duration-300 
                              hover:from-green-700 hover:to-green-800 hover:shadow-lg hover:scale-105 
                              flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                    {isSubmitting ? '送信中...' : '投稿する'}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 text-center text-sm text-green-700 font-ghibli">
        <p>自然の美しさを共有して、みんなで日本の四季を楽しみましょう</p>
      </div>
    </div>
  )
}

