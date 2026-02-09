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
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
      <Header />

      <main className="flex-1 py-12 px-4 mt-16 pb-20">
        <div className="container mx-auto">
          {/* Dashboard Header */}
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-1 bg-primary w-12 rounded-full" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">Operational Hub</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase leading-none">
                WORKER <span className="text-primary">DASHBOARD</span>
              </h1>
              <div className="flex items-center gap-3 text-muted-foreground font-bold text-sm">
                <Badge variant="outline" className="rounded-full px-4 border-primary/20 bg-primary/5 text-primary text-[10px] font-black">ACTIVE SESSION</Badge>
                <span>•</span>
                <span className="tracking-tight italic">{user?.fullName || 'Operational Staff'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" className="rounded-full font-black text-xs tracking-widest gap-2 hover:bg-primary/5" onClick={() => router.push('/')}>
                <Home className="h-4 w-4" /> BACK TO HOME
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full text-destructive hover:bg-destructive/10" onClick={() => logout()}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* Left Column: Stats & Schedule */}
            <div className="lg:col-span-8 space-y-8">
              {/* Worker Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm bg-zinc-900 text-white overflow-hidden group">
                  <CardContent className="p-6 relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                      <CheckCircle2 className="h-16 w-16" />
                    </div>
                    <div className="space-y-1 relative z-10">
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Completed Jobs</p>
                      <p className="text-4xl font-black">24</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-primary/10 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pending Tasks</p>
                      <p className="text-4xl font-black text-primary">{assignedOrders.length}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-muted/30 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Reports</p>
                      <p className="text-4xl font-black">12</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Job Schedule List */}
              <Card className="border-none shadow-xl overflow-hidden rounded-3xl">
                <CardHeader className="bg-zinc-900 text-white py-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-black tracking-widest flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      UPCOMING JOB SCHEDULE
                    </CardTitle>
                    <Badge className="bg-primary text-primary-foreground font-black px-4">{assignedOrders.length} TASKS</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border/50">
                    {assignedOrders.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground bg-muted/5">
                        <Calendar className="h-16 w-16 opacity-10 mb-4" />
                        <p className="font-black text-xl uppercase tracking-tighter">No jobs assigned</p>
                        <p className="text-sm">Enjoy your break or check back later.</p>
                      </div>
                    ) : (
                      assignedOrders.map((order) => (
                        <div
                          key={order.id}
                          className={cn(
                            "group p-8 hover:bg-muted/30 transition-all cursor-pointer relative",
                            selectedOrder?.id === order.id && "bg-primary/5"
                          )}
                          onClick={() => setSelectedOrder(order)}
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <span className="font-black text-2xl tracking-tighter">{order.orderNumber}</span>
                                {order.deliveryConfirmed ? (
                                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20 rounded-full font-black text-[10px] px-3">DELIVERED</Badge>
                                ) : (
                                  <Badge className="bg-primary/10 text-primary border-primary/20 rounded-full font-black text-[10px] px-3">PENDING</Badge>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground font-medium">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-primary" />
                                  {new Date(order.startDate).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-primary" />
                                  {order.deliveryAddress || 'Area: Bali Region'}
                                </div>
                              </div>
                            </div>
                            <Button variant={selectedOrder?.id === order.id ? "default" : "secondary"} className="rounded-xl font-black px-8 py-6 h-auto tracking-widest text-xs">
                              {selectedOrder?.id === order.id ? 'MANAGING...' : 'VIEW TASK'}
                            </Button>
                          </div>
                          {selectedOrder?.id === order.id && (
                            <div className="absolute left-0 top-0 bottom-0 w-2 bg-primary" />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Indicator */}
              <Card className="border-none shadow-sm h-[320px] flex items-center justify-center bg-zinc-900 text-white relative overflow-hidden rounded-3xl group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(255,165,0,0.05)_100%)]" />
                <div className="z-10 text-center space-y-6 max-w-md px-8">
                  <div className="h-20 w-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto ring-8 ring-primary/5 group-hover:scale-110 transition-transform duration-500">
                    <TrendingUp className="h-10 w-10 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-black text-2xl tracking-tighter leading-tight uppercase">OPERATIONAL PERFORMANCE</p>
                    <p className="text-sm text-zinc-400 font-medium">
                      Your efficiency metrics and delivery completion analytics are synchronized in real-time with central HQ.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column: Execution & Inventory */}
            <div className="lg:col-span-4 space-y-8">
              {/* Active Task Section */}
              {selectedOrder ? (
                <Card className="border-none shadow-2xl overflow-hidden rounded-3xl ring-4 ring-primary/5">
                  <CardHeader className="bg-primary text-primary-foreground py-6">
                    <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      TASK EXECUTION: {selectedOrder.orderNumber}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    <div className="space-y-6">
                      <div className="p-5 bg-muted/50 rounded-2xl space-y-2 border">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Target Location</p>
                        <p className="font-bold text-base leading-tight italic">"{selectedOrder.deliveryAddress || 'Check dispatch notes'}"</p>
                      </div>

                      <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Inventory Checklist</Label>
                        <div className="space-y-3">
                          {selectedOrder.rentalItems?.map((item: any) => (
                            <div key={item.id} className="flex items-center gap-4 p-4 bg-background border rounded-2xl hover:border-primary/40 transition-all group">
                              <Checkbox id={`item-${item.id}`} disabled={selectedOrder.deliveryConfirmed} className="rounded-md h-6 w-6 border-2" />
                              <Label htmlFor={`item-${item.id}`} className="flex-1 text-sm font-black cursor-pointer group-hover:text-primary transition-colors">
                                {item.name || 'Equipment Unit'} <span className="text-primary ml-2 uppercase opacity-50">x{item.quantity}</span>
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Digital Evidence</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {deliveryPhotos.length > 0 && Array.from(deliveryPhotos).map((photo, i) => (
                            <div key={i} className="aspect-square bg-muted rounded-2xl overflow-hidden border-2 border-primary/10 shadow-inner">
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
                          <Label htmlFor="photo-upload" className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-3xl cursor-pointer hover:bg-primary/5 hover:border-primary/40 transition-all gap-3 bg-muted/10">
                            <div className="p-3 bg-background rounded-full shadow-sm">
                              <Camera className="h-6 w-6 text-primary" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest">Upload Capture</span>
                          </Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4">
                      <Button
                        onClick={handleConfirmDelivery}
                        disabled={selectedOrder.deliveryConfirmed || deliveryPhotos.length === 0}
                        className="w-full h-16 rounded-2xl font-black text-lg gap-3 shadow-xl shadow-primary/20"
                      >
                        {selectedOrder.deliveryConfirmed ? <CheckCircle2 className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
                        {selectedOrder.deliveryConfirmed ? 'MISSION COMPLETED' : 'FINALIZE DELIVERY'}
                      </Button>
                      <Button variant="ghost" onClick={() => setSelectedOrder(null)} className="w-full font-black text-xs tracking-widest bg-muted/20 hover:bg-muted/40 rounded-xl h-12 uppercase">
                        CLOSE TASK
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="h-72 border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center text-muted-foreground p-10 text-center gap-6 bg-muted/5">
                  <div className="p-5 bg-background rounded-full shadow-sm ring-8 ring-muted/10">
                    <AlertCircle className="h-8 w-8 opacity-20" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-black uppercase tracking-tighter">Duty Standing By</p>
                    <p className="text-sm font-medium">Select a job from the schedule <br />to begin execution reporting.</p>
                  </div>
                </div>
              )}

              {/* Stock Inventory Quick Actions */}
              <Card className="border-none shadow-lg overflow-hidden bg-zinc-950 text-white rounded-3xl">
                <CardHeader className="bg-white/5 border-b border-white/10 py-6">
                  <CardTitle className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3 text-primary">
                    <Package className="h-4 w-4" /> INVENTORY RE-SYNC
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  {[
                    { id: 'standing-desk', name: 'STANDING DESKS', count: 12 },
                    { id: 'monitor', name: 'ULTRAWIDE MONITORS', count: 8 },
                    { id: 'chair', name: 'ERGONOMIC CHAIRS', count: 15 }
                  ].map(item => (
                    <div key={item.id} className="space-y-3">
                      <div className="flex justify-between items-end px-1">
                        <span className="text-[10px] font-black text-zinc-500 tracking-widest leading-none">{item.name}</span>
                        <span className="text-xs font-black text-primary leading-none">LIVE: {item.count}</span>
                      </div>
                      <div className="flex gap-3">
                        <Input
                          type="number"
                          placeholder="Adjustment..."
                          className="bg-white/5 border-white/10 h-12 rounded-xl font-black placeholder:text-zinc-700 text-center"
                          onChange={(e) =>
                            setStockUpdates({ ...stockUpdates, [item.id]: parseInt(e.target.value) || 0 })
                          }
                        />
                        <Button
                          onClick={() => handleUpdateStock(item.id)}
                          size="sm"
                          className="bg-white text-black hover:bg-primary hover:text-white font-black rounded-xl h-12 px-6 transition-all"
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
