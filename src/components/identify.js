import * as mobilenet from "@tensorflow-models/mobilenet";
import { useState, useEffect, useRef } from "react";
import "@tensorflow/tfjs";
import styled from "styled-components";
import RedSpinner from "./hooks/spinner";
import useTitle from "./hooks/title";

export default function Identify() {
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [model, setModel] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [results, setResults] = useState([]);

  const titleUpdater = useTitle("불러오는 중...");
  setTimeout(() => titleUpdater("이미지 분류"));

  const imageRef = useRef();

  const loadModel = async () => {
    setIsModelLoading(true);
    try {
      const model = await mobilenet.load();
      setModel(model);
      setIsModelLoading(false);
    } catch (err) {
      console.log(err);
      setIsModelLoading(false);
    }
  };

  const uploadImage = (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setImageURL(url);
    } else {
      setImageURL(null);
    }
  };

  const identify = async () => {
    const results = await model.classify(imageRef.current);
    setResults(results);
  };

  useEffect(() => {
    loadModel();
  }, []);

  if (isModelLoading) {
    return (
      <div>
        <LoadText>모델을 불러오는 중...</LoadText>
        <RedSpinner loading={isModelLoading} size={50} />
      </div>
    );
  }

  console.log(results);

  return (
    <div>
      <MainTitle>이미지 식별기</MainTitle>
      <InputContainer>
        <Label htmlFor="ex_file">업로드</Label>
        <input
          id="ex_file"
          type="file"
          accept="image/*"
          capture="camera"
          onChange={uploadImage}
        />
      </InputContainer>
      <div>
        {imageURL && (
          <img
            src={imageURL}
            alt="미리보기"
            ref={imageRef}
            crossOrigin="origin"
            style={{
              marginLeft: "100px",
              width: "500px",
              height: "500px",
              marginTop: "30px",
            }}
          />
        )}
      </div>
      <MidSpace />
      <div>
        {results.map((result, index) => {
          return (
            <Container key={result.className}>
              <span>{result.className}</span>
              <br />
              <span>
                신뢰도: {(result.probability * 100).toFixed(2)}%{" "}
                {index === 0 && <Best>최고 확률</Best>}
              </span>
            </Container>
          );
        })}
      </div>
      <div>{imageURL && <IdenBtn onClick={identify}>판별하기</IdenBtn>}</div>
    </div>
  );
}

const MidSpace = styled.div`
  height: 30px;
`

const IdenBtn = styled.button`
  width: 130px;
  height: 50px;
  border: none;
  background-color: black;
  color: white;
  font-size: 17px;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.5s ease-in-out;
  &:hover {
    background-color: white;
    color: black;
    border: 1px solid black;
  }
`;

const Label = styled.label`
  display: inline-block;
  padding: 0.5em 0.75em;
  color: black;
  font-size: inherit;
  line-height: normal;
  vertical-align: middle;
  background-color: #fdfdfd;
  cursor: pointer;
  border: 1px solid #ebebeb;
  border-bottom-color: #e2e2e2;
  border-radius: 0.25em;
`;

const LoadText = styled.h2`
  text-align: center;
`;

const InputContainer = styled.div`
  width: 200px;
  height: 40px;
  input[type="file"] {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }
  margin-left: 100px;
`;

const MainTitle = styled.h1`
  text-align: center;
  width: 100%;
  height: 40px;
  background-color: #3498db;
  color: white;
  margin-top: 0px;
`;

const Best = styled.span`
  background-color: black;
  color: white;
  font-weight: 700;
`;

const Container = styled.div`
  margin-top: 30px;
  margin-left: 280px;
`;
