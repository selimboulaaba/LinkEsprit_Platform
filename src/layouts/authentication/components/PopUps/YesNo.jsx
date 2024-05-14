import React from 'react';
import MDButton from "../../../../components/MDButton";

function YesNoPopUp({ title, message, onDialog, setDialog }) {
  const handleYes = () => {
    // Pass true to the parent component
    onDialog(true);
  };

  const handleNo = () => {
    // Pass false to the parent component
    setDialog({ isLoading: false });
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] px-[20px]" onClick={() => setDialog({ isLoading: false })}>
      <div onClick={(e) => e.stopPropagation()} className='flex flex-col items-center justify-center absolute top-[35%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white p-[20px] rounded-[10px]'>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="confirmation-popup-buttons">
          <MDButton
            variant="gradient"
            color="primary"
            onClick={handleYes}
          >
            Yes
          </MDButton>
          <MDButton
            variant="gradient"
            color="error"
            onClick={handleNo}
          >
            No
          </MDButton>
        </div>
      </div>
    </div>
  );
}

export default YesNoPopUp;
