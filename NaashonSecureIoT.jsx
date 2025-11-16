import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Activity, Cpu, Database, CheckCircle, Clock, Play, Pause, RefreshCw, Download, Search, Bell } from 'lucide-react';

const NaashonSecureIoT = () => {
  const [devices, setDevices] = useState([]);
  const [threats, setThreats] = useState([]);
  const [stats, setStats] = useState({
    totalDevices: 0,
    activeThreats: 0,
    blockedAttacks: 0,
    systemHealth: 99.7
  });
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [logs, setLogs] = useState([]);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const showAlert = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const updateStats = (devs, thrs) => {
    setStats({
      totalDevices: devs.length,
      activeThreats: thrs.filter(t => t.status !== 'blocked' && t.status !== 'resolved').length,
      blockedAttacks: thrs.filter(t => t.status === 'blocked').length,
      systemHealth: Math.max(95, 99.7 - (thrs.length * 0.5))
    });
  };

  const addLog = (message, type = 'info') => {
    const log = {
      id: `LOG${Date.now()}`,
      message,
      type,
      timestamp: new Date()
    };
    setLogs(prev => [log, ...prev].slice(0, 100));
  };

  useEffect(() => {
    const initialDevices = [
      { id: 'DEV001', name: 'Gateway Router', type: 'Network', status: 'secure', lastSeen: new Date(), threats: 0, location: 'Server Room' },
      { id: 'DEV002', name: 'Temperature Sensor', type: 'IoT', status: 'secure', lastSeen: new Date(), threats: 0, location: 'Office Floor 2' },
      { id: 'DEV003', name: 'Access Control', type: 'Security', status: 'warning', lastSeen: new Date(), threats: 1, location: 'Main Entrance' },
      { id: 'DEV004', name: 'Smart Camera 1', type: 'IoT', status: 'secure', lastSeen: new Date(), threats: 0, location: 'Parking Lot' },
      { id: 'DEV005', name: 'HVAC Controller', type: 'IoT', status: 'secure', lastSeen: new Date(), threats: 0, location: 'Building A' },
      { id: 'DEV006', name: 'Database Server', type: 'Network', status: 'critical', lastSeen: new Date(), threats: 3, location: 'Data Center' }
    ];
    setDevices(initialDevices);
    
    const initialThreats = [
      { id: 'THR001', device: 'DEV003', type: 'Unauthorized Access', severity: 'medium', detected: new Date(), status: 'monitoring' },
      { id: 'THR002', device: 'DEV006', type: 'DDoS Attack', severity: 'high', detected: new Date(), status: 'quarantined' },
      { id: 'THR003', device: 'DEV006', type: 'Malware Detection', severity: 'critical', detected: new Date(), status: 'blocked' }
    ];
    setThreats(initialThreats);

    updateStats(initialDevices, initialThreats);
    
    addLog('System initialized successfully', 'success');
    addLog('Zero Trust Architecture activated', 'success');
    addLog('ML anomaly detection models loaded', 'success');
    addLog('Blockchain logging enabled', 'success');
  }, []);

  const simulateThreatDetection = () => {
    const threatTypes = ['Port Scan', 'Brute Force', 'Data Exfiltration', 'Anomalous Traffic', 'Malware Signature'];
    const severities = ['low', 'medium', 'high', 'critical'];
    
    if (devices.length === 0) return;
    
    const randomDevice = devices[Math.floor(Math.random() * devices.length)];
    const newThreat = {
      id: `THR${Date.now()}`,
      device: randomDevice.id,
      type: threatTypes[Math.floor(Math.random() * threatTypes.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      detected: new Date(),
      status: 'detected'
    };

    setThreats(prev => {
      const updated = [...prev, newThreat];
      updateStats(devices, updated);
      return updated;
    });

    setDevices(prev => prev.map(d => 
      d.id === randomDevice.id 
        ? { ...d, status: 'warning', threats: (d.threats || 0) + 1 }
        : d
    ));

    addLog(`ALERT: ${newThreat.type} detected on ${randomDevice.name}`, 'error');
    showAlert(`Threat: ${newThreat.type} on ${randomDevice.name}`);
    
    setTimeout(() => respondToThreat(newThreat.id), 2000);
  };

  const respondToThreat = (threatId) => {
    setThreats(prev => prev.map(t => 
      t.id === threatId ? { ...t, status: 'quarantined' } : t
    ));
    
    addLog(`Automated: Threat ${threatId} quarantined`, 'success');
  };

  useEffect(() => {
    if (!isMonitoring) return;
    
    const interval = setInterval(() => {
      if (Math.random() > 0.85 && devices.length > 0) {
        simulateThreatDetection();
      }
      
      setDevices(prev => prev.map(d => ({
        ...d,
        lastSeen: new Date()
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, [devices, isMonitoring]);

  const manualBlock = (threatId) => {
    setThreats(prev => {
      const updated = prev.map(t => 
        t.id === threatId ? { ...t, status: 'blocked' } : t
      );
      updateStats(devices, updated);
      return updated;
    });
    addLog(`Manual: Threat ${threatId} blocked`, 'success');
    showAlert(`Threat ${threatId} blocked`);
  };

  const resolveDevice = (deviceId) => {
    const device = devices.find(d => d.id === deviceId);
    setDevices(prev => prev.map(d => 
      d.id === deviceId ? { ...d, status: 'secure', threats: 0 } : d
    ));
    setThreats(prev => prev.filter(t => t.device !== deviceId));
    addLog(`Device ${deviceId} secured`, 'success');
    showAlert(`${device?.name} secured`);
  };

  const resetSystem = () => {
    setThreats([]);
    setDevices(prev => prev.map(d => ({ ...d, status: 'secure', threats: 0 })));
    addLog('System reset', 'info');
    showAlert('System reset');
    updateStats(devices, []);
  };

  const exportLogs = () => {
    const logData = logs.map(log => 
      `[${log.timestamp.toLocaleString()}] ${log.message}`
    ).join('\n');
    
    const blob = new Blob([logData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    addLog('Logs exported', 'success');
    showAlert('Logs exported');
  };

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
    addLog(isMonitoring ? 'Monitoring paused' : 'Monitoring resumed', 'info');
    showAlert(isMonitoring ? 'Paused' : 'Resumed');
  };

  const getStatusColor = (status) => {
    if (status === 'secure') return 'bg-green-500';
    if (status === 'warning') return 'bg-yellow-500';
    if (status === 'critical') return 'bg-red-500';
    return 'bg-gray-500';
  };

  const getSeverityColor = (severity) => {
    if (severity === 'low') return 'bg-blue-900 text-blue-300';
    if (severity === 'medium') return 'bg-yellow-900 text-yellow-300';
    if (severity === 'high') return 'bg-orange-900 text-orange-300';
    if (severity === 'critical') return 'bg-red-900 text-red-300';
    return 'bg-gray-900 text-gray-300';
  };

  const filteredThreats = threats.filter(threat => {
    const matchesSeverity = filterSeverity === 'all' || threat.severity === filterSeverity;
    const matchesSearch = threat.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          threat.device.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const filteredDevices = devices.filter(device => 
    device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white">
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 bg-blue-600 px-6 py-4 rounded-lg shadow-2xl flex items-center space-x-3">
          <Bell className="w-5 h-5" />
          <span className="font-medium">{notificationMessage}</span>
        </div>
      )}

      <header className="bg-gradient-to-r from-blue-900 to-purple-900 shadow-2xl border-b border-blue-500">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500 p-3 rounded-xl">
                <Shield className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">NaashonSecureIoT</h1>
                <p className="text-sm text-blue-200">MTAC Cybersecurity Framework</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-black bg-opacity-30 px-4 py-2 rounded-lg">
                <p className="text-xs text-gray-300">System Health</p>
                <p className="text-lg font-bold text-green-400">{stats.systemHealth.toFixed(1)}%</p>
              </div>
              <button 
                onClick={toggleMonitoring}
                className={`p-3 rounded-lg transition-all ${isMonitoring ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-600 hover:bg-yellow-700'}`}
              >
                {isMonitoring ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <div className={`w-4 h-4 rounded-full ${isMonitoring ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`}></div>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-black bg-opacity-40 backdrop-blur-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between py-2">
            <div className="flex space-x-2">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: Activity },
                { id: 'devices', label: 'Devices', icon: Cpu },
                { id: 'threats', label: 'Threats', icon: AlertTriangle },
                { id: 'logs', label: 'Logs', icon: Database }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`px-6 py-3 font-medium transition-all flex items-center space-x-2 rounded-t-lg ${
                      selectedTab === tab.id 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={resetSystem}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="text-sm">Reset</span>
              </button>
              <button
                onClick={exportLogs}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-all flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm">Export</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        {selectedTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 shadow-2xl hover:scale-105 transition-all cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-200 text-sm">Total Devices</p>
                    <p className="text-4xl font-bold mt-2">{stats.totalDevices}</p>
                  </div>
                  <Cpu className="w-16 h-16 text-blue-300 opacity-30" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-2xl p-6 shadow-2xl hover:scale-105 transition-all cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-200 text-sm">Active Threats</p>
                    <p className="text-4xl font-bold mt-2">{stats.activeThreats}</p>
                  </div>
                  <AlertTriangle className="w-16 h-16 text-red-300 opacity-30" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-6 shadow-2xl hover:scale-105 transition-all cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-200 text-sm">Blocked Attacks</p>
                    <p className="text-4xl font-bold mt-2">{stats.blockedAttacks}</p>
                  </div>
                  <Shield className="w-16 h-16 text-green-300 opacity-30" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 shadow-2xl hover:scale-105 transition-all cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200 text-sm">System Health</p>
                    <p className="text-4xl font-bold mt-2">{stats.systemHealth.toFixed(1)}%</p>
                  </div>
                  <Activity className="w-16 h-16 text-purple-300 opacity-30" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Database className="w-7 h-7 mr-3 text-blue-400" />
                Hybrid Framework Architecture
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[
                  { name: 'Device Layer', features: ['AES-256', 'Sensors', 'Edge'] },
                  { name: 'Edge Layer', features: ['ML Detection', '97.3% Accuracy', 'Real-time'] },
                  { name: 'Network', features: ['Zero Trust', 'MQTT/TLS', 'MFA'] },
                  { name: 'Blockchain', features: ['Immutable', 'Smart Contracts', 'Ledger'] },
                  { name: 'Cloud', features: ['AI Analytics', 'Dashboard', 'Management'] }
                ].map((layer, i) => (
                  <div key={i} className="bg-gray-800 p-5 rounded-xl border-2 border-gray-600 hover:border-blue-500 transition-all">
                    <h3 className="font-bold mb-3">{layer.name}</h3>
                    {layer.features.map((f, j) => (
                      <p key={j} className="text-xs text-gray-300 mb-1">{f}</p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'devices' && (
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center">
                <Cpu className="w-7 h-7 mr-3 text-blue-400" />
                Connected Devices
              </h2>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-700 rounded-lg text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredDevices.map(device => (
                <div key={device.id} className="bg-gray-700 p-5 rounded-xl border border-gray-600 hover:border-blue-500 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`w-4 h-4 rounded-full mt-1 ${getStatusColor(device.status)}`}></div>
                      <div className="flex-1">
                        <p className="font-bold text-lg">{device.name}</p>
                        <p className="text-sm text-gray-400">{device.id} - {device.type}</p>
                        <p className="text-xs text-gray-500 mt-1">{device.location}</p>
                        <p className="text-xs mt-2">Last: {device.lastSeen.toLocaleTimeString()}</p>
                      </div>
                    </div>
                    {device.threats > 0 ? (
                      <button 
                        onClick={() => resolveDevice(device.id)}
                        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm transition-all flex items-center space-x-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Secure</span>
                      </button>
                    ) : (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'threats' && (
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center">
                <AlertTriangle className="w-7 h-7 mr-3 text-red-400" />
                Detected Threats
              </h2>
              <div className="flex space-x-3">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-4 py-2 bg-gray-700 rounded-lg text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="px-4 py-2 bg-gray-700 rounded-lg text-white border border-gray-600 focus:outline-none"
                >
                  <option value="all">All</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
            <div className="space-y-4">
              {filteredThreats.map(threat => (
                <div key={threat.id} className="bg-gray-700 p-5 rounded-xl border border-gray-600 hover:border-red-500 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <p className="font-bold text-lg">{threat.type}</p>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getSeverityColor(threat.severity)}`}>
                          {threat.severity}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          threat.status === 'blocked' ? 'bg-green-600' :
                          threat.status === 'quarantined' ? 'bg-yellow-600' :
                          'bg-red-600'
                        }`}>
                          {threat.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">Device: {threat.device}</p>
                      <p className="text-xs text-gray-500 mt-1">{threat.detected.toLocaleString()}</p>
                    </div>
                    {threat.status !== 'blocked' && (
                      <button 
                        onClick={() => manualBlock(threat.id)}
                        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm transition-all"
                      >
                        Block
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'logs' && (
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Database className="w-7 h-7 mr-3 text-blue-400" />
              System Logs
            </h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {logs.map(log => (
                <div key={log.id} className="bg-gray-700 p-3 rounded flex items-start space-x-3">
                  <Clock className="w-4 h-4 mt-1 text-gray-400" />
                  <div className="flex-1">
                    <p className={`text-sm ${
                      log.type === 'error' ? 'text-red-400' :
                      log.type === 'success' ? 'text-green-400' :
                      'text-gray-300'
                    }`}>
                      {log.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{log.timestamp.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default NaashonSecureIoT;
