import React from "react"
import { useMediaQuery } from "react-responsive"
import { PieChart } from "@mui/x-charts/PieChart"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table"
import { Card, CardContent, CardTitle } from "@components/ui/card"
import { Smallcards } from "@components/Demo/CardsDashboard"
import { Smallcolorcards } from "@components/Demo/CardsColorDashboard"
import { DatePickerDemo } from "@components/ui/datepicker"
import { useAuth } from "@context/AuthContext"
import { useQuery } from "@tanstack/react-query"
import Services from "@services/services"
import { CallType, LocationMap } from "@constants/constants"

// Card Colors Images
import green from "@assets/Cards/green.png"
import red from "@assets/Cards/red.png"
import violet from "@assets/Cards/violet.png"
import orange from "@assets/Cards/orange.png"

const Dashboard = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 })
  const { authToken } = useAuth()

  const {
    data: tickets,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tickets", authToken],
    queryFn: async () => {
      const response = await Services.getTickets(authToken)
      return response.data.results
    },
  })

  const {
    data: userSummary,
    isLoading: isLoadingUserSummary,
    isError: isErrorUserSummary,
  } = useQuery({
    queryKey: ["userSummary", authToken],
    queryFn: async () => {
      const response = await Services.getUsersSummary(authToken)
      return response.data
    },
  })

  // const {
  //   data: ticketSummary,
  //   isLoading: isLoadingTicketSummary,
  //   isError: isErrorTicketSummary,
  // } = useQuery({
  //   queryKey: ["ticketSummary", authToken],
  //   queryFn: async () => {
  //     const response = await Services.getTicketsSummary(authToken)
  //     return response.data
  //   },
  // })

  // console.log(ticketSummary)

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-4">
        <h1 className="text-2xl font-bold mb-4">Overview</h1>
        {!isMobile && (
          <div className="flex flex-wrap items-center gap-2">
            <DatePickerDemo placeholder="From Date" />
            <span className="text-gray-600">To</span>
            <DatePickerDemo placeholder="To Date" />
          </div>
        )}
      </div>
      <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-4">
        <div>
          {isLoadingUserSummary ? (
            <div>Loading...</div>
          ) : isErrorUserSummary ? (
            <div>Error loading user summary</div>
          ) : (
            <Card>
              <CardTitle>Total Users</CardTitle>
              <div className="flex flex-wrap md:flex-nowrap justify-center gap-4">
                <Smallcolorcards
                  cardcolor={green}
                  title="Technicians"
                  value={userSummary["Technician"]}
                />
                <Smallcolorcards
                  cardcolor={violet}
                  title="CCOs"
                  value={userSummary["Customer Care Officer"]}
                />
                <Smallcolorcards
                  cardcolor={red}
                  title="CCAs"
                  value={userSummary["Customer Care Agent"]}
                />
                <Smallcolorcards
                  cardcolor={orange}
                  title="ASMs"
                  value={userSummary["Area Service Manager"]}
                />
              </div>
            </Card>
          )}

          {!isMobile && (
            <div className="flex gap-4 mt-4">
              <Smallcards />
              <Smallcards />
              <Smallcards />
              <Smallcards />
            </div>
          )}
        </div>
        {!isMobile && (
          <Card className="flex flex-col flex-grow justify-center">
            <CardTitle>Ticket Status</CardTitle>
            <CardContent>
              <PieChart
                series={[
                  {
                    data: [
                      { id: 0, value: 10, label: "series A" },
                      { id: 1, value: 15, label: "series B" },
                      { id: 2, value: 20, label: "series C" },
                    ],
                    highlightScope: { faded: "global", highlighted: "item" },
                    faded: {
                      innerRadius: 30,
                      additionalRadius: -30,
                      color: "gray",
                    },
                  },
                ]}
                height={200}
              />
            </CardContent>
          </Card>
        )}
      </div>
      <Card>
        <CardTitle>New Tickets</CardTitle>
        <CardContent className="p-0">
          {isLoading ? (
            <div>Loading...</div>
          ) : isError ? (
            <div>Error loading tickets</div>
          ) : !isMobile ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Product Type</TableHead>
                  <TableHead>Call Type</TableHead>
                  <TableHead>Created On</TableHead>
                  <TableHead>Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map(ticket => (
                  <TableRow key={ticket.ticket_id}>
                    <TableCell>{ticket.ticket_id}</TableCell>
                    <TableCell>{ticket.customer_name}</TableCell>
                    <TableCell>{ticket.product_name}</TableCell>
                    <TableCell>{CallType[ticket.call_type]}</TableCell>
                    <TableCell>{ticket.created_at?.slice(0, 10)}</TableCell>
                    <TableCell>{LocationMap[ticket.location]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard
