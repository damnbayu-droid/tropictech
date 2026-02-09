'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  Download,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Package,
  CreditCard,
  User as UserIcon,
  ShoppingBag,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  MapPin
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function UserDashboard() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchOrders()
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
        toast.success('Rental extension request sent')
        fetchOrders()
      } else {
        toast.error('Failed to extend rental')
      }
    } catch (error) {
      toast.error('Failed to extend rental')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20 rounded-full px-3 font-bold text-[10px]">COMPLETED</Badge>
      case 'CANCELLED':
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20 rounded-full px-3 font-bold text-[10px]">CANCELLED</Badge>
      case 'ACTIVE':
        return <Badge className="bg-primary/10 text-primary border-primary/20 rounded-full px-3 font-bold text-[10px]">ACTIVE RENTAL</Badge>
      case 'CONFIRMED':
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 rounded-full px-3 font-bold text-[10px]">CONFIRMED</Badge>
      default:
        return <Badge variant="secondary" className="rounded-full px-3 font-bold text-[10px]">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const activeOrders = orders.filter(o => o.status === 'ACTIVE' || o.status === 'CONFIRMED' || o.status === 'PENDING')
  const pastOrders = orders.filter(o => o.status === 'COMPLETED' || o.status === 'CANCELLED')

  return (
    <div className="space-y-10">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-zinc-900 text-white overflow-hidden group">
          <CardContent className="p-6 relative">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
              <Package className="h-20 w-20" />
            </div>
            <div className="space-y-1 relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Rentals</p>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-black">{orders.length}</span>
                <span className="text-xs text-primary font-bold mb-1">UNITS</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-gradient-to-br from-primary/10 to-transparent overflow-hidden">
          <CardContent className="p-6">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Active Subscriptions</p>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-black">{activeOrders.length}</span>
                <span className="text-xs text-muted-foreground font-bold mb-1">RUNNING</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-muted/30 overflow-hidden">
          <CardContent className="p-6">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Island Coverage</p>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-green-500" />
                <span className="text-sm font-bold uppercase">Bali Island Delivery</span>
              </div>
              <p className="text-xs text-muted-foreground">Certified 24/7 Support Included</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="rentals" className="space-y-8">
        <div className="flex items-center justify-between border-b pb-1">
          <TabsList className="bg-transparent h-auto p-0 gap-8">
            <TabsTrigger
              value="rentals"
              className="px-0 py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none font-black text-xs tracking-widest uppercase transition-all"
            >
              ACTIVE RENTALS ({activeOrders.length})
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="px-0 py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none font-black text-xs tracking-widest uppercase transition-all"
            >
              PAST ORDERS
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="px-0 py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none font-black text-xs tracking-widest uppercase transition-all"
            >
              ACCOUNT SECURITY
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Active Rentals Tab */}
        <TabsContent value="rentals" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {activeOrders.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed rounded-3xl bg-muted/10">
              <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="font-black text-xl uppercase tracking-tighter">No Active Gear Found</p>
              <p className="text-muted-foreground text-sm mt-1">Ready to upgrade your workspace? Browse our products.</p>
              <Button className="mt-6 rounded-full font-bold px-8" variant="outline" onClick={() => window.location.href = '#products'}>
                EXPLORE CATALOG
              </Button>
            </div>
          ) : (
            <div className="grid gap-6">
              {activeOrders.map((order) => (
                <Card key={order.id} className="border-none shadow-lg overflow-hidden group">
                  <div className="flex flex-col md:flex-row h-full">
                    <div className="bg-muted/50 p-6 md:w-72 flex flex-col justify-between border-r">
                      <div className="space-y-1">
                        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Order ID</div>
                        <div className="text-xl font-black tracking-tighter text-primary">{order.orderNumber}</div>
                        <div className="pt-2">{getStatusBadge(order.status)}</div>
                      </div>
                      <div className="pt-4 space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>Expires: {new Date(order.endDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-6 flex-1 flex flex-col md:flex-row justify-between gap-6">
                      <div className="space-y-4 flex-1">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Deployed Equipment</label>
                          <div className="grid gap-2">
                            {order.rentalItems.map((item: any) => (
                              <div key={item.id} className="flex items-center gap-3 p-3 bg-muted/20 rounded-xl border border-transparent hover:border-primary/20 transition-colors">
                                <div className="p-2 bg-background rounded-lg">
                                  <Package className="h-4 w-4 text-primary" />
                                </div>
                                <span className="font-bold text-sm tracking-tight">{item.name} <span className="text-primary ml-1">x{item.quantity}</span></span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="md:w-64 flex flex-col justify-between items-end gap-6">
                        <div className="text-right">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Bill</p>
                          <p className="text-2xl font-black tracking-tighter">Rp {order.totalAmount.toLocaleString('id-ID')}</p>
                          <p className="text-[10px] font-bold text-green-600 tracking-wider">VIA {order.paymentMethod}</p>
                        </div>
                        <div className="flex flex-col w-full gap-2">
                          <Button size="sm" className="w-full font-black rounded-lg gap-2" shadow="xl" onClick={() => handleExtendRental(order.id)}>
                            EXTEND RENTAL
                          </Button>
                          <Button size="sm" variant="ghost" className="w-full font-bold text-xs">
                            DOWNLOAD INVOICE
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="animate-in fade-in duration-500">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/30 border-b">
                      <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Reference</th>
                      <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date Range</th>
                      <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                      <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">Amount</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {pastOrders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground text-sm font-medium">No previous orders found</td>
                      </tr>
                    ) : (
                      pastOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-muted/20 transition-colors group">
                          <td className="px-6 py-4">
                            <span className="font-black tracking-tight">{order.orderNumber}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-muted-foreground">
                              {new Date(order.startDate).toLocaleDateString()} - {new Date(order.endDate).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(order.status)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="font-bold">Rp {order.totalAmount.toLocaleString('id-ID')}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button variant="ghost" size="icon" className="group-hover:text-primary transition-colors">
                              <Download className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile" className="animate-in fade-in duration-500">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-primary" />
                  PERSONAL IDENTITY
                </CardTitle>
                <CardDescription>Verified account information used for deliveries.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-4">
                <div className="grid gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Full Name</label>
                    <p className="font-bold border-b pb-2">{user?.fullName}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email Address</label>
                    <p className="font-bold border-b pb-2">{user?.email}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">WhatsApp Contact</label>
                    <p className="font-bold border-b pb-2">{user?.whatsapp}</p>
                  </div>
                </div>
                <Button className="w-full rounded-xl font-bold py-6">REQUEST INFO UPDATE</Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-zinc-900 text-white">
              <CardHeader>
                <CardTitle className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  DELIVERY LOCATION
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-sm font-medium leading-relaxed italic text-zinc-300">
                    "{user?.baliAddress || 'No current address on file. Please provide for delivery.'}"
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 p-4 bg-white/5 rounded-2xl text-center">
                    <p className="text-[10px] font-black text-zinc-500 uppercase">Region</p>
                    <p className="font-bold">Bali, ID</p>
                  </div>
                  <div className="flex-1 p-4 bg-white/5 rounded-2xl text-center">
                    <p className="text-[10px] font-black text-zinc-500 uppercase">Zone</p>
                    <p className="font-bold text-primary">Standard</p>
                  </div>
                </div>
                <p className="text-xs text-zinc-500 text-center font-medium">To change your delivery address for an active order, please contact support via WhatsApp.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
