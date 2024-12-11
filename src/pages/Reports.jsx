import axios from 'axios';

const Reports = () => {
  const handleDownload = async (type) => {
    try{
    const response = await axios.get(`/api/reports?format=${type}`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `report.${type}`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    } catch (error) {
        console.error('Error downloading report:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Reportes</h1>
      <div className="flex gap-4">
        <button
          onClick={() => handleDownload('pdf')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Descargar PDF
        </button>
        <button
          onClick={() => handleDownload('csv')}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Descargar CSV
        </button>
      </div>
    </div>
  );
};

export default Reports;