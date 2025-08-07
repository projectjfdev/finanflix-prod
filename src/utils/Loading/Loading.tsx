import "./Loading.css";

interface Props {
  color?: string;
  color2?: string;
  size: string;
}
// Ejemplo: <Loading size="20px" color="white" />
// Pasar el css a tailwind (el keyframes no se puede)
export const Loading = ({ color = "#fff", color2 = "#000", size }: Props) => {
  return (
    <div>
      {/* loading negro para light mode */}
      <div
        style={{
          background: `conic-gradient(#0000 10%, ${color}) content-box`,
          width: size,
          height: size,
        }}
        className="spinner hidden dark:flex"
      ></div>
      {/* loading blanco para dark mode */}
      <div
        style={{
          background: `conic-gradient(#0000 10%, ${color2}) content-box`,
          width: size,
          height: size,
        }}
        className="spinner dark:hidden"
      ></div>
    </div>
  );
};
