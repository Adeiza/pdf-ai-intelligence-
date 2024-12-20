import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { action } from "./_generated/server.js";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { v } from "convex/values";

export const ingest = action({
  args: {splitText:v.any(),fileId:v.string()},
  handler: async (ctx,args) => {
    await ConvexVectorStore.fromTexts(
      args.splitText, //Array
      {fileId:args.fileId},//String
      new GoogleGenerativeAIEmbeddings({
        apiKey:NEXT_PUBLIC_GEMINI_API_KEY,
        model: "text-embedding-004", // 768 dimensions
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }),
      { ctx }

    );
    return "Completed..."
  },
});

export const search = action({
  args: {
    query: v.string(),
    fileId:v.string()
  },
  handler: async (ctx, args) => {
    const vectorStore = new ConvexVectorStore(new GoogleGenerativeAIEmbeddings({
        apiKey:"AIzaSyBtN7xoircshOoClAdEH1dyYlOOc0WLP1Y",
        model: "text-embedding-004", // 768 dimensions
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }), { ctx });

    const resultOne = (await vectorStore.similaritySearch(args.query, 1)).filter(q=>q.metadata.fileId == args.fileId);
    console.log('This is now: ', resultOne);

    return JSON.stringify(resultOne);
  },
});