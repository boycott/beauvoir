"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { SessionWithLink } from "@/lib/sessions";

export default function SessionsTable({ sessions }: { sessions: SessionWithLink[] }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto p-6 lg:p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-balance text-3xl font-semibold tracking-tight lg:text-4xl">Sessions</h1>
          </div>
        </div>
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Starts</TableHead>
                <TableHead>Ends</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map(session => (
                <TableRow key={session.id} className="cursor-pointer">
                  <TableCell>{ new Date(session.start_time).toLocaleString("en-GB") }</TableCell>
                  <TableCell>{ new Date(session.end_time).toLocaleString("en-GB") }</TableCell>
                  <TableCell>{ session.attendance }</TableCell>
                  <TableCell>£{ session.cost.toFixed(2) }</TableCell>
                  <TableCell>{ (session.paid && session.cost ? session.cost : 'N/A') }</TableCell>
                  <TableCell>{ (session.paid || !session.cost ? <a href={ `https://meetings.recipe4.life/meeting/${session.custom_participant_id}` }>Go to session</a> : <a href={ `/payment/${session.id}` }>Pay now</a>) }</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}