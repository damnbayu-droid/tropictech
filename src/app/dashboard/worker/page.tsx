'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Header from '@/components/header/Header'
import Footer from '@/components/landing/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, CheckCircle, Camera, Package } from 'lucide-react'
import { toast } from 'sonner'

export default function WorkerDashboard() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [assignedOrders, setAssignedOrders] = useState<any[]>([])
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [deliveryPhotos, setDeliveryPhotos] = useState<File[]>([])
  const [stockUpdates, setStockUpdates] = useState<Record<string, number>>({})

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
    if (user) {
      fetchAssignedOrders()
    }
  }, [user])

  const fetchAssignedOrders = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/orders/worker-orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setAssignedOrders(data.orders)
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    }
  }

  const handleConfirmDelivery = async () => {
    if (!selectedOrder) return

    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('orderId', selectedOrder.id)
      formData.append('confirmed', 'true')
      deliveryPhotos.forEach((photo) => {
        formData.append('photos', photo)
      })

      const response = await fetch('/api/orders/confirm-delivery', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (response.ok) {
        toast.success('Delivery confirmed successfully')
        setSelectedOrder(null)
        setDeliveryPhotos([])
        fetchAssignedOrders()
      } else {
        toast.error('Failed to confirm delivery')
      }
    } catch (error) {
      toast.error('Failed to confirm delivery')
    }
  }

  const handleUpdateStock = async (productId: string) => {
    const quantity = stockUpdates[productId]
    if (!quantity) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/products/${productId}/stock`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      })

      if (response.ok) {
        toast.success('Stock updated successfully')
        setStockUpdates({ ...stockUpdates, [productId]: 0 })
      } else {
        toast.error('Failed to update stock')
      }
    } catch (error) {
      toast.error('Failed to update stock')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Worker Dashboard</h1>
            <p className="text-muted-foreground">Job Schedule & Delivery Reports</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Assigned Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Job Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {assignedOrders.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No assigned orders</p>
                ) : (
                  assignedOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold">{order.orderNumber}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.startDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge
                          variant={order.deliveryConfirmed ? 'default' : 'secondary'}
                        >
                          {order.deliveryConfirmed ? 'Delivered' : 'Pending'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {order.deliveryAddress || 'Address not specified'}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Delivery Report */}
            {selectedOrder && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Delivery Report
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Order Details</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedOrder.orderNumber}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedOrder.startDate).toLocaleDateString()} -{' '}
                      {new Date(selectedOrder.endDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Rental Checklist</h4>
                    <div className="space-y-2">
                      {selectedOrder.rentalItems.map((item: any) => (
                        <div key={item.id} className="flex items-center gap-2">
                          <Checkbox
                            id={`item-${item.id}`}
                            disabled={selectedOrder.deliveryConfirmed}
                          />
                          <Label
                            htmlFor={`item-${item.id}`}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <Package className="h-4 w-4" />
                            <span>
                              {item.name} x {item.quantity}
                            </span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Delivery Photos</h4>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) =>
                        setDeliveryPhotos(
                          Array.from(e.target.files || [])
                        )
                      }
                      disabled={selectedOrder.deliveryConfirmed}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {deliveryPhotos.length} photo(s) selected
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Confirm Address</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedOrder.deliveryAddress || 'Address not specified'}
                    </p>
                  </div>

                  <Button
                    onClick={handleConfirmDelivery}
                    disabled={selectedOrder.deliveryConfirmed || deliveryPhotos.length === 0}
                    className="w-full"
                  >
                    {selectedOrder.deliveryConfirmed ? 'Delivery Confirmed' : 'Confirm Delivery'}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Stock Updates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Update Stock Count
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="stock-standing-desk">Standing Desk</Label>
                    <div className="flex gap-2">
                      <Input
                        id="stock-standing-desk"
                        type="number"
                        placeholder="New count"
                        value={stockUpdates['standing-desk'] || ''}
                        onChange={(e) =>
                          setStockUpdates({
                            ...stockUpdates,
                            'standing-desk': parseInt(e.target.value) || 0,
                          })
                        }
                      />
                      <Button
                        onClick={() => handleUpdateStock('standing-desk')}
                        size="sm"
                      >
                        Update
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock-monitor">Monitor</Label>
                    <div className="flex gap-2">
                      <Input
                        id="stock-monitor"
                        type="number"
                        placeholder="New count"
                        value={stockUpdates['monitor'] || ''}
                        onChange={(e) =>
                          setStockUpdates({
                            ...stockUpdates,
                            monitor: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                      <Button
                        onClick={() => handleUpdateStock('monitor')}
                        size="sm"
                      >
                        Update
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock-chair">Chair</Label>
                    <div className="flex gap-2">
                      <Input
                        id="stock-chair"
                        type="number"
                        placeholder="New count"
                        value={stockUpdates['chair'] || ''}
                        onChange={(e) =>
                          setStockUpdates({
                            ...stockUpdates,
                            chair: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                      <Button
                        onClick={() => handleUpdateStock('chair')}
                        size="sm"
                      >
                        Update
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
