import React, { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function MonitoringCreate({ location, systemType }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    
    const { data, setData, post, errors, processing } = useForm({
        location: location,
        system_type: systemType,
        monitoring_date: new Date().toISOString().slice(0, 16),
        monitored_by: '',
        status: 'up',
        backup_location: '',
        backup_file: null,
        notes: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setData('backup_file', file);
            
            // Simulate upload progress (in real app, this would come from axios)
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                setUploadProgress(progress);
                if (progress >= 100) {
                    clearInterval(interval);
                }
            }, 100);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Create FormData for file upload
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (data[key] !== null && data[key] !== undefined) {
                formData.append(key, data[key]);
            }
        });
        
        post(route('monitoring.store'), {
            data: formData,
            forceFormData: true,
            onProgress: (progress) => {
                setUploadProgress(Math.round((progress.loaded / progress.total) * 100));
            }
        });
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const locationInfo = {
        BMDH: {
            name: 'BMDH',
            system: 'FBU System',
            color: '#3b82f6',
            icon: '🏥',
            bgLight: '#eff6ff'
        },
        SBAH: {
            name: 'SBAH',
            system: 'Surgical Case System',
            color: '#8b5cf6',
            icon: '⚕️',
            bgLight: '#f5f3ff'
        }
    };

    const info = locationInfo[location];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="page-header">
                    Log Monitoring Check - {info.name} ({info.system})
                </h2>
            }
        >
            <Head title="Add Monitoring Log" />

            <div className="container">
                <div className="form-container">
                    {/* Location Banner */}
                    <div className="location-banner" style={{ 
                        background: info.bgLight,
                        borderLeft: `4px solid ${info.color}`
                    }}>
                        <div className="banner-content">
                            <span className="banner-icon">{info.icon}</span>
                            <div>
                                <h3 style={{ color: info.color }}>{info.name} - {info.system}</h3>
                                <p style={{ color: '#6b7280' }}>
                                    {location === 'SBAH' 
                                        ? 'Upload backup file to ensure data safety' 
                                        : 'Log FBU system status'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="monitoring-form">
                        {/* Date and Time */}
                        <div className="form-group">
                            <label className="form-label">Date & Time *</label>
                            <input
                                type="datetime-local"
                                name="monitoring_date"
                                value={data.monitoring_date}
                                onChange={handleChange}
                                className={`form-input ${errors.monitoring_date ? 'error' : ''}`}
                            />
                            {errors.monitoring_date && (
                                <div className="form-error">{errors.monitoring_date}</div>
                            )}
                        </div>

                        {/* Monitored By */}
                        <div className="form-group">
                            <label className="form-label">Monitored By *</label>
                            <input
                                type="text"
                                name="monitored_by"
                                value={data.monitored_by}
                                onChange={handleChange}
                                className={`form-input ${errors.monitored_by ? 'error' : ''}`}
                                placeholder="Enter your name"
                            />
                            {errors.monitored_by && (
                                <div className="form-error">{errors.monitored_by}</div>
                            )}
                        </div>

                        {/* Status */}
                        <div className="form-group">
                            <label className="form-label">System Status *</label>
                            <div className="status-options">
                                <label className={`status-option ${data.status === 'up' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="status"
                                        value="up"
                                        checked={data.status === 'up'}
                                        onChange={handleChange}
                                    />
                                    <div className="status-content">
                                        <span className="status-indicator success"></span>
                                        <div>
                                            <div className="status-title">System Up</div>
                                            <div className="status-desc">All systems operational</div>
                                        </div>
                                    </div>
                                </label>
                                
                                <label className={`status-option ${data.status === 'down' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="status"
                                        value="down"
                                        checked={data.status === 'down'}
                                        onChange={handleChange}
                                    />
                                    <div className="status-content">
                                        <span className="status-indicator danger"></span>
                                        <div>
                                            <div className="status-title">System Down</div>
                                            <div className="status-desc">System unavailable or issues detected</div>
                                        </div>
                                    </div>
                                </label>
                            </div>
                            {errors.status && (
                                <div className="form-error">{errors.status}</div>
                            )}
                        </div>

                        {/* Backup Section - Only for SBAH Surgical Cases */}
                        {location === 'SBAH' && systemType === 'Surgical Case' && (
                            <div className="backup-section">
                                <h3 className="section-title">Backup Information</h3>
                                
                                {/* Backup Location */}
                                <div className="form-group">
                                    <label className="form-label">Backup Location *</label>
                                    <input
                                        type="text"
                                        name="backup_location"
                                        value={data.backup_location}
                                        onChange={handleChange}
                                        className={`form-input ${errors.backup_location ? 'error' : ''}`}
                                        placeholder="e.g., Backup Server 1, External Drive, Cloud Storage"
                                    />
                                    {errors.backup_location && (
                                        <div className="form-error">{errors.backup_location}</div>
                                    )}
                                </div>

                                {/* File Upload */}
                                <div className="form-group">
                                    <label className="form-label">Backup File</label>
                                    <div className="file-upload-area">
                                        <input
                                            type="file"
                                            id="backup_file"
                                            onChange={handleFileChange}
                                            accept=".zip,.sql,.backup,.gz,.tar,.sqlite"
                                            className="file-input"
                                        />
                                        <label htmlFor="backup_file" className="file-upload-label">
                                            <div className="upload-icon">📁</div>
                                            <div className="upload-text">
                                                {selectedFile ? (
                                                    <>
                                                        <strong>{selectedFile.name}</strong>
                                                        <span>{formatFileSize(selectedFile.size)}</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <strong>Choose a backup file</strong>
                                                        <span>or drag and drop here</span>
                                                    </>
                                                )}
                                            </div>
                                            <button type="button" className="browse-btn">
                                                Browse
                                            </button>
                                        </label>
                                    </div>

                                    {/* Upload Progress */}
                                    {uploadProgress > 0 && uploadProgress < 100 && (
                                        <div className="upload-progress">
                                            <div className="progress-bar">
                                                <div 
                                                    className="progress-fill"
                                                    style={{ width: `${uploadProgress}%` }}
                                                ></div>
                                            </div>
                                            <span className="progress-text">{uploadProgress}% uploaded</span>
                                        </div>
                                    )}

                                    {/* File Info */}
                                    {selectedFile && (
                                        <div className="file-info">
                                            <div className="file-details">
                                                <span className="file-icon">📄</span>
                                                <div>
                                                    <div className="file-name">{selectedFile.name}</div>
                                                    <div className="file-meta">
                                                        <span>Size: {formatFileSize(selectedFile.size)}</span>
                                                        <span>Type: {selectedFile.type || 'Unknown'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button 
                                                type="button" 
                                                className="remove-file"
                                                onClick={() => {
                                                    setSelectedFile(null);
                                                    setData('backup_file', null);
                                                    setUploadProgress(0);
                                                }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )}

                                    <div className="form-hint">
                                        Allowed files: ZIP, SQL, BACKUP, GZ, TAR, SQLite (max 100MB)
                                    </div>
                                    {errors.backup_file && (
                                        <div className="form-error">{errors.backup_file}</div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Notes */}
                        <div className="form-group">
                            <label className="form-label">Notes</label>
                            <textarea
                                name="notes"
                                value={data.notes}
                                onChange={handleChange}
                                rows="4"
                                className="form-textarea"
                                placeholder="Enter any additional notes or observations"
                            ></textarea>
                        </div>

                        {/* Buttons */}
                        <div className="form-actions">
                            <a
                                href={route('monitoring.dashboard')}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </a>
                            <button
                                type="submit"
                                disabled={processing}
                                className="btn btn-primary"
                            >
                                {processing ? 'Saving...' : 'Save Monitoring Log'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <style jsx>{`
                .form-container {
                    max-width: 700px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.08);
                    padding: 32px;
                }

                .location-banner {
                    padding: 20px;
                    border-radius: 12px;
                    margin-bottom: 32px;
                }

                .banner-content {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .banner-icon {
                    font-size: 32px;
                }

                .monitoring-form {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }

                .status-options {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                    margin-top: 8px;
                }

                .status-option {
                    position: relative;
                    border: 2px solid #e5e7eb;
                    border-radius: 12px;
                    padding: 16px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .status-option:hover {
                    border-color: #d1d5db;
                    background: #f9fafb;
                }

                .status-option.selected {
                    border-color: ${info.color};
                    background: ${info.bgLight};
                }

                .status-option input[type="radio"] {
                    position: absolute;
                    opacity: 0;
                }

                .status-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .status-indicator {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    display: inline-block;
                }

                .status-indicator.success {
                    background: #10b981;
                    box-shadow: 0 0 0 2px #d1fae5;
                }

                .status-indicator.danger {
                    background: #ef4444;
                    box-shadow: 0 0 0 2px #fee2e2;
                }

                .status-title {
                    font-weight: 600;
                    color: #111827;
                }

                .status-desc {
                    font-size: 12px;
                    color: #6b7280;
                }

                .backup-section {
                    background: #f9fafb;
                    border-radius: 12px;
                    padding: 24px;
                    margin: 16px 0;
                }

                .section-title {
                    font-size: 16px;
                    font-weight: 600;
                    color: #111827;
                    margin-bottom: 20px;
                }

                .file-upload-area {
                    position: relative;
                    margin-bottom: 16px;
                }

                .file-input {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    opacity: 0;
                    cursor: pointer;
                    z-index: 2;
                }

                .file-upload-label {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 24px;
                    border: 2px dashed #d1d5db;
                    border-radius: 12px;
                    background: white;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .file-upload-label:hover {
                    border-color: ${info.color};
                    background: ${info.bgLight};
                }

                .upload-icon {
                    font-size: 32px;
                }

                .upload-text {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }

                .upload-text strong {
                    color: #111827;
                    margin-bottom: 4px;
                }

                .upload-text span {
                    font-size: 12px;
                    color: #6b7280;
                }

                .browse-btn {
                    padding: 8px 16px;
                    background: ${info.color};
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: opacity 0.2s;
                }

                .browse-btn:hover {
                    opacity: 0.9;
                }

                .upload-progress {
                    margin: 16px 0;
                }

                .progress-bar {
                    width: 100%;
                    height: 8px;
                    background: #e5e7eb;
                    border-radius: 4px;
                    overflow: hidden;
                    margin-bottom: 8px;
                }

                .progress-fill {
                    height: 100%;
                    background: ${info.color};
                    transition: width 0.3s;
                }

                .progress-text {
                    font-size: 12px;
                    color: #6b7280;
                }

                .file-info {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 16px;
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    margin-top: 16px;
                }

                .file-details {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .file-icon {
                    font-size: 24px;
                }

                .file-name {
                    font-weight: 500;
                    color: #111827;
                    margin-bottom: 4px;
                }

                .file-meta {
                    display: flex;
                    gap: 16px;
                    font-size: 12px;
                    color: #6b7280;
                }

                .remove-file {
                    background: none;
                    border: none;
                    color: #9ca3af;
                    font-size: 18px;
                    cursor: pointer;
                    padding: 4px 8px;
                    border-radius: 4px;
                }

                .remove-file:hover {
                    background: #f3f4f6;
                    color: #ef4444;
                }

                .form-actions {
                    display: flex;
                    gap: 16px;
                    margin-top: 16px;
                    padding-top: 24px;
                    border-top: 1px solid #e5e7eb;
                }

                .form-actions .btn {
                    flex: 1;
                    padding: 12px;
                }

                @media (max-width: 640px) {
                    .form-container {
                        padding: 20px;
                    }

                    .status-options {
                        grid-template-columns: 1fr;
                    }

                    .file-upload-label {
                        flex-direction: column;
                        text-align: center;
                    }

                    .form-actions {
                        flex-direction: column;
                    }
                }
            `}</style>
        </AuthenticatedLayout>
    );
}