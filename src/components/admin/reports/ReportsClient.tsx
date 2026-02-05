'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
    Download,
    TrendingUp,
    Calendar,
    DollarSign,
    PieChart as PieChartIcon,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie
} from 'recharts'
import { Badge } from "@/components/ui/badge"
import jsPDF from 'jspdf'
import 'jspdf-autotable'

interface ReportsClientProps {
    revenueByMonth: any[]
    categoryData: any[]
    outstandingInvoices: any[]
    financialSummary: {
        totalRevenue: number
        outstanding: number
        growth: number
        averageOrder: number
    }
}

export function ReportsClient({
    revenueByMonth,
    categoryData,
    outstandingInvoices,
    financialSummary
}: ReportsClientProps) {

    const handleDownloadReport = () => {
        const doc = new jsPDF() as any
        doc.setFontSize(20)
        doc.text("Financial Report - Tropic Tech", 20, 20)
        doc.setFontSize(12)
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30)

        doc.text("Summary:", 20, 45)
        doc.text(`Total Revenue: Rp ${financialSummary.totalRevenue.toLocaleString()}`, 25, 55)
        doc.text(`Outstanding: Rp ${financialSummary.outstanding.toLocaleString()}`, 25, 65)
        doc.text(`Average Order: Rp ${financialSummary.averageOrder.toLocaleString()}`, 25, 75)

        const tableData = outstandingInvoices.map(inv => [
            inv.invoiceNumber,
            inv.customerName,
            new Date(inv.date).toLocaleDateString(),
            `Rp ${inv.total.toLocaleString()}`,
            inv.status
        ])

        doc.autoTable({
            startY: 90,
            head: [['Invoice #', 'Customer', 'Date', 'Amount', 'Status']],
            body: tableData,
        })

        doc.save(`Financial_Report_${Date.now()}.pdf`)
    }

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

    return (
        <div className="space-y-8">
            <div className="flex justify-end">
                <Button onClick={handleDownloadReport} className="font-bold gap-2">
                    <Download className="h-4 w-4" /> DOWNLOAD ALL REPORTS (PDF)
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black">Rp {financialSummary.totalRevenue.toLocaleString('id-ID')}</div>
                        <div className="flex items-center text-xs text-green-600 mt-1 font-bold">
                            <ArrowUpRight className="h-3 w-3 mr-1" /> {financialSummary.growth}% Since last month
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Outstanding</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-orange-600">Rp {financialSummary.outstanding.toLocaleString('id-ID')}</div>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Calendar className="h-3 w-3 mr-1" /> Accounts Receivable
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Avg. Transaction</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black">Rp {financialSummary.averageOrder.toLocaleString('id-ID')}</div>
                        <div className="flex items-center text-xs text-blue-600 mt-1 font-bold">
                            <TrendingUp className="h-3 w-3 mr-1" /> Stable performance
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Active Rentals</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black">{outstandingInvoices.length}</div>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <DollarSign className="h-3 w-3 mr-1" /> Pending settlement
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle className="text-lg">Revenue Growth (Monthly)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueByMonth}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis tickFormatter={(val) => `Rp${val / 1000000}M`} />
                                <Tooltip formatter={(val: any) => `Rp ${val.toLocaleString()}`} />
                                <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle className="text-lg">Revenue by Category</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Aging Report (Outstanding Invoices)</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead>Invoice #</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {outstandingInvoices.map((inv) => (
                                <TableRow key={inv.id}>
                                    <TableCell className="font-mono font-bold">{inv.invoiceNumber}</TableCell>
                                    <TableCell>{inv.customerName}</TableCell>
                                    <TableCell>{new Date(inv.date).toLocaleDateString()}</TableCell>
                                    <TableCell className="font-bold">Rp {inv.total.toLocaleString('id-ID')}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
                                            {inv.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

import { Legend } from "recharts"
