import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react';
import './ScrollButton.css';

const ScrollButton = ({ direction, ariaLabel, onClick }) => {
  const Icon = direction === 'prev' ? CaretLeftIcon : CaretRightIcon;

  return (
    <button
      type="button"
      className={`scroll-button ${direction} icon`}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      <Icon />
    </button>
  );
};

export default ScrollButton;
