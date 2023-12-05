import { useState, useRef } from "react";
import { FileUploader } from "react-drag-drop-files";
import fileDownload from "js-file-download";
import './App.css';

// Types and interfaces
interface IData extends FileList {};
interface IFileReaderResult extends EventTarget {
    result?: string,
}

// Pure Static Vars
  const allowedFiles = ['JSON'];
  let filesData = [];

// Main Fuction
function App() {
  const files = useRef<IData | []>([]);
  const [expression, setExpression] = useState('');
  const [place, setPlace] = useState('');
  const [totalOfVerification, setTotalOfVerification] = useState(0);
  const [totalOfTriagem, setTotalOfTriagem] = useState(0);

  /**
   * Fuction to store the files on a static var
   * @param data 
   * @returns FileList
   */
  const handleInputChange = (data: IData): void => {
    // Reset
    filesData = [];
    files.current = [];

    // Insert
    files.current = data;
  };
  const readFile = ( file: File ) => {
    const reader = new FileReader();
    reader.onload = (eve: ProgressEvent<FileReader>) => {
      const readerResult: IFileReaderResult | null = eve.currentTarget;
      const resultSet = readerResult && JSON.parse(String(readerResult.result));
      filesData.push(resultSet);
      reader.abort();
    };
    reader.readAsText(file);
  };
  const writeFile = (json: any, name: string) => {
    const data = new Blob([JSON.stringify(json)], {type: 'application/json'});
    fileDownload(data, name);
  };
  const handleProcessButtonClick = (): void => {
    const numberOfFiles = files.current?.length || 0;
    if (numberOfFiles === 0) return;
    
    for (let i = 0; i < numberOfFiles; i++) {
      readFile(files.current[i]);
    }

    setTotalOfVerification(0);
    setTotalOfTriagem(0);
  };
  const handleTextClick = async (): void => {
    const inscricao = filesData.filter((item, index) => item.formKey === "ficha_de_verificacao");
    const triagem = filesData.filter((item, index) => item.formKey !== "ficha_de_verificacao");
    setTotalOfVerification(inscricao.length);
    setTotalOfTriagem(triagem.length);
  };

  return (
    <>
      <input
        placeholder={"Expression to aval"}
        type="text"
        name="expression"
        value={expression}
        onChange={(e) => setExpression(e.currentTarget.value)}
      />
      <input
        placeholder={"Place Name"}
        type="text"
        name="place"
        value={place}
        onChange={(e) => setPlace(e.currentTarget.value)}
        style={{ display: 'block', margin: '10px 0'}}
      />
      <FileUploader
        handleChange={handleInputChange}
        name="file"
        types={allowedFiles}
        multiple={true}
      />
      <button
        className='font-bold underline bg-black'
        onClick={handleProcessButtonClick}
      >
        process data
      </button>

      <br />
      <div className="text-black" onClick={handleTextClick}>Total de Triagem: {totalOfTriagem}</div>
      <div className="text-black" onClick={handleTextClick}>Total de Inscrição: {totalOfVerification}</div>

      <br />
    </>
  )
}

export default App;
