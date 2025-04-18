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

    const actionMap = {
      Toggle: status === "Aktif" ? { name: "toggle-on", color: "bg-blue-500" } : { name: "toggle-off", color: "bg-gray-500" },
      Cancel: { name: "delete-document", color: "bg-red-500" },
      Delete: { name: "trash", color: "bg-red-600" },
      Detail: { name: "eye", color: "bg-blue-500" },
      Edit: { name: "edit", color: "bg-green-500" },
      Approve: { name: "check", color: "bg-green-600" },
      Reject: { name: "cross", color: "bg-red-600" },
      Sent: { name: "paper-plane", color: "bg-blue-600" },
      Upload: { name: "file-upload", color: "bg-purple-500" },
      Final: { name: "gavel", color: "bg-yellow-500" },
      Print: { name: "print", color: "bg-gray-700" },
      Download: { name: "download", color: "bg-blue-400" },
    };

    return (
      <div className="flex gap-2 justify-center">
        {Array.isArray(value) &&
          value.map((action, index) => {
            const { name, color } = actionMap[action] || {};
            return name ? (
              <button
                key={id + action + index}
                className={`p-3 rounded-full text-white shadow-md transition-transform transform hover:scale-110 ${color} flex items-center justify-center`}
                onClick={() => eval(`on${action}(id)`)}
                style={{ width: "50px", height: "40px" }} // Ukuran tombol
              >
                <Icon name={name} type="Bold" size={18} />
              </button>
            ) : null;
          })}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-300 shadow-md bg-white">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-gradient-to-r from-blue-500 to-blue-800 text-white">
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
              <tr key={row.Key || rowIndex} className="border-b hover:bg-gray-100 transition">
                {Object.keys(row || {}).map(
                  (column) =>
                    !["Key", "Count", "Alignment", "Key2"].includes(column) && (
                      <td key={column} className="px-2 py-2 text-center text-black">
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
            <tr className="bg-white">
              <td colSpan="100%" className="px-6 py-4 text-center font-bold">Jumlah</td>
              <td className="px-6 py-4 text-center font-bold text-blue-600">{nilai !== undefined ? nilai : data.length}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
