'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Task } from '@/types/task';

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'in-progress' | 'completed'>('all');
  const [qrCode, setQrCode] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Backend API URL
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

  const checkConnection = async () => {
    try {
      const res = await fetch(`${API_URL}/api/whatsapp/connect`);
      const data = await res.json();
      setConnected(data.connected);
    } catch (error) {
      console.error('Failed to check connection:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_URL}/api/tasks`);
      const data = await res.json();
      setTasks(data.tasks);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      setLoading(false);
    }
  };

  // Check connection status on mount and periodically
  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch tasks periodically
  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connectWhatsApp = async () => {
    try {
      setShowQR(true);
      setIsAuthenticating(false);
      setQrCode('');
      await fetch(`${API_URL}/api/whatsapp/connect`, { method: 'POST' });

      let previousQrCode = '';

      // Start polling for QR code
      const qrInterval = setInterval(async () => {
        try {
          const qrRes = await fetch(`${API_URL}/api/whatsapp/qr`);
          const qrData = await qrRes.json();

          if (qrData.qr) {
            setQrCode(qrData.qr);
            previousQrCode = qrData.qr;
          } else if (previousQrCode && !qrData.qr) {
            // QR code disappeared, likely authenticating
            setIsAuthenticating(true);
          }

          // Check if connected
          const connRes = await fetch(`${API_URL}/api/whatsapp/connect`);
          const connData = await connRes.json();

          if (connData.connected) {
            setConnected(true);
            setShowQR(false);
            setQrCode('');
            setIsAuthenticating(false);
            clearInterval(qrInterval);
          }
        } catch (error) {
          console.error('Error during polling:', error);
        }
      }, 2000);

      // Stop polling after 2 minutes
      setTimeout(() => {
        clearInterval(qrInterval);
        if (!connected) {
          setShowQR(false);
          setIsAuthenticating(false);
          alert('Connection timeout. Please try again.');
        }
      }, 120000);
    } catch (error) {
      console.error('Failed to connect:', error);
      alert('Failed to connect to WhatsApp');
      setShowQR(false);
      setIsAuthenticating(false);
    }
  };

  const updateTaskStatus = async (id: string, status: Task['status']) => {
    try {
      await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchTasks();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await fetch(`${API_URL}/api/tasks/${id}`, { method: 'DELETE' });
      fetchTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const stats = {
    total: tasks.length,
    new: tasks.filter(t => t.status === 'new').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'scheduling': return '📅';
      case 'follow-up': return '🔔';
      case 'status-update': return '📊';
      default: return '💬';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4 text-center">
              {isAuthenticating ? 'Authenticating...' : 'Scan QR Code'}
            </h2>
            {isAuthenticating ? (
              <div className="flex flex-col items-center py-8">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mb-4"></div>
                <p className="text-gray-700 font-medium text-lg mb-2">Connecting to WhatsApp</p>
                <p className="text-sm text-gray-500 text-center">
                  Your device has been authenticated.<br />
                  Please wait while we establish the connection...
                </p>
              </div>
            ) : qrCode ? (
              <div className="flex flex-col items-center">
                <div className="bg-white p-4 rounded-lg border-2 border-gray-200 mb-4">
                  <Image
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrCode)}`}
                    alt="WhatsApp QR Code"
                    width={256}
                    height={256}
                    className="w-64 h-64"
                  />
                </div>
                <p className="text-center text-gray-600 mb-2">
                  Open WhatsApp on your phone
                </p>
                <ol className="text-sm text-gray-500 space-y-1 mb-4">
                  <li>1. Go to Settings → Linked Devices</li>
                  <li>2. Tap &quot;Link a Device&quot;</li>
                  <li>3. Scan this QR code</li>
                </ol>
                <button
                  onClick={() => setShowQR(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
                <p className="text-gray-600">Generating QR code...</p>
                <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Akashi WhatsApp</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600">
                  {connected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              {!connected && (
                <button
                  onClick={connectWhatsApp}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                >
                  Connect WhatsApp
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-sm text-gray-600 mb-1">Total Tasks</div>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-sm text-gray-600 mb-1">New</div>
            <div className="text-3xl font-bold text-blue-600">{stats.new}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-sm text-gray-600 mb-1">In Progress</div>
            <div className="text-3xl font-bold text-yellow-600">{stats.inProgress}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-sm text-gray-600 mb-1">Completed</div>
            <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="flex gap-2">
            {(['all', 'new', 'in-progress', 'completed'] as const).map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading tasks...</div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border">
              <div className="text-gray-500 mb-2">No tasks found</div>
              <div className="text-sm text-gray-400">
                {connected
                  ? 'Tasks will appear here when action items are detected in WhatsApp messages'
                  : 'Connect WhatsApp to start detecting tasks'}
              </div>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div key={task.id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{getCategoryIcon(task.category)}</span>
                      <h3 className="text-lg font-semibold text-gray-900">{task.candidateName}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{task.candidateNumber}</p>
                    <p className="text-gray-800 mb-3">{task.taskDescription}</p>
                    <div className="text-xs text-gray-500">
                      {new Date(task.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  {task.status !== 'completed' && (
                    <>
                      {task.status === 'new' && (
                        <button
                          onClick={() => updateTaskStatus(task.id, 'in-progress')}
                          className="px-3 py-1.5 bg-yellow-600 text-white rounded text-sm font-medium hover:bg-yellow-700"
                        >
                          Start
                        </button>
                      )}
                      <button
                        onClick={() => updateTaskStatus(task.id, 'completed')}
                        className="px-3 py-1.5 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700"
                      >
                        Complete
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="px-3 py-1.5 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
