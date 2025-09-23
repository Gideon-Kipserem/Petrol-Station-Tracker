// Gideon
// NotificationsDropdown: shows a bell badge and a dropdown list of notifications.
// - Props:
//   notifications: Array<{ id: string, text: string, read: boolean, time?: string }>
//   onMarkRead: (id: string) => void
//   onClearAll: () => void
//   open: boolean
//   onToggle: () => void
// This is UI-only; persistence is handled by parent via localStorage.

import React from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';

export default function NotificationsDropdown({ notifications, onMarkRead, onClearAll, open, onToggle }) {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      {/* Bell button with unread badge */}
      <button onClick={onToggle} className="text-gray-400 hover:text-gray-500 relative">
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-medium">{unreadCount}</span>
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-900">Notifications</p>
            <button onClick={onClearAll} className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1">
              <Trash2 className="h-3 w-3" /> Clear all
            </button>
          </div>

          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500">No notifications</p>
          ) : (
            <ul className="max-h-64 overflow-y-auto space-y-2">
              {notifications.map((n) => (
                <li key={n.id} className="border border-gray-100 rounded-md p-2 flex items-start justify-between">
                  <div>
                    <p className={`text-sm ${n.read ? 'text-gray-500' : 'text-gray-900 font-medium'}`}>{n.text}</p>
                    {n.time && <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>}
                  </div>
                  {!n.read && (
                    <button
                      onClick={() => onMarkRead(n.id)}
                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <Check className="h-3 w-3" /> Mark read
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
