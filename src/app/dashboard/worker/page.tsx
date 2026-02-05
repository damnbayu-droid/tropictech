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
import {
  Calendar,
  MapPin,
  CheckCircle,
  Camera,
  Package,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Home,
  LogOut,
  ChevronRight,
  Plus
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function WorkerDashboard() {
  const { user, isLoading, isAuthenticated, logout } = useAuth()
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
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-8 px-4 mt-16">
        <div className="container mx-auto">
          {/* Top Bar with Back to Home */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="space-y-1">
              <h1 className="text-4xl font-black tracking-tight text-primary">WORKER DASHBOARD</h1>
              <div className="flex items-center gap-2 text-muted-foreground font-medium">
                <Badge variant="outline" className="rounded-full px-4 border-primary/20 bg-primary/5 text-primary">ACTIVE SESSION</Badge>
                <span>•</span>
                <span className="text-sm">Welcome back, {user?.fullName || 'Worker'}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="rounded-full font-bold gap-2" onClick={() => router.push('/')}>
                <Home className="h-4 w-4" /> BACK TO HOME
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full text-destructive" onClick={() => logout()}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-6">
            {/* Left Column: Stats & Schedule */}
            <div className="lg:col-span-8 space-y-6">
              {/* Worker Stats Quick View */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="border-none shadow-sm bg-gradient-to-br from-blue-500/10 to-transparent">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Completed Jobs</p>
                        <p className="text-3xl font-black">24</p>
                      </div>
                      <div className="p-2 bg-blue-500/10 rounded-xl">
                        <CheckCircle2 className="h-5 w-5 text-blue-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-gradient-to-br from-orange-500/10 to-transparent">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pending Tasks</p>
                        <p className="text-3xl font-black">{assignedOrders.length}</p>
                      </div>
                      <div className="p-2 bg-orange-500/10 rounded-xl">
                        <Clock className="h-5 w-5 text-orange-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-gradient-to-br from-green-500/10 to-transparent">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Reports Filed</p>
                        <p className="text-3xl font-black">12</p>
                      </div>
                      <div className="p-2 bg-green-500/10 rounded-xl">
                        <FileText className="h-5 w-5 text-green-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Job Schedule List */}
              <Card className="border-none shadow-lg overflow-hidden">
                <CardHeader className="bg-muted/50 border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      UPCOMING JOB SCHEDULE
                    </CardTitle>
                    <Badge variant="secondary" className="font-bold">{assignedOrders.length} TASKS</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {assignedOrders.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <Calendar className="h-12 w-12 opacity-10 mb-2" />
                        <p className="font-medium">No assigned jobs for today</p>
                      </div>
                    ) : (
                      assignedOrders.map((order) => (
                        <div
                          key={order.id}
                          className={cn(
                            "group p-6 hover:bg-muted/30 transition-all cursor-pointer relative",
                            selectedOrder?.id === order.id && "bg-primary/5"
                          )}
                          onClick={() => setSelectedOrder(order)}
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-black text-lg">{order.orderNumber}</span>
                                <Badge variant={order.deliveryConfirmed ? 'default' : 'secondary'} className="rounded-full text-[10px] font-bold">
                                  {order.deliveryConfirmed ? 'DELIVERED' : 'PENDING'}
                                </Badge>
                              </div>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                  <Clock className="h-3.5 w-3.5" />
                                  {new Date(order.startDate).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <MapPin className="h-3.5 w-3.5" />
                                  {order.deliveryAddress || 'Area: Seminyak'}
                                </div>
                              </div>
                            </div>
                            <Button variant={selectedOrder?.id === order.id ? "default" : "secondary"} className="rounded-full font-bold px-6">
                              {selectedOrder?.id === order.id ? 'MANAGING...' : 'VIEW DETAILS'}
                            </Button>
                          </div>
                          {selectedOrder?.id === order.id && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Performance Mock Chart/Reporting */}
              <Card className="border-none shadow-sm h-[300px] flex items-center justify-center bg-muted/20 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.05)_100%)]" />
                <div className="z-10 text-center space-y-4">
                  <div className="p-4 bg-background rounded-full shadow-xl inline-block group-hover:scale-110 transition-transform">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-black text-xl">PERFORMANCE ANALYTICS</p>
                    <p className="text-sm text-muted-foreground max-w-md px-6">
                      Detailed visual reports on completion rates and stock management efficiency are being calculated.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column: Active Task & Inventory */}
            <div className="lg:col-span-4 space-y-6">
              {/* Active Delivery Report */}
              {selectedOrder ? (
                <Card className="border-none shadow-2xl border-2 border-primary/20 ring-4 ring-primary/5">
                  <CardHeader className="bg-primary text-primary-foreground">
                    <CardTitle className="text-base font-black uppercase tracking-tighter flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      TASK EXECUTION: {selectedOrder.orderNumber}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-muted rounded-xl space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Delivery Target</p>
                        <p className="font-bold text-sm leading-tight">{selectedOrder.deliveryAddress || 'Address details in notes'}</p>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-xs font-black uppercase text-muted-foreground">Rental Items Checklist</Label>
                        <div className="space-y-2">
                          {selectedOrder.rentalItems?.map((item: any) => (
                            <div key={item.id} className="flex items-center gap-3 p-3 bg-card border rounded-xl hover:border-primary/50 transition-colors">
                              <Checkbox id={`item-${item.id}`} disabled={selectedOrder.deliveryConfirmed} className="rounded-md h-5 w-5" />
                              <Label htmlFor={`item-${item.id}`} className="flex-1 text-sm font-medium cursor-pointer">
                                {item.name || 'Equipment Unit'} <span className="text-primary font-black ml-1">x{item.quantity}</span>
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-xs font-black uppercase text-muted-foreground">Evidence / Photos</Label>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          {deliveryPhotos.length > 0 && Array.from(deliveryPhotos).map((photo, i) => (
                            <div key={i} className="aspect-square bg-muted rounded-xl overflow-hidden border">
                              <img src={URL.createObjectURL(photo)} alt="Preview" className="object-cover w-full h-full" />
                            </div>
                          ))}
                        </div>
                        <div className="relative">
                          <Input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            id="photo-upload"
                            onChange={(e) => setDeliveryPhotos(Array.from(e.target.files || []))}
                            disabled={selectedOrder.deliveryConfirmed}
                          />
                          <Label htmlFor="photo-upload" className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer hover:bg-muted/50 transition-colors gap-2">
                            <Camera className="h-6 w-6 text-primary" />
                            <span className="text-xs font-bold uppercase tracking-tight">Upload Proof</span>
                          </Label>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleConfirmDelivery}
                      disabled={selectedOrder.deliveryConfirmed || deliveryPhotos.length === 0}
                      className="w-full h-14 rounded-xl font-black text-lg gap-3"
                    >
                      {selectedOrder.deliveryConfirmed ? <CheckCircle2 /> : <Plus />}
                      {selectedOrder.deliveryConfirmed ? 'COMPLETED' : 'FINALIZE DELIVERY'}
                    </Button>
                    <Button variant="ghost" onClick={() => setSelectedOrder(null)} className="w-full font-bold text-muted-foreground">
                      CANCEL TASK
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="h-64 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-muted-foreground p-8 text-center gap-4 bg-muted/10">
                  <div className="p-4 bg-background rounded-full">
                    <AlertCircle className="h-6 w-6 opacity-30" />
                  </div>
                  <p className="text-sm font-medium">Select a job from the schedule to begin delivery reporting</p>
                </div>
              )}

              {/* Stock Inventory Quick Actions */}
              <Card className="border-none shadow-sm overflow-hidden bg-zinc-900 text-white">
                <CardHeader className="bg-white/5 border-b border-white/10">
                  <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <Package className="h-4 w-4" /> INVENTORY RE-SYNC
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {[
                    { id: 'standing-desk', name: 'STANDING DESKS', count: 12 },
                    { id: 'monitor', name: 'ULTRAWIDE MONITORS', count: 8 },
                    { id: 'chair', name: 'ERGONOMIC CHAIRS', count: 15 }
                  ].map(item => (
                    <div key={item.id} className="space-y-2">
                      <div className="flex justify-between items-center px-1">
                        <span className="text-[10px] font-black text-white/60">{item.name}</span>
                        <span className="text-xs font-bold">CURRENT: {item.count}</span>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Qty..."
                          className="bg-white/10 border-white/10 h-10 rounded-xl font-bold placeholder:text-white/20"
                          onChange={(e) =>
                            setStockUpdates({ ...stockUpdates, [item.id]: parseInt(e.target.value) || 0 })
                          }
                        />
                        <Button
                          onClick={() => handleUpdateStock(item.id)}
                          size="sm"
                          className="bg-primary text-primary-foreground font-black rounded-xl h-10 px-4"
                        >
                          SYNC
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
