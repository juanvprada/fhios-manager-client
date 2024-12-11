import axios from 'axios';

const Reports = () => {
  const handleDownload = async (type) => {
    const response = await axios.get(`/api/reports?format=${type}`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `report.${type}`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Reports</h1>
      <button onClick={() => handleDownload('pdf')} className="btn">
        Download PDF
      </button>
      <button onClick={() => handleDownload('csv')} className="btn">
        Download CSV
      </button>
    </div>
  );
};

export default Reports;
