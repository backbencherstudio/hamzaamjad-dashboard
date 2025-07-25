import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Loader2 } from 'lucide-react';

interface TableColumn {
    key: string
    label: string
    width?: string
    render?: (value: any, row: any) => React.ReactNode
}

interface TableAction {
    label: string
    onClick?: (row: any) => void
    className?: string
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning'
    render?: (row: any) => React.ReactNode
}

interface ReusableTableProps {
    data: any[]
    columns: TableColumn[]
    actions?: TableAction[]
    onRowClick?: (row: any) => void
    className?: string
    loading?: boolean
}

const statusColors = {
    pending: 'bg-orange-100 text-orange-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    default: 'bg-gray-100 text-gray-800'
}

export default function ReusableTable({
    data,
    columns,
    actions,
    onRowClick,
    className = "",
    loading = false
}: ReusableTableProps) {
    const tableData = data

    const renderCellContent = (column: TableColumn, row: any) => {
        const value = row[column.key]

        if (column.render) {
            return column.render(value, row)
        }

        if (column.key === 'status' && typeof value === 'string') {
            const statusClass = statusColors[value.toLowerCase() as keyof typeof statusColors] || statusColors.default
            return (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusClass}`}>
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                </span>
            )
        }

        return value
    }

    const colSpan = columns.length + (actions && actions.length > 0 ? 1 : 0);

    return (
        <div className={`${className}`}>
            <div className="rounded-t-lg border border-[#23293D] text-white w-full">
                <div className="overflow-x-auto">
                    <Table className="w-full min-w-[800px] divide-y divide-[#23293D]">
                        <TableHeader className="bg-[#23293D]">
                            <TableRow className="hover:bg-transparent">
                                {columns.map((column) => (
                                    <TableHead
                                        key={column.key}
                                        scope="col"
                                        style={{ width: column.width }}
                                        className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider overflow-hidden"
                                    >
                                        {column.label}
                                    </TableHead>
                                ))}
                                {actions && actions.length > 0 && (
                                    <TableHead scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Actions
                                    </TableHead>
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody className="bg-[#1D1F2C] divide-y divide-[#23293D]">
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={colSpan} className="text-center py-8">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-500" />
                                    </TableCell>
                                </TableRow>
                            ) : tableData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={colSpan} className="text-center py-8 text-gray-400">
                                        No data found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                tableData.map((row, index) => (
                                    <TableRow
                                        key={index}
                                        className={`capitalize hover:bg-transparent ${onRowClick ? 'cursor-pointer' : ''}`}
                                        onClick={() => onRowClick?.(row)}
                                    >
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.key}
                                                style={{ width: column.width }}
                                                className="px-6 py-4 text-sm text-white overflow-hidden"
                                            >
                                                <div className="truncate">
                                                    {renderCellContent(column, row)}
                                                </div>
                                            </TableCell>
                                        ))}
                                        {actions && actions.length > 0 && (
                                            <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    {actions.map((action, actionIndex) => (
                                                        action.render ? (
                                                            <React.Fragment key={actionIndex}>
                                                                {action.render(row)}
                                                            </React.Fragment>
                                                        ) : (
                                                            <button
                                                                key={actionIndex}
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    action.onClick?.(row)
                                                                }}
                                                                className={`px-3 py-1 rounded text-xs font-medium ${action.variant === 'danger'
                                                                    ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                                                    : action.variant === 'success'
                                                                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                                        : action.variant === 'warning'
                                                                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                                                            : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                                                    } ${action.className || ''}`}
                                                            >
                                                                {action.label}
                                                            </button>
                                                        )
                                                    ))}
                                                </div>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
