import Window from "./Window";

const TextFile = ({ data, ...props }) => (
  <Window {...props} className="txtfile" title={data?.name ?? "Untitled.txt"}>
    <div className="txt-body">
      {data?.subtitle && <h3>{data.subtitle}</h3>}
      {data?.image && (
        <img src={data.image} alt={data.name} className="txt-image" />
      )}
      {(data?.description ?? []).map((line, i) => (
        <p key={i}>{line}</p>
      ))}
    </div>
  </Window>
);

export default TextFile;
