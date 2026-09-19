import { MapPinSimpleAreaIcon } from "@phosphor-icons/react";

function VerifyFab({ onClick }) {
  return (
    <button className="verify-fab icon" onClick={onClick}>
      <MapPinSimpleAreaIcon />
    </button>
  );
}

export default VerifyFab;
