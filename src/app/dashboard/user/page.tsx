'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Download, FileText, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function UserDashboard() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<any[]>([])
  const [invoices, setInvoices] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchOrders()
      fetchInvoices()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/orders/my-orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders)
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/invoices/my-invoices', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setInvoices(data.invoices)
      }
    } catch (error) {
      console.error('Failed to fetch invoices:', error)
    }
  }

  const handleExtendRental = async (orderId: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/orders/${orderId}/extend`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ days: 7 }),
      })

      if (response.ok) {
        toast.success('Rental extended successfully')
        fetchOrders()
      } else {
        toast.error('Failed to extend rental')
      }
    } catch (error) {
      toast.error('Failed to extend rental')
    }
  }

  const handleDownloadInvoice = async (invoiceId: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/invoices/${invoiceId}/download`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        // Create blob from response
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `invoice-${Date.now()}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        toast.success('Invoice downloaded successfully')
      } else {
        toast.error('Failed to download invoice')
      }
    } catch (error) {
      toast.error('Failed to download invoice')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-blue-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <Tabs defaultValue="rentals" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="rentals">
          <Calendar className="h-4 w-4 mr-2" />
          Active Rentals
        </TabsTrigger>
        <TabsTrigger value="history">
          <FileText className="h-4 w-4 mr-2" />
          Rental History
        </TabsTrigger>
        <TabsTrigger value="profile">
          <FileText className="h-4 w-4 mr-2" />
          Profile
        </TabsTrigger>
      </TabsList>

      {/* Active Rentals */}
      <TabsContent value="rentals" className="space-y-4">
        <div className="grid gap-4">
          {orders.filter((o) => o.status === 'ACTIVE' || o.status === 'CONFIRMED').length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No active rentals found
              </CardContent>
            </Card>
          ) : (
            orders.filter((o) => o.status === 'ACTIVE' || o.status === 'CONFIRMED').map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>Order {order.orderNumber}</CardTitle>
                      <CardDescription>
                        {new Date(order.startDate).toLocaleDateString()} - {new Date(order.endDate).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        {order.status}
                      </div>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-2">Items:</p>
                      {order.rentalItems.map((item: any) => (
                        <div key={item.id} className="text-sm text-muted-foreground">
                          - {item.name} x {item.quantity}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t">
                      <div>
                        <p className="font-semibold">Total: Rp {order.totalAmount.toLocaleString('id-ID')}</p>
                        <p className="text-sm text-muted-foreground">Payment: {order.paymentMethod}</p>
                      </div>
                      <Button onClick={() => handleExtendRental(order.id)}>
                        Extend Rental
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </TabsContent>

      {/* Profile */}
      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <p className="text-sm font-medium">Full Name</p>
              <p className="text-sm text-muted-foreground">{user?.fullName}</p>
            </div>
            <div className="grid gap-2">
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <div className="grid gap-2">
              <p className="text-sm font-medium">WhatsApp</p>
              <p className="text-sm text-muted-foreground">{user?.whatsapp}</p>
            </div>
            {user?.baliAddress && (
              <div className="grid gap-2">
                <p className="text-sm font-medium">Bali Address</p>
                <p className="text-sm text-muted-foreground">{user?.baliAddress}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
