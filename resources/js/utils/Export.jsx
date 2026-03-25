import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportToExcel = (data, filename = 'monitoring_report') => {
    // Prepare data for Excel
    const exportData = data.map(item => ({
        'Date/Time': new Date(item.monitoring_date).toLocaleString(),
        'Location': item.location,
        'System': item.system_type,
        'Monitored By': item.monitored_by,
        'Status': item.status.toUpperCase(),
        'Backup Location': item.backup_location || '-',
        'Backup File': item.backup_file_name || '-',
        'Response Time': item.response_time_ms ? `${item.response_time_ms}ms` : '-',
        'Notes': item.notes || '-',
        'Created At': new Date(item.created_at).toLocaleString()
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    
    // Auto-size columns
    const maxWidth = 50;
    const wscols = Object.keys(exportData[0] || {}).map(() => ({ wch: 20 }));
    worksheet['!cols'] = wscols;
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Monitoring Logs');
    XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportToPDF = (data, title = 'Monitoring Report', filters = {}) => {
    const doc = new jsPDF('landscape', 'mm', 'a4');
    
    // Add title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 14, 20);
    
    // Add subtitle
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
    
    // Add filters info if any
    let yPos = 35;
    if (Object.keys(filters).length > 0) {
        doc.setFontSize(9);
        doc.text('Filters applied:', 14, yPos);
        yPos += 5;
        
        const filterLines = [];
        if (filters.location) filterLines.push(`Location: ${filters.location}`);
        if (filters.system_type) filterLines.push(`System: ${filters.system_type}`);
        if (filters.date_from) filterLines.push(`From: ${filters.date_from}`);
        if (filters.date_to) filterLines.push(`To: ${filters.date_to}`);
        if (filters.status) filterLines.push(`Status: ${filters.status}`);
        
        doc.text(filterLines.join(' • '), 14, yPos);
        yPos += 8;
    } else {
        yPos = 35;
    }
    
    // Prepare table data
    const tableData = data.map(item => [
        new Date(item.monitoring_date).toLocaleString(),
        item.location,
        item.system_type,
        item.monitored_by,
        item.status.toUpperCase(),
        item.backup_location || '-',
        item.backup_file_name ? item.backup_file_name.substring(0, 30) : '-',
        item.response_time_ms ? `${item.response_time_ms}ms` : '-',
        item.notes ? (item.notes.length > 50 ? item.notes.substring(0, 50) + '...' : item.notes) : '-'
    ]);
    
    // Add table
    doc.autoTable({
        head: [['Date/Time', 'Location', 'System', 'Monitored By', 'Status', 'Backup Location', 'Backup File', 'Response Time', 'Notes']],
        body: tableData,
        startY: yPos,
        theme: 'striped',
        styles: {
            fontSize: 8,
            cellPadding: 2,
            overflow: 'linebreak'
        },
        headStyles: {
            fillColor: [59, 130, 246],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245]
        },
        columnStyles: {
            0: { cellWidth: 35 }, // Date/Time
            1: { cellWidth: 20 }, // Location
            2: { cellWidth: 25 }, // System
            3: { cellWidth: 25 }, // Monitored By
            4: { cellWidth: 15 }, // Status
            5: { cellWidth: 30 }, // Backup Location
            6: { cellWidth: 40 }, // Backup File
            7: { cellWidth: 20 }, // Response Time
            8: { cellWidth: 50 }  // Notes
        }
    });
    
    // Add page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10);
    }
    
    doc.save(`${title.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportCurrentView = (data, format = 'excel', filters = {}) => {
    if (format === 'excel') {
        exportToExcel(data, 'monitoring_report');
    } else if (format === 'pdf') {
        exportToPDF(data, 'Monitoring Report', filters);
    }
};