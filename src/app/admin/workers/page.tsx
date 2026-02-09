'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Users, UserPlus, MessageSquare, Calendar, CheckCircle2, Clock, TrendingUp } from 'lucide-react'

interface Worker {
    id: string
    fullName: string
    email: string
    whatsapp: string
    isActive: boolean
    stats: {
        totalJobs: number
        completedJobs: number
        pendingJobs: number
        attendanceRate: number
        unreadNotifications: number
    }
    workerSchedules: any[]
    workerAttendance: any[]
}

export default function WorkersPage() {
    const [workers, setWorkers] = useState<Worker[]>([])
    const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null)
    const [loading, setLoading] = useState(true)
    const [showCreateDialog, setShowCreateDialog] = useState(false)
    const [showMessageDialog, setShowMessageDialog] = useState(false)
    const [showAssignJobDialog, setShowAssignJobDialog] = useState(false)

    useEffect(() => {
        fetchWorkers()
    }, [])

    const fetchWorkers = async () => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/admin/workers', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await res.json()
            setWorkers(data.workers || [])
        } catch (error) {
            console.error('Failed to fetch workers:', error)
            toast.error('Failed to load workers')
        } finally {
            setLoading(false)
        }
    }

    const createWorker = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const data = {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            whatsapp: formData.get('whatsapp'),
            password: formData.get('password')
        }

        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/admin/workers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            })

            if (res.ok) {
                toast.success('Worker created successfully')
                setShowCreateDialog(false)
                fetchWorkers()
            } else {
                const error = await res.json()
                toast.error(error.error || 'Failed to create worker')
            }
        } catch (error) {
            toast.error('Failed to create worker')
        }
    }

    const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!selectedWorker) return

        const formData = new FormData(e.currentTarget)
        const data = {
            title: formData.get('title'),
            message: formData.get('message')
        }

        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`/api/admin/workers/${selectedWorker.id}/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            })

            if (res.ok) {
                toast.success('Message sent successfully')
                setShowMessageDialog(false)
            } else {
                toast.error('Failed to send message')
            }
        } catch (error) {
            toast.error('Failed to send message')
        }
    }

    const assignJob = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!selectedWorker) return

        const formData = new FormData(e.currentTarget)
        const data = {
            orderId: formData.get('orderId'),
            scheduledDate: formData.get('scheduledDate'),
            notes: formData.get('notes')
        }

        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`/api/admin/workers/${selectedWorker.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            })

            if (res.ok) {
                toast.success('Job assigned successfully')
                setShowAssignJobDialog(false)
                fetchWorkers()
            } else {
                toast.error('Failed to assign job')
            }
        } catch (error) {
            toast.error('Failed to assign job')
        }
    }

    if (loading) {
        return <div className="p-8">Loading workers...</div>
    }

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Workers Panel</h1>
                    <p className="text-muted-foreground mt-1">Manage your delivery and logistics team</p>
                </div>
                <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <UserPlus className="w-4 h-4" />
                            Add New Worker
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Worker</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={createWorker} className="space-y-4">
                            <div>
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input id="fullName" name="fullName" required />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" required />
                            </div>
                            <div>
                                <Label htmlFor="whatsapp">WhatsApp</Label>
                                <Input id="whatsapp" name="whatsapp" required />
                            </div>
                            <div>
                                <Label htmlFor="password">Initial Password</Label>
                                <Input id="password" name="password" type="password" required />
                            </div>
                            <Button type="submit" className="w-full">Create Worker</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <Users className="w-8 h-8 text-primary" />
                        <div>
                            <p className="text-sm text-muted-foreground">Total Workers</p>
                            <p className="text-2xl font-bold">{workers.length}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                        <div>
                            <p className="text-sm text-muted-foreground">Active Workers</p>
                            <p className="text-2xl font-bold">{workers.filter(w => w.isActive).length}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <Clock className="w-8 h-8 text-orange-600" />
                        <div>
                            <p className="text-sm text-muted-foreground">Pending Jobs</p>
                            <p className="text-2xl font-bold">
                                {workers.reduce((sum, w) => sum + w.stats.pendingJobs, 0)}
                            </p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <TrendingUp className="w-8 h-8 text-blue-600" />
                        <div>
                            <p className="text-sm text-muted-foreground">Avg Attendance</p>
                            <p className="text-2xl font-bold">
                                {Math.round(workers.reduce((sum, w) => sum + w.stats.attendanceRate, 0) / workers.length || 0)}%
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Workers List */}
            <div className="grid grid-cols-1 gap-4">
                {workers.map((worker) => (
                    <Card key={worker.id} className="p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-bold">{worker.fullName}</h3>
                                    <Badge variant={worker.isActive ? "default" : "secondary"}>
                                        {worker.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                    {worker.stats.unreadNotifications > 0 && (
                                        <Badge variant="destructive">{worker.stats.unreadNotifications} unread</Badge>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-4">
                                    <div>
                                        <span className="font-medium">Email:</span> {worker.email}
                                    </div>
                                    <div>
                                        <span className="font-medium">WhatsApp:</span> {worker.whatsapp}
                                    </div>
                                    <div>
                                        <span className="font-medium">Total Jobs:</span> {worker.stats.totalJobs}
                                    </div>
                                    <div>
                                        <span className="font-medium">Completed:</span> {worker.stats.completedJobs}
                                    </div>
                                </div>

                                {/* Performance Metrics */}
                                <div className="flex gap-6 mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-green-600"
                                                style={{ width: `${(worker.stats.completedJobs / worker.stats.totalJobs) * 100 || 0}%` }}
                                            />
                                        </div>
                                        <span className="text-sm">
                                            {Math.round((worker.stats.completedJobs / worker.stats.totalJobs) * 100 || 0)}% Completion
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-600"
                                                style={{ width: `${worker.stats.attendanceRate}%` }}
                                            />
                                        </div>
                                        <span className="text-sm">{worker.stats.attendanceRate}% Attendance</span>
                                    </div>
                                </div>

                                {/* Recent Activity */}
                                {worker.workerSchedules.length > 0 && (
                                    <div className="mt-4">
                                        <p className="text-sm font-medium mb-2">Recent Jobs:</p>
                                        <div className="space-y-1">
                                            {worker.workerSchedules.slice(0, 3).map((schedule: any) => (
                                                <div key={schedule.id} className="flex items-center gap-2 text-sm">
                                                    <Badge variant="outline">{schedule.status}</Badge>
                                                    <span className="text-muted-foreground">
                                                        {schedule.order?.orderNumber} - {new Date(schedule.scheduledDate).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="gap-2"
                                    onClick={() => {
                                        setSelectedWorker(worker)
                                        setShowAssignJobDialog(true)
                                    }}
                                >
                                    <Calendar className="w-4 h-4" />
                                    Assign Job
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="gap-2"
                                    onClick={() => {
                                        setSelectedWorker(worker)
                                        setShowMessageDialog(true)
                                    }}
                                >
                                    <MessageSquare className="w-4 h-4" />
                                    Send Message
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        // Navigate to detailed worker view
                                        window.location.href = `/admin/workers/${worker.id}`
                                    }}
                                >
                                    View Details
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Message Dialog */}
            <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Send Message to {selectedWorker?.fullName}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={sendMessage} className="space-y-4">
                        <div>
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" name="title" required placeholder="Message title" />
                        </div>
                        <div>
                            <Label htmlFor="message">Message</Label>
                            <Textarea id="message" name="message" required placeholder="Type your message here..." rows={4} />
                        </div>
                        <Button type="submit" className="w-full">Send Message</Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Assign Job Dialog */}
            <Dialog open={showAssignJobDialog} onOpenChange={setShowAssignJobDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Assign Job to {selectedWorker?.fullName}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={assignJob} className="space-y-4">
                        <div>
                            <Label htmlFor="orderId">Order ID</Label>
                            <Input id="orderId" name="orderId" required placeholder="Enter Order UUID" />
                        </div>
                        <div>
                            <Label htmlFor="scheduledDate">Scheduled Date</Label>
                            <Input id="scheduledDate" name="scheduledDate" type="date" required />
                        </div>
                        <div>
                            <Label htmlFor="notes">Notes (Optional)</Label>
                            <Textarea id="notes" name="notes" placeholder="Add any special instructions..." rows={3} />
                        </div>
                        <Button type="submit" className="w-full">Assign Job</Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
