"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Ticket = {
  id: string;
  title: string;
  status: "Open" | "Pending" | "Resolved" | "Closed";
  priority: "Low" | "Medium" | "High" | "Critical";
  category: string;
  assignee: {
    name: string;
    email: string;
    avatar?: string;
  };
  customer: {
    name: string;
    email: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
};

const data: Ticket[] = [
  {
    id: "TKT-7890",
    title: "Login issue with new application version",
    status: "Open",
    priority: "High",
    category: "Authentication",
    assignee: {
      name: "James Smith",
      email: "james.s@klaralyze.com",
      avatar: "/avatars/james.png",
    },
    customer: {
      name: "Emma Wilson",
      email: "emma.w@example.com",
      avatar: "/avatars/emma.png",
    },
    createdAt: "2023-05-18T09:42:30Z",
    updatedAt: "2023-05-18T10:15:45Z",
  },
  {
    id: "TKT-7889",
    title: "Cannot update profile information",
    status: "Resolved",
    priority: "Medium",
    category: "Account Management",
    assignee: {
      name: "Olivia Brown",
      email: "olivia.b@klaralyze.com",
      avatar: "/avatars/olivia.png",
    },
    customer: {
      name: "Alex Johnson",
      email: "alex.j@example.com",
      avatar: "/avatars/alex.png",
    },
    createdAt: "2023-05-17T15:22:10Z",
    updatedAt: "2023-05-18T09:33:20Z",
  },
  {
    id: "TKT-7888",
    title: "Billing discrepancy on latest invoice",
    status: "Pending",
    priority: "Medium",
    category: "Billing",
    assignee: {
      name: "Noah Williams",
      email: "noah.w@klaralyze.com",
      avatar: "/avatars/noah.png",
    },
    customer: {
      name: "Michael Chen",
      email: "michael.c@example.com",
      avatar: "/avatars/michael.png",
    },
    createdAt: "2023-05-17T12:11:05Z",
    updatedAt: "2023-05-18T08:25:15Z",
  },
  {
    id: "TKT-7887",
    title: "Feature request: Export data to CSV",
    status: "Open",
    priority: "Low",
    category: "Feature Request",
    assignee: {
      name: "Sophia Garcia",
      email: "sophia.g@klaralyze.com",
      avatar: "/avatars/sophia-g.png",
    },
    customer: {
      name: "Sophia Rodriguez",
      email: "sophia.r@example.com",
      avatar: "/avatars/sophia.png",
    },
    createdAt: "2023-05-16T09:45:30Z",
    updatedAt: "2023-05-17T14:20:45Z",
  },
  {
    id: "TKT-7886",
    title: "Error when submitting payment",
    status: "Resolved",
    priority: "Critical",
    category: "Payment",
    assignee: {
      name: "William Taylor",
      email: "william.t@klaralyze.com",
      avatar: "/avatars/william.png",
    },
    customer: {
      name: "Daniel Kim",
      email: "daniel.k@example.com",
      avatar: "/avatars/daniel.png",
    },
    createdAt: "2023-05-16T08:30:15Z",
    updatedAt: "2023-05-16T10:45:30Z",
  },
  {
    id: "TKT-7885",
    title: "Integration with third-party API not working",
    status: "Open",
    priority: "High",
    category: "Integration",
    assignee: {
      name: "Olivia Brown",
      email: "olivia.b@klaralyze.com",
      avatar: "/avatars/olivia.png",
    },
    customer: {
      name: "Lucas Martinez",
      email: "lucas.m@example.com",
      avatar: "/avatars/lucas.png",
    },
    createdAt: "2023-05-15T16:22:40Z",
    updatedAt: "2023-05-16T09:15:10Z",
  },
  {
    id: "TKT-7884",
    title: "Account locked out after password reset",
    status: "Resolved",
    priority: "High",
    category: "Security",
    assignee: {
      name: "James Smith",
      email: "james.s@klaralyze.com",
      avatar: "/avatars/james.png",
    },
    customer: {
      name: "Isabella Lee",
      email: "isabella.l@example.com",
      avatar: "/avatars/isabella.png",
    },
    createdAt: "2023-05-15T11:42:35Z",
    updatedAt: "2023-05-15T13:30:20Z",
  },
];

function getStatusColor(status: string) {
  switch (status) {
    case "Open":
      return "default";
    case "Pending":
      return "secondary";
    case "Resolved":
      return "secondary";
    case "Closed":
      return "outline";
    default:
      return "default";
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "Critical":
      return "destructive";
    case "High":
      return "destructive";
    case "Medium":
      return "secondary";
    case "Low":
      return "outline";
    default:
      return "default";
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(date);
}

export default function TicketsTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns: ColumnDef<Ticket>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "Ticket ID",
      cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <div className="max-w-[300px] truncate">{row.getValue("title")}</div>,
    },
    {
      accessorKey: "customer",
      header: "Customer",
      cell: ({ row }) => {
        const customer = row.getValue("customer") as Ticket["customer"];
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={customer.avatar} alt={customer.name} />
              <AvatarFallback>{customer.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="font-medium">{customer.name}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge variant={getStatusColor(status)}>{status}</Badge>
        );
      },
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => {
        const priority = row.getValue("priority") as string;
        return (
          <Badge variant={getPriorityColor(priority)}>{priority}</Badge>
        );
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => row.getValue("category"),
    },
    {
      accessorKey: "assignee",
      header: "Assignee",
      cell: ({ row }) => {
        const assignee = row.getValue("assignee") as Ticket["assignee"];
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={assignee.avatar} alt={assignee.name} />
              <AvatarFallback>{assignee.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="font-medium">{assignee.name}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => formatDate(row.getValue("createdAt")),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const ticket = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(ticket.id)}>
                Copy ticket ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem>Assign to</DropdownMenuItem>
              <DropdownMenuItem>Change status</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Close ticket</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Support Tickets</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search tickets..."
              value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("title")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 