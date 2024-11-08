import { formatDate, getCurrentUTCTime } from '@/app/lib/utils';
import XLSX from 'xlsx-js-style';

const titleStyle = {
  font: { bold: true, sz: 16, color: { rgb: 'ffffff' } },
  alignment: { horizontal: 'center', vertical: 'center' },
  fill: { fgColor: { rgb: '1b418c' } },
};

const columnsStyle = {
  font: { bold: true },
};

const useExcel = () => {
  const handleExport = (title: string, sheetName: string, data: unknown[]) => {
    const ws = XLSX.utils.json_to_sheet([]);
    ws.SheetName = sheetName;
    // Add title
    const titleRow = [[title]];
    XLSX.utils.sheet_add_aoa(ws, titleRow, { origin: 'A1' });
    ws['A1'].s = titleStyle;

    // Merge A1:B1
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }];

    // Add current date
    const date = [[formatDate(getCurrentUTCTime())]];
    XLSX.utils.sheet_add_aoa(ws, date, { origin: 'C1' });
    ws['C1'].s = titleStyle;

    // Add empty row
    XLSX.utils.sheet_add_aoa(ws, [[]], { origin: 'A2' });

    // Add the data
    XLSX.utils.sheet_add_json(ws, data, { origin: 'A3', skipHeader: false });

    // Add style to the table columns
    const columns = Object.keys(data[0] as any);
    columns.forEach((column, index) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 2, c: index });
      if (!ws[cellAddress]) ws[cellAddress] = {};
      ws[cellAddress].s = columnsStyle;
    });

    // Set the width of the cells
    const desiredWidth = 20;
    ws['!cols'] = Array(data.length).fill({ wch: desiredWidth });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, `${sheetName}.xlsx`);
  };

  return {
    handleExport,
  };
};

export default useExcel;
