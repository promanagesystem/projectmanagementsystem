import { ReactNode } from 'react';

interface AuthSimpleLayoutProps {
  title?: string;
  description?: string;
  children: ReactNode;
}

export default function AuthSimpleLayout({
  title,
  description,
  children,
}: AuthSimpleLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-neutral-900 px-4">
      <div className="w-full max-w-md space-y-6 bg-white dark:bg-neutral-800 shadow-md rounded-2xl p-8">
        {title && (
          <h1 className="text-2xl font-semibold text-center text-gray-900 dark:text-gray-100">
            {title}
          </h1>
        )}
        {description && (
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            {description}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
