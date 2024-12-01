import { NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// const pdfUrl = "https://outgoing-goldfish-793.convex.cloud/api/storage/b51e0c62-e9ba-4d63-a0c3-fd98221ae6ea";
export async function GET (req){
    const reqUrl = req.url;
    const {searchParams} =  new URL(reqUrl);
    const pdfUrl = searchParams.get('pdfUrl');
    console.log(pdfUrl);
    //1. Load the PDF File
    const response=await fetch (pdfUrl);
    const data =  await response.blob();
    const loader = new WebPDFLoader(data);
    const docs = await loader.load();

    let pdfTextContent = '';
    docs.forEach(doc=>{
        pdfTextContent=pdfTextContent+doc.pageContent
    })

    //2. Split the text into small chunks
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 100,
        chunkOverlap: 20,
    });

    const output = await splitter.createDocuments([pdfTextContent]);

    let splitterList = [];

    output.forEach(doc=>{
        splitterList.push(doc.pageContent)
    })

    return NextResponse.json({result:splitterList})
}