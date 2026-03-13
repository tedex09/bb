'use client';

import { Client } from '@/app/actions/clients';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, Calendar, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

interface ClientListProps {
  clients: Client[];
}

export function ClientList({ clients }: ClientListProps) {
  const router = useRouter();

  if (clients.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">No clients found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {clients.map((client) => (
        <Card
          key={client.id}
          className="cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => router.push(`/clients/${client.id}`)}
        >
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base truncate">
                    {client.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Badge variant="secondary" className="text-xs">
                      {client.visit_count} visits
                    </Badge>
                    {client.total_spent > 0 && (
                      <Badge variant="outline" className="text-xs">
                        ${Number(client.total_spent).toFixed(2)}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                {client.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4 shrink-0" />
                    <span className="truncate">{client.phone}</span>
                  </div>
                )}
                {client.email && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4 shrink-0" />
                    <span className="truncate">{client.email}</span>
                  </div>
                )}
                {client.last_visit && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4 shrink-0" />
                    <span className="truncate">
                      Last visit: {format(new Date(client.last_visit), 'MMM d, yyyy')}
                    </span>
                  </div>
                )}
              </div>

              {client.notes && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {client.notes}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
