import placeholder from '../../assets/img/placeholder.png';
import './ImagePlaceholder.css';

const ImagePlaceholder = ({ name, type }) => {
  return (
    <div className={`image-placeholder ${type}`}>
      <div className="image overlay">
        <img src={placeholder} alt="" />
      </div>

      {name && <span className="name">{name}</span>}
    </div>
  );
};

export default ImagePlaceholder;
