'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, DollarSign, Scissors } from 'lucide-react';
import { format } from 'date-fns';

interface Appointment {
  id: string;
  start_time: string;
  end_time: string;
  status: string;
  notes?: string;
  service: {
    name: string;
    price: number;
  };
  barber: {
    name: string;
  };
  payment: Array<{
    amount: number;
    status: string;
    method: string;
  }>;
}

interface AppointmentHistoryProps {
  appointments: Appointment[];
}

const statusColors = {
  scheduled: 'default',
  completed: 'secondary',
  cancelled: 'destructive',
  no_show: 'outline',
} as const;

const statusLabels = {
  scheduled: 'Scheduled',
  completed: 'Completed',
  cancelled: 'Cancelled',
  no_show: 'No Show',
} as const;

export function AppointmentHistory({ appointments }: AppointmentHistoryProps) {
  if (appointments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Appointment History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No appointments yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Appointment History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((appointment) => {
            const payment = appointment.payment?.[0];
            const isPaid = payment?.status === 'completed';

            return (
              <div
                key={appointment.id}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="font-medium text-sm">
                        {appointment.service.name}
                      </h4>
                      <Badge
                        variant={
                          statusColors[
                            appointment.status as keyof typeof statusColors
                          ]
                        }
                        className="text-xs"
                      >
                        {
                          statusLabels[
                            appointment.status as keyof typeof statusLabels
                          ]
                        }
                      </Badge>
                      {isPaid && (
                        <Badge variant="secondary" className="text-xs">
                          Paid
                        </Badge>
                      )}
                    </div>

                    <div className="grid gap-2 text-xs text-muted-foreground mt-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 shrink-0" />
                        <span>
                          {format(
                            new Date(appointment.start_time),
                            'MMM d, yyyy'
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 shrink-0" />
                        <span>
                          {format(new Date(appointment.start_time), 'h:mm a')} -{' '}
                          {format(new Date(appointment.end_time), 'h:mm a')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Scissors className="h-3 w-3 shrink-0" />
                        <span>{appointment.barber.name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <DollarSign className="h-3 w-3" />
                      {payment
                        ? Number(payment.amount).toFixed(2)
                        : Number(appointment.service.price).toFixed(2)}
                    </div>
                    {payment && (
                      <p className="text-xs text-muted-foreground mt-1 capitalize">
                        {payment.method}
                      </p>
                    )}
                  </div>
                </div>

                {appointment.notes && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      {appointment.notes}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
