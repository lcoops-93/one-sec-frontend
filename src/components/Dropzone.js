import React from 'react';
import {useDropzone} from 'react-dropzone';
import styled from 'styled-components';


import {
  getJobs,
  addJob,
} from "../requests/request";


// Currently experiencing a bug with react-dropzone where isDragReject always evaluates to true on drag
const getBorderColor = (props) => {
  if (props.isDragAccept) {
      return '#66fcf1';
  }
  if (props.isDragReject) {
      return '#66fcf1';
  }
  if (props.isFocused) {
      return '#66fcf1';
  }
  return '#66fcf1';
}

const getBackgroundColor = (props) => {
  if (props.isDragAccept) {
      return '#45a29e';
  }
  if (props.isDragReject) {
      return '#45a29e';
  }
  if (props.isFocused) {
      return '#none';
  }
  return 'none';
}

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 20px;
  border-color: ${props => getBorderColor(props)};
  background-color: ${props => getBackgroundColor(props)};
  border-style: solid;
  color: #bdbdbd;
  outline: none;
  transition: border .24s ease-in-out;
`;




function StyledDropzone(props) {
  // const [files, setFiles] = useState([]);
  const { conversionsStore, sessionId } = props;

  const getConversionJobs = async () => {
    const response = await getJobs(sessionId);
    conversionsStore.setConversions(response.data);
  };

  const onDrop = async acceptedFiles => {
    // setFiles(files => files.concat(...acceptedFiles));
    console.log(acceptedFiles)
    console.log(acceptedFiles.length)

    for (var i = 0; i < acceptedFiles.length; i++) {
      let bodyFormData = new FormData();
      bodyFormData.set("outputFormat", "mp4");
      bodyFormData.set("sessionId", sessionId);
      bodyFormData.append("video", acceptedFiles[i]);
      await addJob(bodyFormData);
    } 

    getConversionJobs();
  };

  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({onDrop, accept: 'image/*'});

  return (
    <div className="container">
      <Container {...getRootProps({isDragAccept, isDragReject, isFocused})}>
        <input {...getInputProps()} />
        {/* <p>Drag 'n' drop some files here, or click to select files</p> */}
        {!isFocused && (<p>Drag 'n' drop some files here, or click to select files</p>)}
        {(isDragReject || isDragAccept ) && (<p>Only image files accepted (.png, .jpg etc)</p>)}
      </Container>

    </div>

  );
}

export default StyledDropzone;