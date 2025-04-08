"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { certificateVerifySchema, type CertificateVerifyFormValues } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Search } from "lucide-react"

export function CertificateVerifyForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<CertificateVerifyFormValues>({
    resolver: zodResolver(certificateVerifySchema),
    defaultValues: {
      certificateId: "",
    },
  })

  const onSubmit = (values: CertificateVerifyFormValues) => {
    setIsLoading(true)
    router.push(`/certificates/verify/${values.certificateId}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify Certificate</CardTitle>
        <CardDescription>Enter a certificate ID to verify its authenticity</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <FormField
              control={form.control}
              name="certificateId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certificate ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter certificate ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              <Search className="mr-2 h-4 w-4" />
              Verify Certificate
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}

