import React, { useState } from 'react';
import { ArrowUpDown, Search, Filter } from 'lucide-react';
import { Input } from "@/components/ui/input";

export default function DataTable({ 
    title,
    columns = [],
    data = [],
    searchable = true,
    sortable = true,
    maxRows = 10
}) {
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState(null);
    const [sortDir, setSortDir] = useState('asc');

    const filteredData = data.filter(row => {
        if (!search) return true;
        return Object.values(row).some(val => 
            String(val).toLowerCase().includes(search.toLowerCase())
        );
    });

    const sortedData = sortable && sortKey 
        ? [...filteredData].sort((a, b) => {
            const aVal = a[sortKey];
            const bVal = b[sortKey];
            if (typeof aVal === 'number') {
                return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
            }
            return sortDir === 'asc' 
                ? String(aVal).localeCompare(String(bVal))
                : String(bVal).localeCompare(String(aVal));
        })
        : filteredData;

    const displayData = sortedData.slice(0, maxRows);

    const handleSort = (key) => {
        if (sortKey === key) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDir('asc');
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {(title || searchable) && (
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    {title && <h3 className="font-semibold text-gray-900">{title}</h3>}
                    {searchable && (
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 w-48"
                            />
                        </div>
                    )}
                </div>
            )}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((col, i) => (
                                <th 
                                    key={i}
                                    className={`px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${sortable ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                                    onClick={() => sortable && handleSort(col.key)}
                                >
                                    <div className="flex items-center gap-1">
                                        {col.label}
                                        {sortable && <ArrowUpDown className="w-3 h-3 text-gray-400" />}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {displayData.map((row, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                                {columns.map((col, j) => (
                                    <td key={j} className="px-4 py-3 text-sm text-gray-700">
                                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {sortedData.length > maxRows && (
                <div className="p-3 border-t border-gray-100 text-center">
                    <span className="text-xs text-gray-500">Showing {maxRows} of {sortedData.length} records</span>
                </div>
            )}
        </div>
    );
}