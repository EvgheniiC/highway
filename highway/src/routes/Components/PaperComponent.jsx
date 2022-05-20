import Paper, { PaperProps } from '@mui/material/Paper';

let PaperComponent = () => {
    return (
      <Draggable
        handle="#draggable-dialog-title"
        cancel={'[class*="MuiDialogContent-root"]'}
      >
        {/* <Paper {...props} /> */}
      </Draggable>
    );
  }

  export default PaperComponent