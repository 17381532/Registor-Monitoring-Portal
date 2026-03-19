import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function MonitoringDashboard({ stats = {}, recentLogs = [], recentBackups = [] }) {
    const getStatusColor = (status) => {
        switch(status) {
            case 'up': return '#10b981';
            case 'down': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const getStatusBgColor = (status) => {
        switch(status) {
            case 'up': return '#d1fae5';
            case 'down': return '#fee2e2';
            default: return '#f3f4f6';
        }
    };

    const formatFileSize = (bytes) => {
        if (!bytes || bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="dashboard-header">
                    <h1 className="page-title">System Monitoring Dashboard</h1>
                    <div className="header-actions">
                        <Link
                            href={route('monitoring.create', { location: 'BMDH' })}
                            className="btn btn-primary"
                        >
                            <span className="btn-icon">🏥</span>
                            Log FBU (BMDH)
                        </Link>
                        <Link
                            href={route('monitoring.create', { location: 'SBAH' })}
                            className="btn btn-secondary"
                        >
                            <span className="btn-icon">⚕️</span>
                            Log Surgical Case (SBAH)
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Monitoring Dashboard" />

            <div className="dashboard-container">
                {/* Location Status Cards */}
                <div className="status-cards-grid">
                    {/* BMDH - FBU Card */}
                    <div className="status-card">
                        <div className="card-header" style={{ borderLeftColor: '#3b82f6' }}>
                            <div className="location-info">
                                <span className="location-icon">🏥</span>
                                <div>
                                    <h2 className="location-name">BMDH - FBU System</h2>
                                    <p className="last-checked">
                                        Last checked: {recentLogs.find(l => l?.location === 'BMDH')?.monitoring_date 
                                            ? new Date(recentLogs.find(l => l.location === 'BMDH').monitoring_date).toLocaleString() 
                                            : 'No data'}
                                    </p>
                                </div>
                            </div>
                            <div 
                                className="status-badge"
                                style={{
                                    background: getStatusBgColor(stats.current_status?.bmdh_fbu || 'unknown'),
                                    color: getStatusColor(stats.current_status?.bmdh_fbu || 'unknown')
                                }}
                            >
                                <span className={`status-dot ${stats.current_status?.bmdh_fbu || 'unknown'}`}></span>
                                {(stats.current_status?.bmdh_fbu || 'unknown').toUpperCase()}
                            </div>
                        </div>
                        
                        <div className="card-stats">
                            <div className="stat-item">
                                <span className="stat-label">Today's Checks</span>
                                <span className="stat-value">{stats.today_bmdh || 0}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Uptime</span>
                                <span className="stat-value" style={{ color: '#10b981' }}>
                                    {stats.uptime_percentage?.bmdh || 0}%
                                </span>
                            </div>
                            <div className="stat-item">
                                <Link href={route('monitoring.index', { location: 'BMDH' })} className="view-link">
                                    View All →
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* SBAH - Surgical Case Card */}
                    <div className="status-card">
                        <div className="card-header" style={{ borderLeftColor: '#8b5cf6' }}>
                            <div className="location-info">
                                <span className="location-icon">⚕️</span>
                                <div>
                                    <h2 className="location-name">SBAH - Surgical Case System</h2>
                                    <p className="last-checked">
                                        Last checked: {recentLogs.find(l => l?.location === 'SBAH')?.monitoring_date 
                                            ? new Date(recentLogs.find(l => l.location === 'SBAH').monitoring_date).toLocaleString() 
                                            : 'No data'}
                                    </p>
                                </div>
                            </div>
                            <div 
                                className="status-badge"
                                style={{
                                    background: getStatusBgColor(stats.current_status?.sbah_surgical || 'unknown'),
                                    color: getStatusColor(stats.current_status?.sbah_surgical || 'unknown')
                                }}
                            >
                                <span className={`status-dot ${stats.current_status?.sbah_surgical || 'unknown'}`}></span>
                                {(stats.current_status?.sbah_surgical || 'unknown').toUpperCase()}
                            </div>
                        </div>
                        
                        <div className="card-stats">
                            <div className="stat-item">
                                <span className="stat-label">Today's Checks</span>
                                <span className="stat-value">{stats.today_sbah || 0}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Uptime</span>
                                <span className="stat-value" style={{ color: '#10b981' }}>
                                    {stats.uptime_percentage?.sbah || 0}%
                                </span>
                            </div>
                            <div className="stat-item">
                                <Link href={route('monitoring.index', { location: 'SBAH' })} className="view-link">
                                    View All →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Backup Statistics */}
                <div className="backup-stats-card">
                    <div className="backup-stats-header">
                        <h3 className="section-title">
                            <span className="section-icon">💾</span>
                            Backup Overview
                        </h3>
                        <Link href={route('monitoring.index', { location: 'SBAH' })} className="view-all-link">
                            View All Backups →
                        </Link>
                    </div>
                    <div className="backup-stats-grid">
                        <div className="backup-stat-item">
                            <span className="stat-label">Total Backups</span>
                            <span className="stat-value">{stats.total_backups || 0}</span>
                        </div>
                        <div className="backup-stat-item">
                            <span className="stat-label">Total Size</span>
                            <span className="stat-value">{formatFileSize(stats.total_backup_size || 0)}</span>
                        </div>
                        <div className="backup-stat-item">
                            <span className="stat-label">Latest Backup</span>
                            <span className="stat-value">
                                {recentBackups.length > 0 
                                    ? new Date(recentBackups[0].monitoring_date).toLocaleDateString()
                                    : 'No backups'
                                }
                            </span>
                        </div>
                    </div>
                </div>

                {/* Recent Backups */}
                {recentBackups.length > 0 && (
                    <div className="recent-backups-section">
                        <h3 className="section-title">
                            <span className="section-icon">📦</span>
                            Recent Backups
                        </h3>
                        <div className="backups-grid">
                            {recentBackups.map((backup) => (
                                <div key={backup.id} className="backup-card">
                                    <div className="backup-icon">💾</div>
                                    <div className="backup-info">
                                        <div className="backup-name">{backup.backup_file_name || 'Backup File'}</div>
                                        <div className="backup-meta">
                                            <span>{new Date(backup.monitoring_date).toLocaleString()}</span>
                                            <span>{formatFileSize(backup.backup_file_size)}</span>
                                        </div>
                                        <div className="backup-location">📍 {backup.backup_location || 'Location not specified'}</div>
                                    </div>
                                    {backup.backup_file && (
                                        <a 
                                            href={route('monitoring.download-backup', backup.id)}
                                            className="download-btn"
                                            title="Download Backup"
                                        >
                                            ⬇️
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recent Activity */}
                <div className="recent-activity-section">
                    <h3 className="section-title">
                        <span className="section-icon">📋</span>
                        Recent Monitoring Activity
                    </h3>
                    <div className="activity-list">
                        {recentLogs.length > 0 ? (
                            recentLogs.map((log) => (
                                <div key={log.id} className="activity-item">
                                    <div className="activity-indicator">
                                        <span className={`status-dot ${log.status}`}></span>
                                    </div>
                                    <div className="activity-content">
                                        <div className="activity-header">
                                            <span className="activity-location">{log.location}</span>
                                            <span className="activity-system">{log.system_type}</span>
                                            <span className="activity-status" style={{
                                                color: getStatusColor(log.status),
                                                background: getStatusBgColor(log.status)
                                            }}>
                                                {log.status.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="activity-details">
                                            <span>👤 {log.monitored_by}</span>
                                            <span>🕒 {new Date(log.monitoring_date).toLocaleString()}</span>
                                        </div>
                                        {log.backup_location && (
                                            <div className="activity-backup">
                                                💾 Backup: {log.backup_location}
                                            </div>
                                        )}
                                    </div>
                                    <Link href={route('monitoring.edit', log.id)} className="activity-edit">
                                        Edit
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <p>No monitoring activity yet.</p>
                                <p className="empty-state-hint">Start by adding your first monitoring check!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .dashboard-container {
                    max-width: 1280px;
                    margin: 0 auto;
                    padding: 24px;
                }

                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 16px;
                }

                .page-title {
                    font-size: 24px;
                    font-weight: 600;
                    color: #111827;
                    margin: 0;
                }

                .header-actions {
                    display: flex;
                    gap: 12px;
                }

                .btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 20px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 500;
                    text-decoration: none;
                    transition: all 0.2s;
                }

                .btn-primary {
                    background: #3b82f6;
                    color: white;
                }

                .btn-primary:hover {
                    background: #2563eb;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
                }

                .btn-secondary {
                    background: #8b5cf6;
                    color: white;
                }

                .btn-secondary:hover {
                    background: #7c3aed;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
                }

                .btn-icon {
                    font-size: 16px;
                }

                .status-cards-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                    gap: 24px;
                    margin-bottom: 32px;
                }

                .status-card {
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
                    overflow: hidden;
                    transition: all 0.3s;
                }

                .status-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
                }

                .card-header {
                    padding: 20px;
                    border-left: 4px solid;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }

                .location-info {
                    display: flex;
                    gap: 12px;
                }

                .location-icon {
                    font-size: 32px;
                }

                .location-name {
                    font-size: 18px;
                    font-weight: 600;
                    color: #111827;
                    margin: 0 0 4px 0;
                }

                .last-checked {
                    font-size: 12px;
                    color: #6b7280;
                    margin: 0;
                }

                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                }

                .status-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    display: inline-block;
                }

                .status-dot.up {
                    background: #10b981;
                    box-shadow: 0 0 0 2px #d1fae5;
                }

                .status-dot.down {
                    background: #ef4444;
                    box-shadow: 0 0 0 2px #fee2e2;
                }

                .status-dot.unknown {
                    background: #6b7280;
                    box-shadow: 0 0 0 2px #e5e7eb;
                }

                .card-stats {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    padding: 16px 20px;
                    background: #f9fafb;
                    border-top: 1px solid #e5e7eb;
                }

                .stat-item {
                    display: flex;
                    flex-direction: column;
                }

                .stat-label {
                    font-size: 12px;
                    color: #6b7280;
                    margin-bottom: 4px;
                }

                .stat-value {
                    font-size: 20px;
                    font-weight: 600;
                    color: #111827;
                }

                .view-link {
                    color: #3b82f6;
                    text-decoration: none;
                    font-size: 13px;
                    font-weight: 500;
                }

                .view-link:hover {
                    text-decoration: underline;
                }

                .backup-stats-card {
                    background: white;
                    border-radius: 16px;
                    padding: 24px;
                    margin-bottom: 32px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
                }

                .backup-stats-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }

                .section-title {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 18px;
                    font-weight: 600;
                    color: #111827;
                    margin: 0;
                }

                .section-icon {
                    font-size: 20px;
                }

                .view-all-link {
                    color: #8b5cf6;
                    text-decoration: none;
                    font-size: 14px;
                    font-weight: 500;
                }

                .view-all-link:hover {
                    text-decoration: underline;
                }

                .backup-stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 24px;
                }

                .backup-stat-item {
                    text-align: center;
                    padding: 16px;
                    background: #f9fafb;
                    border-radius: 12px;
                }

                .recent-backups-section {
                    margin-bottom: 32px;
                }

                .backups-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                    gap: 16px;
                    margin-top: 16px;
                }

                .backup-card {
                    background: white;
                    border-radius: 12px;
                    padding: 16px;
                    border: 1px solid #e5e7eb;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    transition: all 0.2s;
                }

                .backup-card:hover {
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                    transform: translateY(-2px);
                    border-color: #8b5cf6;
                }

                .backup-icon {
                    font-size: 32px;
                }

                .backup-info {
                    flex: 1;
                }

                .backup-name {
                    font-weight: 600;
                    color: #111827;
                    margin-bottom: 4px;
                    word-break: break-word;
                }

                .backup-meta {
                    display: flex;
                    gap: 12px;
                    font-size: 12px;
                    color: #6b7280;
                    margin-bottom: 4px;
                }

                .backup-location {
                    font-size: 12px;
                    color: #8b5cf6;
                }

                .download-btn {
                    padding: 8px;
                    background: #f3f4f6;
                    border-radius: 8px;
                    color: #4b5563;
                    text-decoration: none;
                    font-size: 18px;
                    transition: all 0.2s;
                }

                .download-btn:hover {
                    background: #8b5cf6;
                    color: white;
                }

                .recent-activity-section {
                    background: white;
                    border-radius: 16px;
                    padding: 24px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
                }

                .activity-list {
                    margin-top: 16px;
                }

                .activity-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 16px;
                    padding: 16px;
                    border-bottom: 1px solid #e5e7eb;
                    transition: background 0.2s;
                }

                .activity-item:hover {
                    background: #f9fafb;
                }

                .activity-item:last-child {
                    border-bottom: none;
                }

                .activity-indicator {
                    padding-top: 4px;
                }

                .activity-content {
                    flex: 1;
                }

                .activity-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 8px;
                    flex-wrap: wrap;
                }

                .activity-location {
                    font-weight: 600;
                    color: #111827;
                }

                .activity-system {
                    font-size: 13px;
                    color: #6b7280;
                }

                .activity-status {
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 11px;
                    font-weight: 600;
                }

                .activity-details {
                    display: flex;
                    gap: 16px;
                    font-size: 13px;
                    color: #6b7280;
                    margin-bottom: 4px;
                }

                .activity-backup {
                    font-size: 12px;
                    color: #8b5cf6;
                    background: #f5f3ff;
                    padding: 4px 8px;
                    border-radius: 6px;
                    display: inline-block;
                }

                .activity-edit {
                    color: #3b82f6;
                    text-decoration: none;
                    font-size: 13px;
                    font-weight: 500;
                }

                .activity-edit:hover {
                    text-decoration: underline;
                }

                .empty-state {
                    text-align: center;
                    padding: 48px;
                    color: #6b7280;
                }

                .empty-state p {
                    margin: 0 0 8px 0;
                }

                .empty-state-hint {
                    font-size: 14px;
                    color: #9ca3af;
                }

                @media (max-width: 768px) {
                    .dashboard-container {
                        padding: 16px;
                    }

                    .dashboard-header {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .header-actions {
                        flex-direction: column;
                    }

                    .btn {
                        justify-content: center;
                    }

                    .status-cards-grid {
                        grid-template-columns: 1fr;
                    }

                    .card-stats {
                        grid-template-columns: 1fr;
                        gap: 12px;
                    }

                    .backup-stats-grid {
                        grid-template-columns: 1fr;
                    }

                    .backups-grid {
                        grid-template-columns: 1fr;
                    }

                    .activity-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 8px;
                    }

                    .activity-details {
                        flex-direction: column;
                        gap: 4px;
                    }
                }
            `}</style>
        </AuthenticatedLayout>
    );
}