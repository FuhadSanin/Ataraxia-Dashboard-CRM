import React, { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form"
import { SelectDemo } from "@components/Demo/SelectDemo"
import { Card, CardContent, CardDescription } from "@components/ui/card"
import { Button } from "@components/ui/button"
import { Input } from "@components/ui/input"
import { useParams } from "react-router-dom"
import Services from "@services/services"
import { useAuth } from "@context/AuthContext"
import { useToast } from "@components/ui/use-toast"
import { useNavigate } from "react-router-dom"
import * as DialogPrimitive from "@radix-ui/react-dialog"

// Define the form schema using Zod
const FormSchema = z.object({
  assignee: z.string().min(1, "Technician is required"),
  scheduled_date: z.string().min(1, "Schedule Date is required"),
  from_time: z.string().min(1, "From Time is required"),
  to_time: z.string().min(1, "To Time is required"),
})

const TicketAddForm = ({ technicians, id, title, closeModal }) => {
  const navigate = useNavigate()
  const { authToken } = useAuth()
  const { toast } = useToast()
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      assignee: "",
      scheduled_date: "",
      from_time: "",
      to_time: "",
    },
  })

  const onSubmit = data => {
    try {
      Services.assignTech(authToken, id, data)
        .then(response => {
          console.log(response)
          toast({
            title: "Technician assigned",
            description: "Technician has been assigned to the ticket",
            variant: "success",
          })
          closeModal()
        })
        .catch(error => {
          console.log(error)
          toast({
            title: "Error",
            description: "Failed to assign technician",
            variant: "destructive",
          })
        })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="assignee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Technician</FormLabel>
              <SelectDemo
                label="Select Technician"
                width={80}
                options={technicians}
                value={field.value}
                onChange={field.onChange}
              />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="scheduled_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Schedule Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormLabel>Scheduled Time</FormLabel>
        <div className="flex w-full justify-between">
          <FormField
            control={form.control}
            name="from_time"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="time" {...field} placeholder="From Time" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="to_time"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-4 pt-5">
          <DialogPrimitive.Close className="w-full">
            <Button variant="secondary" className="w-full" type="button">
              Cancel
            </Button>
          </DialogPrimitive.Close>
          <Button className="w-1/2" type="submit" variant="blue">
            {title} Technician
          </Button>
        </div>
      </form>
    </Form>
  )
}

const ModalAssign = ({ id: propId, title }) => {
  const { id: routeId } = useParams()
  const { authToken } = useAuth()
  const [ticket, setTicket] = useState(null)
  const [technicians, setTechnicians] = useState([])
  const [open, setOpen] = useState(false) // State to control dialog visibility

  const id = propId || routeId
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await Services.getTicketsById(authToken, id)
        setTicket(response.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchTicket()
  }, [authToken, id])

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        Services.getUsers(authToken, 1).then(response => {
          const transformedData = response.data.results.map(item => ({
            value: item.uuid,
            label: item.name,
          }))
          setTechnicians(transformedData)
        })
      } catch (error) {
        console.log(error)
      }
    }
    fetchTechnicians()
  }, [authToken])

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button variant="blue" className="h-8">
            {title || "Assign Technician"}
          </Button>
        </DialogTrigger>
        <DialogContent className="flex flex-col">
          <DialogHeader>
            <DialogTitle className="mb-3 text-md">
              {title} Technician
            </DialogTitle>
            <Card className="dark:bg-background ">
              <CardContent className="flex  items-center p-0">
                <div className="flex flex-col ">
                  <h6 className="font-bold text-left">
                    {ticket?.customer_name}
                  </h6>
                  <ul className="list-none flex text-sm  space-x-3">
                    <li className="flex items-center text-gray-500">
                      <span className="text-blue-500  mr-1">&#9679;</span>
                      {ticket?.customer_id}
                    </li>
                    <li className="flex items-center text-gray-500">
                      <span className="text-blue-500 mr-1">&#9679;</span>
                      {ticket?.ticket_id}
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            {title === "Reassign" && (
              <Card className="dark:bg-background ">
                <CardContent className="flex  items-center p-0">
                  <h6 className="text-sm font-medium">Customer Details</h6>
                </CardContent>
                <hr className="mt-3 mb-3" />
                <CardContent className="flex  items-center p-0">
                  <table className="w-full">
                    <tbody>
                      <tr className="flex justify-between items-center">
                        <CardDescription>Technician Name</CardDescription>
                        <td className="text-right font-medium">
                          {ticket?.assigned_technician_name}
                        </td>
                      </tr>
                      <tr>
                        <CardDescription>Scheduled Date</CardDescription>
                        <td className="text-right">{ticket?.scheduled_date}</td>
                      </tr>
                      <tr>
                        <CardDescription>Scheduled Time</CardDescription>
                        <td className="text-right"> {ticket?.from_time}</td>
                      </tr>
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            )}

            <div className="pt-5">
              <TicketAddForm
                technicians={technicians}
                id={id}
                title={title}
                closeModal={() => setOpen(false)} // Pass the function to close the dialog
              />
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ModalAssign
