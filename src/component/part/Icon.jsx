import 'font-awesome/css/font-awesome.min.css';  // pastikan CSS Font Awesome dimuat

export default function Icon({
  type = "regular",  // default type bisa menggunakan regular
  name,
  cssClass = "",
  ...props
}) {
  // Kombinasi kelas untuk Font Awesome, menambahkan type dan name
  const iconClass = `fa fa-${type} fa-${name} ${cssClass}`;
  
  return <i className={iconClass} {...props}></i>;
}
