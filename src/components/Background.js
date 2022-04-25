import {React} from 'react';
import ParticlesBg from 'particles-bg'
import StyledDropzone from './Dropzone';
import styled from 'styled-components';
import { ConversionsStore } from "../store";
import { observer } from "mobx-react";
import useInterval from './utils';
import { TailSpin } from  'react-loader-spinner'
import { device } from  '../layout/device'


import {
  getJobs,
  deleteJob,
  startJob,
  APIURL
} from "../requests/request";


const conversionsStore = new ConversionsStore();
const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
var sessionId = genRanHex(12);

const Container = styled.div`
  position: absolute;
  top: 5vh;
  left: 10vw;
  width: 80vw;
  height: 10 vh;


  @media ${device.mobileS} { 
    top: 5vh;
    left: 10vw;
    width: 80vw;
    height: 10 vh;
  }

  @media ${device.laptop} { 
    top: 20vh;
    left: 25vw;
    width: 50vw;
    height: 10 vh;
  }
`;

const MainText = styled.h1`
  color: white;
  margin-bottom: 50px;
`;

const FileDisplay = styled.div`
  color: white;
  display: flex;
  height: 4em;
  width: 100%;
  justify-content: flex-start;
  column-gap: 4em;
`;

const FileNameDisplay = styled.div`
  text-align:left;
  width: 80%;
  overflow: hidden;
`;


const LoadingPos = styled.div`
  margin-top: 1em;
  margin-left: auto;
`

const DownloadImage = styled.img`
  height: 2em;
  width: 2em;
`


const ConvertButton = styled.button`
  color: #c5c6c7;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border-color: #66fcf1;
  background-color: transparent;
  border-style: solid;
  border-radius: 5px;

  &:hover {
    background-color: #c5c6c7;
    color: #1f2833;
  }
`;

const getConversionJobs = async () => {
  const response = await getJobs(sessionId);
  conversionsStore.setConversions(response.data);
};

const handleConvertAll = async evt => {
  conversionsStore.conversions.map(async c => await startJob(c.id))
  getConversionJobs();
}

const handleDeleteAll = async evt => {
  conversionsStore.conversions.map(async c => await deleteJob(c.id))
  getConversionJobs();
}

const fileNameDisplay = (unfilteredName) => {
  var filteredName = unfilteredName
  filteredName = filteredName.split("_");
  filteredName.shift();
  filteredName.shift();
  filteredName = filteredName.join("_");
  return filteredName 
}


const DisplayFiles = () => {
  return(
    <div>
      <div>
        {
          conversionsStore.conversions.map(c => { return(
            <FileDisplay key={c.id}>
              <FileNameDisplay>
                <p>{fileNameDisplay(c.filePath)}</p>
              </FileNameDisplay>

              
              <LoadingPos>
                {c.status === 'converting' &&
                  <TailSpin
                    height="2em"
                    width="2em"
                    color='#66fcf1'
                    ariaLabel='loading'
                  />
                }
                {c.status === 'done' &&
                  <a href={`${APIURL}/${c.convertedFilePath}`} target="_blank" download>
                    <DownloadImage src={require("../images/download_icon.png")} alt=""/>
                  </a>
                  
                }
              </LoadingPos>
            </FileDisplay>
          )})
        }
      </div>

      {conversionsStore.conversions.length > 0 &&
        <ConvertButton onClick={handleConvertAll}>Convert All</ConvertButton>
      }
      {conversionsStore.conversions.length > 0 &&
        <ConvertButton onClick={handleDeleteAll}>Delete All</ConvertButton>
      }
    </div>
  )
}

// Need this so component updates when conversions Store updates
const ObservedDisplayFiles = observer(DisplayFiles)

//66fcf1
const Background = () => {
  document.body.style = 'background: #0b0c10;';

  // Regularly poll the backend to check conversion status
  useInterval(async () => {
    const response = await getJobs(sessionId);
    conversionsStore.setConversions(response.data);
  }, 1000 * 5);

  return (
    <section
      id="background"
      className=""
    >
      
      <ParticlesBg color="#45a29e" type="cobweb" num={100} bg={true} />


      <Container>
        <MainText>
          Convert Pictures to 1 Second Videos
        </MainText>

        <div>
          {
            conversionsStore.conversions.map(c => { return(
              <div>
                <MainText key={c.id}>{c.filePath}</MainText>
              </div>
            )})
          }
        </div>

        <StyledDropzone conversionsStore={conversionsStore} sessionId={sessionId}/>

        <ObservedDisplayFiles/>


      </Container>
      
     

    </section>
  );
};

export default Background;