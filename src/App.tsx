import React, { useState } from 'react'
import { createWorker } from 'tesseract.js';
import recipt from '/kroger.jpg'


function App() {
  const worker = createWorker({
    logger: m => console.log(m),
  });
  const doOCR = async (image: string) => {
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { text } } = await worker.recognize(image);
    setOcr(text);
  };
  
  // const [ocr, setOcr] = useState('Recognizing...');
  const [ocr, setOcr] = useState('Recognizing...')
  const [total, setTotal] = useState<string | undefined>();
  const totalRegEx = new RegExp(/(?<=total: )([\d.]+)/gmi);
  
  React.useEffect(() => {
    if(ocr !== 'Recognizing...'){
      return;
    }
    // async function getTotal(){
    //   const text = await doOCR(recipt);
    // }
    // getTotal();
    const total = ocr.match(totalRegEx);
    console.log('total: ', total);
    if(total){
      setTotal(total[0]);
    }

  }, [ocr]);
  
  return (
    <div className="App">
      <p>{ocr}</p>

      <h1 className="text-xl font-bold">Total?: {total}</h1>
    </div>
  )
}

export default App
