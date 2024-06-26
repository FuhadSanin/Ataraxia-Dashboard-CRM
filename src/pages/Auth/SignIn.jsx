import React, { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form"
import { Input } from "@components/ui/input"
import Services from "@services/services"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@context/AuthContext"
import { useToast } from "@components/ui/use-toast"

// Define the form schema using Zod
const FormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(2),
})

export function SignIn() {
  const { toast } = useToast()
  const { setAuthToken, authToken, setUserProfile } = useAuth()
  const navigate = useNavigate()

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = data => {
    if (data.email && data.password) {
      Services.signIn(data)
        .then(response => {
          setAuthToken(response.data) // Store token in context
          toast({
            title: "Success! You are now signed in.",
            description: "You have successfully signed in.",
            variant: "success",
          })
          navigate("/")
        })
        .catch(error => {
          toast({
            title: "Uh oh! Something went wrong.",
            description: `${error.message}`,
            variant: "destructive",
          })
          console.error("Error signing in:", error)
        })
    }
  }

  useEffect(() => {
    if (authToken) {
      try {
        Services.getProfile(authToken).then(response => {
          setUserProfile(response.data)
        })
      } catch (error) {
        console.error("Error getting profile:", error)
      }
    }
  }, [authToken])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" type="email" {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription className="text-right text-blue-500 cursor-pointer">
                <Link to="/forget-password">Forgot Password?</Link>
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="blue">
          Login
        </Button>
      </form>
    </Form>
  )
}

export default SignIn
