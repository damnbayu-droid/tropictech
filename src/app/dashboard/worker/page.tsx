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
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  Calendar,
  MapPin,
  CheckCircle,
  Clock,
  AlertCircle,
  Home,
  LogOut,
  Bell,
  Package,
  TrendingUp,
  ClipboardCheck
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { RealtimePoller } from '@/lib/realtime'

export default function WorkerDashboard() {
  const { user, isLoading, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  // State for schedules/jobs
  const [schedules, setSchedules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // State for attendance
  const [todayAttendance, setTodayAttendance] = useState<any>(null)
  const [attendanceHistory, setAttendanceHistory] = useState<any[]>([])

  // State for notifications
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  // State for dialogs
  const [showAttendanceDialog, setShowAttendanceDialog] = useState(false)
  const [showNotificationsDialog, setShowNotificationsDialog] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
    if (user) {
      fetchData()

      // Set up real-time polling every 15 seconds
      const poller = new RealtimePoller({
        interval: 15000,
        onUpdate: (data) => {
          if (data.schedules) setSchedules(data.schedules.schedules)
          if (data.notifications) {
            setNotifications(data.notifications.notifications)
            setUnreadCount(data.notifications.unreadCount)
          }
        }
      })

      const token = localStorage.getItem('token')
      if (token) {
        poller.pollWorkerData(token)
      }

      return () => poller.stop()
    }
  }, [user])

  const fetchData = async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      // Fetch all data in parallel
      const [schedulesRes, attendanceRes, notificationsRes] = await Promise.all([
        fetch('/api/worker/schedules', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/worker/attendance', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/worker/notifications', { headers: { 'Authorization': `Bearer ${token}` } })
      ])

      if (schedulesRes.ok) {
        const data = await schedulesRes.json()
        setSchedules(data.schedules)
      }

      if (attendanceRes.ok) {
        const data = await schedulesRes.json()
        setAttendanceHistory(data.attendance || [])

        // Check if checked in today
        const today = new Date().toISOString().split('T')[0]
        const todayRecord = data.attendance?.find((a: any) =>
          a.date.split('T')[0] === today
        )
        setTodayAttendance(todayRecord)
      }

      if (notificationsRes.ok) {
        const data = await notificationsRes.json()
        setNotifications(data.notifications || [])
        setUnreadCount(data.unreadCount || 0)
      }
    } catch (error) {
      console.error('Failed to fetch worker data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleCheckInOut = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/worker/attendance', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notes: '' })
      })

      if (res.ok) {
        const data = await res.json()
        if (data.action === 'checkin') {
          toast.success('Checked in successfully!')
        } else {
          toast.success('Checked out successfully!')
        }
        setTodayAttendance(data.attendance)
        fetchData()
      } else {
        toast.error('Failed to record attendance')
      }
    } catch (error) {
      toast.error('Failed to record attendance')
    }
  }

  const updateJobStatus = async (scheduleId: string, status: string, notes?: string) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/worker/schedules/${scheduleId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, workerNotes: notes })
      })

      if (res.ok) {
        toast.success(`Job status updated to ${status}`)
        fetchData()
      } else {
        toast.error('Failed to update job status')
      }
    } catch (error) {
      toast.error('Failed to update job status')
    }
  }

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  // Calculate stats
  const pendingJobs = schedules.filter(s => s.status === 'PENDING').length
  const ongoingJobs = schedules.filter(s => s.status === 'ONGOING').length
  const completedJobs = schedules.filter(s => s.status === 'FINISHED').length
  const attendanceRate = attendanceHistory.length > 0
    ? Math.round((attendanceHistory.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length / attendanceHistory.length) * 100)
    : 0

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-8 px-4 mt-16">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-primary mb-2">Worker Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user?.fullName}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setShowNotificationsDialog(true)}
              >
                <Bell className="w-4 h-4" />
                Notifications
                {unreadCount > 0 && (
                  <Badge className="ml-1">{unreadCount}</Badge>
                )}
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => router.push('/')}
              >
                <Home className="w-4 h-4" />
                Home
              </Button>
              <Button variant="outline" onClick={logout} className="gap-2">
                <LogOut className="w-4 h-4" />
                Log Out
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Clock className="w-8 h-8 text-orange-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Jobs</p>
                    <p className="text-2xl font-bold">{pendingJobs}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <AlertCircle className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Ongoing</p>
                    <p className="text-2xl font-bold">{ongoingJobs}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold">{completedJobs}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <TrendingUp className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Attendance</p>
                    <p className="text-2xl font-bold">{attendanceRate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Attendance Check-in */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5" />
                Daily Attendance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todayAttendance ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Today's Status</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={todayAttendance.status === 'PRESENT' ? 'default' : 'secondary'}>
                        {todayAttendance.status}
                      </Badge>
                      <span className="text-sm">
                        Check-in: {todayAttendance.checkInTime ? new Date(todayAttendance.checkInTime).toLocaleTimeString() : 'N/A'}
                      </span>
                      {todayAttendance.checkOutTime && (
                        <span className="text-sm">
                          | Check-out: {new Date(todayAttendance.checkOutTime).toLocaleTimeString()}
                        </span>
                      )}
                    </div>
                  </div>
                  {!todayAttendance.checkOutTime && (
                    <Button onClick={handleCheckInOut}>
                      Check Out
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">You haven't checked in today</p>
                  <Button onClick={handleCheckInOut}>
                    Check In Now
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Job Schedules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Job Schedules
              </CardTitle>
            </CardHeader>
            <CardContent>
              {schedules.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No jobs assigned yet</p>
              ) : (
                <div className="space-y-4">
                  {schedules.map((schedule) => (
                    <Card key={schedule.id} className="border-l-4 border-l-primary">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-bold text-lg">{schedule.order?.orderNumber}</h3>
                            <p className="text-sm text-muted-foreground">
                              Customer: {schedule.order?.user?.fullName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <Calendar className="w-3 h-3 inline mr-1" />
                              Scheduled: {new Date(schedule.scheduledDate).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant={
                            schedule.status === 'FINISHED' ? 'default' :
                              schedule.status === 'ONGOING' ? 'secondary' :
                                'outline'
                          }>
                            {schedule.status}
                          </Badge>
                        </div>

                        {schedule.notes && (
                          <div className="bg-muted p-3 rounded-md mb-4">
                            <p className="text-sm font-medium">Admin Notes:</p>
                            <p className="text-sm">{schedule.notes}</p>
                          </div>
                        )}

                        {schedule.status !== 'FINISHED' && schedule.status !== 'CANCELLED' && (
                          <div className="flex gap-2 flex-wrap">
                            {schedule.status === 'PENDING' && (
                              <Button size="sm" onClick={() => updateJobStatus(schedule.id, 'ONGOING')}>
                                Start Job
                              </Button>
                            )}
                            {schedule.status === 'ONGOING' && (
                              <>
                                <Button size="sm" variant="default" onClick={() => updateJobStatus(schedule.id, 'FINISHED')}>
                                  Mark Finished
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => updateJobStatus(schedule.id, 'DELAYED')}>
                                  Mark Delayed
                                </Button>
                              </>
                            )}
                            {(schedule.status === 'PENDING' || schedule.status === 'ONGOING') && (
                              <Button size="sm" variant="destructive" onClick={() => updateJobStatus(schedule.id, 'CANCELLED')}>
                                Cancel
                              </Button>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Notifications Dialog */}
      <Dialog open={showNotificationsDialog} onOpenChange={setShowNotificationsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {notifications.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No notifications</p>
            ) : (
              notifications.map((notif) => (
                <Card key={notif.id} className={cn(!notif.isRead && 'border-primary')}>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{notif.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(notif.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {!notif.isRead && <Badge>New</Badge>}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
