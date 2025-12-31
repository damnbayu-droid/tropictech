'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Header from '@/components/header/Header'
import Footer from '@/components/landing/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Users, Package, DollarSign, TrendingUp, Plus, Edit, Trash2, UserPlus } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminDashboard() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0, revenue: 0 })
  const [products, setProducts] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [isAddWorkerOpen, setIsAddWorkerOpen] = useState(false)

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: 'Desks',
    monthlyPrice: 0,
    stock: 0,
    imageUrl: '',
  })

  // New worker form state
  const [newWorker, setNewWorker] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    whatsapp: '',
  })

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
    if (user) {
      fetchStats()
      fetchProducts()
      fetchUsers()
      fetchOrders()
    }
  }, [user])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const [usersRes, productsRes, ordersRes] = await Promise.all([
        fetch('/api/admin/stats/users', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/admin/stats/products', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/admin/stats/orders', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      const usersData = await usersRes.json()
      const productsData = await productsRes.json()
      const ordersData = await ordersRes.json()

      setStats({
        users: usersData.count,
        products: productsData.count,
        orders: ordersData.count,
        revenue: ordersData.revenue || 0,
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders)
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    }
  }

  const handleAddProduct = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      })

      if (response.ok) {
        toast.success('Product added successfully')
        setIsAddProductOpen(false)
        setNewProduct({
          name: '',
          description: '',
          category: 'Desks',
          monthlyPrice: 0,
          stock: 0,
          imageUrl: '',
        })
        fetchProducts()
      } else {
        toast.error('Failed to add product')
      }
    } catch (error) {
      toast.error('Failed to add product')
    }
  }

  const handleCreateWorker = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/workers', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newWorker),
      })

      if (response.ok) {
        toast.success('Worker account created successfully')
        setIsAddWorkerOpen(false)
        setNewWorker({
          username: '',
          password: '',
          fullName: '',
          email: '',
          whatsapp: '',
        })
        fetchUsers()
      } else {
        toast.error('Failed to create worker account')
      }
    } catch (error) {
      toast.error('Failed to create worker account')
    }
  }

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        toast.success('Order status updated')
        fetchOrders()
      } else {
        toast.error('Failed to update order status')
      }
    } catch (error) {
      toast.error('Failed to update order status')
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
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your rental business</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.users}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.products}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.orders}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rp {stats.revenue.toLocaleString('id-ID')}</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="workers">Workers</TabsTrigger>
              <TabsTrigger value="financials">Financials</TabsTrigger>
            </TabsList>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Products</h2>
                <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Product</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="prod-name">Product Name</Label>
                        <Input
                          id="prod-name"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="prod-category">Category</Label>
                        <Select
                          value={newProduct.category}
                          onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Desks">Desks</SelectItem>
                            <SelectItem value="Monitors">Monitors</SelectItem>
                            <SelectItem value="Chairs">Chairs</SelectItem>
                            <SelectItem value="Keyboard & Mouse">Keyboard & Mouse</SelectItem>
                            <SelectItem value="Accessories">Accessories</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="prod-desc">Description</Label>
                        <Textarea
                          id="prod-desc"
                          value={newProduct.description}
                          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="prod-price">Monthly Price (IDR)</Label>
                        <Input
                          id="prod-price"
                          type="number"
                          value={newProduct.monthlyPrice || ''}
                          onChange={(e) => setNewProduct({ ...newProduct, monthlyPrice: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="prod-stock">Stock</Label>
                        <Input
                          id="prod-stock"
                          type="number"
                          value={newProduct.stock || ''}
                          onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="prod-image">Image URL</Label>
                        <Input
                          id="prod-image"
                          value={newProduct.imageUrl}
                          onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                          placeholder="https://..."
                        />
                      </div>
                      <Button onClick={handleAddProduct} className="w-full">
                        Add Product
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="grid gap-4">
                {products.map((product) => (
                  <Card key={product.id}>
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                        <p className="text-sm">Stock: {product.stock}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">Rp {product.monthlyPrice.toLocaleString('id-ID')}/mo</p>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-4">
              <h2 className="text-xl font-semibold">All Orders</h2>
              <div className="grid gap-4">
                {orders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{order.orderNumber}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Select
                          value={order.status}
                          onValueChange={(value) => handleUpdateOrderStatus(order.id, value)}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm">Customer: {order.user?.fullName || order.guestName}</p>
                          <p className="text-sm text-muted-foreground">Items: {order.rentalItems.length}</p>
                        </div>
                        <p className="font-semibold">Rp {order.totalAmount.toLocaleString('id-ID')}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-4">
              <h2 className="text-xl font-semibold">All Users</h2>
              <div className="grid gap-4">
                {users.map((userItem) => (
                  <Card key={userItem.id}>
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{userItem.fullName}</h3>
                        <p className="text-sm text-muted-foreground">{userItem.email}</p>
                        <Badge variant="secondary">{userItem.role}</Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{userItem.whatsapp}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Workers Tab */}
            <TabsContent value="workers" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Workers</h2>
                <Dialog open={isAddWorkerOpen} onOpenChange={setIsAddWorkerOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Create Worker Account
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Worker Account</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="worker-username">Username</Label>
                        <Input
                          id="worker-username"
                          value={newWorker.username}
                          onChange={(e) => setNewWorker({ ...newWorker, username: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="worker-password">Password</Label>
                        <Input
                          id="worker-password"
                          type="password"
                          value={newWorker.password}
                          onChange={(e) => setNewWorker({ ...newWorker, password: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="worker-fullname">Full Name</Label>
                        <Input
                          id="worker-fullname"
                          value={newWorker.fullName}
                          onChange={(e) => setNewWorker({ ...newWorker, fullName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="worker-email">Email</Label>
                        <Input
                          id="worker-email"
                          type="email"
                          value={newWorker.email}
                          onChange={(e) => setNewWorker({ ...newWorker, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="worker-whatsapp">WhatsApp</Label>
                        <Input
                          id="worker-whatsapp"
                          value={newWorker.whatsapp}
                          onChange={(e) => setNewWorker({ ...newWorker, whatsapp: e.target.value })}
                        />
                      </div>
                      <Button onClick={handleCreateWorker} className="w-full">
                        Create Worker
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="grid gap-4">
                {users.filter((u) => u.role === 'WORKER').map((worker) => (
                  <Card key={worker.id}>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{worker.fullName}</h3>
                      <p className="text-sm text-muted-foreground">{worker.email}</p>
                      <p className="text-sm">{worker.whatsapp}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Financials Tab */}
            <TabsContent value="financials" className="space-y-4">
              <h2 className="text-xl font-semibold">Financial Summary</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Revenue</CardTitle>
                    <CardDescription>All time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">Rp {stats.revenue.toLocaleString('id-ID')}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Total Orders</CardTitle>
                    <CardDescription>All time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{stats.orders}</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
