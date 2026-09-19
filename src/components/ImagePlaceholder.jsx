import placeholder from '../assets/img/placeholder.png';
import './ImagePlaceholder.css';

const ImagePlaceholder = ({ name, type }) => {
  return (
    <div className={`image-placeholder ${type}`}>
      <img src={placeholder} alt="" />
      {name && <span className="name ellipsis-2">{name}</span>}
    </div>
  );
};

export default ImagePlaceholder;
