function ImagePlaceholder({ name }) {
  return (
    <div className="image-placeholder">
      <img src={placeholder} alt="" />
      <span>{name}</span>
    </div>
  );
}

export default ImagePlaceholder;
