import React, { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CardDescription, CardTitle } from "@components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import ModalAssign from "./ModalAssign"
import { useParams } from "react-router-dom"
import Services from "@services/services"
import { useAuth } from "@context/AuthContext"

const TicketView = () => {
  const { id } = useParams()
  const { authToken } = useAuth()
  const [customer, setCustomer] = useState([])
  const [product, setProduct] = useState([])
  const Demotickets = [
    {
      ticketId: "TKT-2024-001",
      customerName: "Hari Menon",
      productType: "Air Conditioner",
      callType: "Installation",
      createdOn: "Jun 5, 2024",
      location: "Ernakulam",
      status: "Pending",
      customerId: "CUST-1001",
    },
    {
      ticketId: "TKT-2024-002",
      customerName: "Om Shree",
      productType: "Refrigerator",
      callType: "Repair",
      createdOn: "Jun 5, 2024",
      location: "Kochi",
      status: "Completed",
      customerId: "CUST-1002",
    },
  ]

  useEffect(() => {
    Services.getTickets(authToken)
      .then(response => {
        const ticket = response.data.results.find(ticket => ticket.uuid === id)
        if (ticket) {
          Services.getCustomersById(authToken, ticket.customer)
            .then(response => {
              setCustomer(response.data)
            })
            .catch(error => {
              console.error("Error fetching customer:", error)
            })

          Services.getProductsById(authToken, ticket.product)
            .then(response => {
              setProduct(response.data)
            })
            .catch(error => {
              console.error("Error fetching product:", error)
            })
        } else {
          console.log("Ticket not found")
        }
      })
      .catch(error => {
        console.error("Error fetching tickets:", error)
      })
  }, [id])
  console.log("customer", customer, "product", product)

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">View Ticket</h1>
      </div>
      {/* Ticket Details */}
      <Card className="mb-5">
        <CardContent className="flex justify-between items-center">
          <div className="flex flex-col">
            <h6 className="font-bold ">{customer.name || "Name"}</h6>
            <div className="flex flex-wrap items-center mt-2">
              <ul className="list-none flex flex-wrap mb-0 md:space-x-3 space-x-0">
                <li className="flex items-center text-gray-500">
                  <span className="text-blue-500 mr-1">&#9679;</span>
                  ACI-14275
                </li>
                <li className="flex items-center text-gray-500">
                  <span className="text-blue-500 mr-1">&#9679;</span>
                  T-14275
                </li>
              </ul>
            </div>
          </div>
          <div className="w-full md:w-auto mt-4 md:mt-0">
            <div className="flex justify-end">
              <ModalAssign />
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Customer Details */}
      <div className="flex flex-wrap md:flex-nowrap gap-5 mb-5">
        <Card className="w-full md:w-1/2">
          <CardContent className="flex justify-between items-center">
            <h6 className="font-bold">Customer Details</h6>
            <Button variant="blue" className="h-7">
              Edit
            </Button>
          </CardContent>
          <hr />
          <CardContent className="mt-2">
            {customer && (
              <table className="w-full">
                <tbody>
                  <tr>
                    <CardDescription>Address</CardDescription>
                    <td className="text-right">{customer.address || "N/A"}</td>
                  </tr>
                  <tr>
                    <CardDescription>PIN Code</CardDescription>
                    <td className="text-right">{customer.pinCode || "N/A"}</td>
                  </tr>
                  <tr>
                    <CardDescription>Street</CardDescription>
                    <td className="text-right">{customer.address || "N/A"}</td>
                  </tr>
                  <tr>
                    <CardDescription>Location</CardDescription>
                    <td className="text-right">{customer.location || "N/A"}</td>
                  </tr>
                  <tr>
                    <CardDescription>Landmark</CardDescription>
                    <td className="text-right">{customer.landmark || "N/A"}</td>
                  </tr>
                  <tr>
                    <CardDescription>Country</CardDescription>
                    <td className="text-right">{customer.state || "N/A"}</td>
                  </tr>
                  <tr>
                    <CardDescription>Contact Information 1</CardDescription>
                    <td className="text-right">
                      {customer.phone_number || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <CardDescription>Contact Information 2</CardDescription>
                    <td className="text-right">
                      {customer.secondary_contact_number || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <CardDescription>Email Address</CardDescription>
                    <td className="text-right">{customer.email || "N/A"}</td>
                  </tr>
                  <tr>
                    <CardDescription>Dealer’s name</CardDescription>
                    <td className="text-right">{customer.dealer || "N/A"}</td>
                  </tr>
                  <tr>
                    <CardDescription>Created On</CardDescription>
                    <td className="text-right">
                      {customer.created_at || "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
        {/* Product Details */}
        <Card className="w-full md:w-1/2">
          <CardContent className="flex justify-between items-center">
            <h6 className="font-bold">Product Details</h6>
            <Button variant="blue" className="h-7">
              Edit
            </Button>
          </CardContent>
          <hr />
          <CardContent className="mt-2">
            {product && (
              <table className="w-full">
                <tbody>
                  <tr>
                    <CardDescription>Product name</CardDescription>
                    <td className="text-right">{product.name || "N/A"}</td>
                  </tr>
                  <tr>
                    <CardDescription>Brand name</CardDescription>
                    <td className="text-right">{product.brand || "N/A"}</td>
                  </tr>
                  <tr>
                    <CardDescription>Model number</CardDescription>
                    <td className="text-right">
                      {product.model_number || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <CardDescription>Customer remarks</CardDescription>
                    <td className="text-right">
                      {customer.customer_remark || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <CardDescription>Call type</CardDescription>
                    <td className="text-right">
                      {customer.call_type || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <CardDescription>Service type</CardDescription>
                    <td className="text-right">
                      {customer.serviceType || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <CardDescription>Warranty flag</CardDescription>
                    <td className="text-right">
                      {customer.warrantyFlag || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <CardDescription>Customer Demand</CardDescription>
                    <td className="text-right">{customer.demand || "N/A"}</td>
                  </tr>
                  <tr>
                    <CardDescription>Service Requested By</CardDescription>
                    <td className="text-right">
                      {customer.serviceRequestedBy || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <CardDescription>Appointment date</CardDescription>
                    <td className="text-right">
                      {customer.appointmentDate || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <CardDescription>Appointment Time</CardDescription>
                    <td className="text-right">
                      {customer.appointmentTime || "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
      {/* Service History */}
      <Card className="mb-5">
        <CardTitle> Service History</CardTitle>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Ticket ID</TableCell>
                <TableCell>Customer Name</TableCell>
                <TableCell>Product Type</TableCell>
                <TableCell>Call Type</TableCell>
                <TableCell>Created On</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Demotickets.map((ticket, index) => (
                <TableRow key={index}>
                  <TableCell>{ticket.ticketId}</TableCell>
                  <TableCell>{ticket.customerName}</TableCell>
                  <TableCell>{ticket.productType}</TableCell>
                  <TableCell>{ticket.callType}</TableCell>
                  <TableCell>{ticket.createdOn}</TableCell>
                  <TableCell>{ticket.location}</TableCell>
                  {ticket.status === "Pending" ? (
                    <TableCell>
                      <Button variant="pending">{ticket.status}</Button>
                    </TableCell>
                  ) : (
                    <TableCell>
                      <Button variant="success">{ticket.status}</Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default TicketView