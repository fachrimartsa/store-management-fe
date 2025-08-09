import Icon from "./Icon";

export default function Table({
  data = [],
  nilai,
  JumlahData = false,
  onToggle = () => {},
  onCancel = () => {},
  onDelete = () => {},
  onDetail = () => {},
  onEdit = () => {},
  onApprove = () => {},
  onReject = () => {},
  onSent = () => {},
  onUpload = () => {},
  onFinal = () => {},
  onPrint = () => {},
  onDownload = () => {},
}) {
  function generateActionButton(columnName, value, id, status) {
    if (columnName !== "Aksi") return value;

    // Mapping untuk nama ikon dan warna tombol agar sesuai tema
    const actionMap = {
      Toggle: status === "Aktif" ? { name: "toggle-on", color: "bg-purple-600" } : { name: "toggle-off", color: "bg-gray-500" },
      Cancel: { name: "delete-document", color: "bg-red-600" },
      Delete: { name: "trash", color: "bg-red-700" },
      Detail: { name: "eye", color: "bg-gray-600" }, // Warna abu-abu netral
      Edit: { name: "edit", color: "bg-purple-600" }, // Warna ungu sebagai warna aksi utama
      Approve: { name: "check", color: "bg-green-600" }, // Hijau untuk persetujuan tetap umum
      Reject: { name: "cross", color: "bg-red-700" },
      Sent: { name: "paper-plane", color: "bg-fuchsia-600" }, // Warna fuchsia/magenta
      Upload: { name: "file-upload", color: "bg-purple-500" },
      Final: { name: "gavel", color: "bg-yellow-600" }, // Kuning gelap untuk finalisasi
      Print: { name: "print", color: "bg-gray-500" },
      Download: { name: "download", color: "bg-gray-400" },
    };

    // Mapping fungsi onClick secara eksplisit (menggantikan eval)
    const handleActionClick = (actionType, itemId) => {
      switch (actionType) {
        case "Toggle": return onToggle(itemId);
        case "Cancel": return onCancel(itemId);
        case "Delete": return onDelete(itemId);
        case "Detail": return onDetail(itemId);
        case "Edit": return onEdit(itemId);
        case "Approve": return onApprove(itemId);
        case "Reject": return onReject(itemId);
        case "Sent": return onSent(itemId);
        case "Upload": return onUpload(itemId);
        case "Final": return onFinal(itemId);
        case "Print": return onPrint(itemId);
        case "Download": return onDownload(itemId);
        default: return null;
      }
    };

    return (
      <div className="flex gap-2 justify-center">
        {Array.isArray(value) &&
          value.map((action, index) => {
            const { name, color } = actionMap[action] || {};
            return name ? (
              <button
                key={id + action + index}
                className={`p-2.5 rounded-md text-white shadow-md hover:shadow-lg hover:opacity-90 transition duration-200 ${color} flex items-center justify-center`}
                onClick={() => handleActionClick(action, id)} // Panggil fungsi yang sesuai
              >
                <Icon name={name} type="Bold" size={18} />
              </button>
            ) : null;
          })}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-700 shadow-md bg-white">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
          <tr>
            {data.length > 0 &&
              Object.keys(data[0] || {}).map(
                (value, index) =>
                  !["Key", "Count", "Alignment", "Key2"].includes(value) && (
                    <th key={index} className="px-6 py-3 text-center font-semibold uppercase tracking-wide">
                      {value}
                    </th>
                  )
              )}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={row.Key || rowIndex} className="border-b border-gray-200 hover:bg-gray-50 transition duration-150">
                {Object.keys(row || {}).map(
                  (column) =>
                    !["Key", "Count", "Alignment", "Key2"].includes(column) && (
                      <td
                        key={column}
                        className={`px-2 py-2 text-sm text-gray-800 ${row.Alignment && row.Alignment[Object.keys(row).indexOf(column)] ? `text-${row.Alignment[Object.keys(row).indexOf(column)]}` : 'text-center'}`}
                      >
                        {generateActionButton(column, row[column], row.Key, row.Status)}
                      </td>
                    )
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="100%" className="px-6 py-4 text-center text-gray-500 italic">
                Tidak ada data tersedia
              </td>
            </tr>
          )}

          {JumlahData && (
            <tr className="bg-gray-50 border-t border-gray-300">
              <td colSpan={Object.keys(data[0] || {}).filter(col => !["Key", "Count", "Alignment", "Key2"].includes(col)).length - 1} className="px-6 py-4 text-right font-bold text-gray-700">Jumlah</td>
              <td className="px-6 py-4 text-center font-bold text-purple-700">{nilai !== undefined ? nilai : data.length}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}