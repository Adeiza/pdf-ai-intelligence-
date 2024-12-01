import { chatSession } from '@/app/configs/AIModel';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useAction, useMutation } from 'convex/react';
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, Heading1, Heading2, Highlighter, Italic, LucideSuperscript, Sparkles, Subscript, Superscript, SuperscriptIcon, Underline } from 'lucide-react'
import { useParams } from 'next/navigation';
import React from 'react'
import { toast } from 'sonner';


function EditorExtension({editor}) {
    const {fileId} = useParams();

    console.log('This is fileId: ', fileId)
    console.log('Calling Search?')
    const SearchAI=useAction(api.myAction.search);
    const saveNotes=useMutation(api.notes.AddNotes);
    const {user}=useUser();

    const onAiClick = async ()=>{
        toast("AI is working...")
        const selectedText = editor.state.doc.textBetween(
            editor.state.selection.from,
            editor.state.selection.to,
            ' '
        )
        console.log("selectedText ",selectedText);

        const result = await SearchAI({
          query:selectedText,
          fileId:fileId
        })

      console.log('This is result: ', result);
        const unformattedAns = JSON.parse(result);
        let allUnformattedAnswer = '';

        unformattedAns&&unformattedAns.forEach((item)=>{
          allUnformattedAnswer = allUnformattedAnswer + item.pageContent;
        })

        console.log(allUnformattedAnswer)
        const PROMPT = "For question:"+selectedText+" and with the given content as answer please give appropriate answer in HTML format. The answer content is "+ allUnformattedAnswer;
        const AIModelResult = await chatSession.sendMessage(PROMPT);
        console.log(AIModelResult.response.text());

        const finalAns = AIModelResult.response.text().replace('```', '').replace('html', '');
        const AllText=editor.getHTML();
        editor.commands.setContent(AllText+'<p><strong>Answer:</strong>'+finalAns+'</p>')

        saveNotes({
          notes:editor.getHTML(),
          fileId:fileId,
          createdBy:user?.primaryEmailAddress?.emailAddress
        })
      }


  return editor &&(
    <div className='p-5'> 
        <div className="control-group">
        <div className="button-group  flex gap-3">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor?.isActive('bold') ? 'text-blue-500' : ''}
          >
            <Bold />
          </button>
           <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'text-blue-500' : ''}
          >
            <Italic />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={editor.isActive('highlight') ? 'text-blue-500' : ''}
          >
            <Highlighter />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            className={editor.isActive('subscript') ? 'text-blue-500' : ''}
          >
            <Subscript />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            className={editor.isActive('superscript') ? 'text-blue-500' : ''}
          >
            <SuperscriptIcon />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={editor.isActive('underline') ? 'text-blue-500' : ''}
          >
            <Underline />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
          >
            <AlignLeft />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}
          >
            <AlignCenter/>
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}
          >
            <AlignRight />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''}
          >
            <AlignJustify />
          </button>
          <button onClick={() => editor.chain().focus().unsetTextAlign().run()}>
            Unset text align
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive({ level: 1 }) ? 'is-active' : ''}
          >
            <Heading1 />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive({ level: 2 }) ? 'is-active' : ''}
          >
            <Heading2 />
          </button>

          <button
          className='hover:text-blue-500'
            onClick = {()=>onAiClick()}
          >
            <Sparkles />
          </button>
        </div>
        </div>
    </div>
  )
}

export default EditorExtension