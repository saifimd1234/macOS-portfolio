import Window from "./Window";

const ImageFile = ({ data, ...props }) => (
  <Window {...props} className="imgfile" title={data?.name ?? "Image"}>
    <div className="preview">
      <img src={data?.imageUrl} alt={data?.name ?? "preview"} />
    </div>
  </Window>
);

export default ImageFile;
