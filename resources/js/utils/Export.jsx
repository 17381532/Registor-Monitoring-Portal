import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportToExcel = (data, filename = 'report') => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Monitoring Report');
    XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const exportToPDF = (data, title = 'Monitoring Report') => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text(title, 14, 20);
    
    // Add date
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
    
    // Create table
    const tableData = data.map(item => [
        new Date(item.monitoring_date).toLocaleString(),
        item.location,
        item.system_type,
        item.monitored_by,
        item.status.toUpperCase(),
        item.backup_location || '-',
        item.notes || '-'
    ]);
    
    doc.autoTable({
        head: [['Date/Time', 'Location', 'System', 'Monitored By', 'Status', 'Backup Location', 'Notes']],
        body: tableData,
        startY: 40,
        theme: 'striped',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [59, 130, 246] },
    });
    
    doc.save(`${title.replace(/\s/g, '_')}.pdf`);
};