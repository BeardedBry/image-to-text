import React, { ChangeEvent, useState } from 'react'
import { createWorker } from 'tesseract.js';
import recipt from '/recipt.webp'


function App() {
  const worker = createWorker({
    logger: m => console.log(m),
  });


  // const [ocr, setOcr] = useState('Recognizing...');
  const [ocr, setOcr] = useState('Recognizing...')
  const [total, setTotal] = useState<string | undefined>();
  const [file, setFile] = useState<File>();
  const [image, setImage] = useState<string | ArrayBuffer | null>();
  const totalRegEx = new RegExp(/(?<=total: )([\d.]+)/gmi);

  console.log('file', file);

  React.useEffect(()=>{
    if(!file) return;

    const reader = new FileReader();
    reader.addEventListener('load', async (e) => {
      console.log('filereader', e);
      // reader.result
      if(!e.target) return;
      setImage(e.target.result)
    })
    reader.readAsDataURL(file);

  },[file])

  React.useEffect(() => {
    if (ocr !== 'Recognizing...') {
      return;
    }

    const doOCR = async (image: File) => {
      await worker.load();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      const { data: { text } } = await worker.recognize(image);
      setOcr(text);
    };

    async function getTotal() {
      if (!file) return;
      await doOCR(file);
    }
    const total = ocr.match(totalRegEx);
    getTotal();
    console.log('total: ', total);
    if (total) {
      setTotal(total[0]);
    }

  }, [ocr, file]);

  // React.useEffect(function listenForFile(){
  //   uploadRef.current?.addEventListener("change", function(){
  //     console.log('event listener')
  //     const reader = new FileReader();
  //     reader.addEventListener("load", (e) => {
  //       // const uploadedImage = reader.result();
  //       console.log(e);
  //     })
  //   })
  // },[uploadRef.current])

  function fileUpload(e: ChangeEvent<HTMLInputElement>) {

    if (!e.target.files) {
      return;
    }
    setFile(e.target.files[0])
    const reader = new FileReader();

    console.log()
    // reader.addEventListener("load", (e) => {
    //   // const uploadedImage = reader.result();
    //   console.log(e);
    // });
  }

  return (
    <div className="App m-5 mt-12">

      <div>
        <h2>Upload an image</h2>
        <input
          type="file"
          accept="image/jpeg, image/png, image/jpg"
          onChange={fileUpload}
        />
      </div>

      <h1 className="text-5xl font-semibold text-center py-5">Image to Text</h1>
      {image && (typeof image == 'string') &&
        <img
          className="h-96"
          src={image}
        />
      }
      <p>{ocr}</p>

      <h1 className="text-xl font-bold">Total?: {total}</h1>
    </div>
  )
}

export default App
