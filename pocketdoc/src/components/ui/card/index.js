import React from 'react';

export const Card = ({ children, className }) => (
  <div className={`bg-white shadow rounded-lg ${className || ''}`}>{children}</div>
);

export const CardHeader = ({ children }) => (
  <div className="px-6 py-4 border-b">{children}</div>
);

export const CardTitle = ({ children }) => (
  <h3 className="text-lg font-medium">{children}</h3>
);

export const CardContent = ({ children }) => (
  <div className="px-6 py-4">{children}</div>
);