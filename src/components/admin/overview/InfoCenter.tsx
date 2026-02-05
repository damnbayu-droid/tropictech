'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Bell,
    Mail,
    AlertCircle,
    CheckCircle2,
    Info,
    AlertTriangle,
    ArrowUpRight
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface InfoCenterProps {
    notifications: any[]
}

export function InfoCenter({ notifications }: InfoCenterProps) {
    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg">Information Center</CardTitle>
                <Badge variant="outline" className="font-normal">
                    {notifications.length} New
                </Badge>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4 pt-2">
                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                                <Bell className="h-10 w-10 mb-2 opacity-20" />
                                <p>No new activity</p>
                            </div>
                        ) : (
                            notifications.map((note) => (
                                <div
                                    key={note.id}
                                    className="group relative flex gap-4 p-4 rounded-xl border bg-card hover:bg-accent/40 transition-all duration-200"
                                >
                                    <div className={`mt-1 h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${note.type === 'ERROR' ? 'bg-red-100 text-red-600' :
                                            note.type === 'WARNING' ? 'bg-yellow-100 text-yellow-600' :
                                                note.type === 'SUCCESS' ? 'bg-green-100 text-green-600' :
                                                    'bg-blue-100 text-blue-600'
                                        }`}>
                                        {note.type === 'ERROR' ? <AlertCircle className="h-5 w-5" /> :
                                            note.type === 'WARNING' ? <AlertTriangle className="h-5 w-5" /> :
                                                note.type === 'SUCCESS' ? <CheckCircle2 className="h-5 w-5" /> :
                                                    <Info className="h-5 w-5" />}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-bold leading-none">{note.title}</p>
                                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                                {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {note.message}
                                        </p>
                                        <button className="text-[10px] font-bold text-primary flex items-center opacity-0 group-hover:opacity-100 transition-opacity pt-1">
                                            View Details <ArrowUpRight className="ml-1 h-3 w-3" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
