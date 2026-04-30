import * as React from "react";

export const Table = ({ children }: { children: React.ReactNode }) => (
  <div className="relative w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
      {children}
    </table>
  </div>
);

export const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <thead className="bg-gray-100 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 text-xs uppercase">
    {children}
  </thead>
);

export const TableBody = ({ children }: { children: React.ReactNode }) => (
  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">{children}</tbody>
);

export const TableRow = ({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr
    className={`transition hover:bg-gray-50 dark:hover:bg-gray-800/50 ${className}`}
    {...props}
  >
    {children}
  </tr>
);

export const TableHead = ({
  children,
  className = "",
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th className={`px-4 py-3 font-semibold ${className}`} {...props}>
    {children}
  </th>
);

export const TableCell = ({
  children,
  className = "",
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={`px-4 py-3 ${className}`} {...props}>
    {children}
  </td>
);
