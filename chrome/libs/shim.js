// Let the jsPDF UMD bundle create a clean global export.
if (typeof self !== 'undefined' && self.jspdf) {
    delete self.jspdf;
}
if (typeof window !== 'undefined' && window.jspdf) {
    delete window.jspdf;
}
