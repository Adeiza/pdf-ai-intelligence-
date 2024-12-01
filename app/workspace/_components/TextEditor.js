import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useEffect } from 'react'
import EditorExtension from './EditorExtension';
import Highlight from '@tiptap/extension-highlight';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Link from '@tiptap/extension-link';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Document from '@tiptap/extension-document';
import Text from '@tiptap/extension-text';

function TextEditor({fileId}) {

    const notes=useQuery(api.notes.GetNotes, {
        fileId:fileId
    });

    console.log(notes);

    const editor = useEditor({
        extensions: [Document, Text, Highlight.configure({multicolor:true}),Subscript, Superscript,Underline,TextStyle,StarterKit, 
            Placeholder.configure({
                placeholder:'Dossier notes...'
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Link.configure({
                openOnClick: false,
                autolink: true,
                defaultProtocol: 'https',
                protocols: ['http', 'https'],
                isAllowedUri: (url, ctx) => {
                try {
                    // construct URL
                    const parsedUrl = url.includes(':') ? new URL(url) : new URL(`${ctx.defaultProtocol}://${url}`)

                    // use default validation
                    if (!ctx.defaultValidate(parsedUrl.href)) {
                    return false
                    }

                    // disallowed protocols
                    const disallowedProtocols = ['ftp', 'file', 'mailto']
                    const protocol = parsedUrl.protocol.replace(':', '')

                    if (disallowedProtocols.includes(protocol)) {
                    return false
                    }

                    // only allow protocols specified in ctx.protocols
                    const allowedProtocols = ctx.protocols.map(p => (typeof p === 'string' ? p : p.scheme))

                    if (!allowedProtocols.includes(protocol)) {
                    return false
                    }

                    // disallowed domains
                    const disallowedDomains = ['example-phishing.com', 'malicious-site.net']
                    const domain = parsedUrl.hostname

                    if (disallowedDomains.includes(domain)) {
                    return false
                    }

                    // all checks have passed
                    return true
                } catch (error) {
                    return false
                }
                },
                shouldAutoLink: url => {
                try {
                    // construct URL
                    const parsedUrl = url.includes(':') ? new URL(url) : new URL(`https://${url}`)

                    // only auto-link if the domain is not in the disallowed list
                    const disallowedDomains = ['example-no-autolink.com', 'another-no-autolink.com']
                    const domain = parsedUrl.hostname

                    return !disallowedDomains.includes(domain)
                } catch (error) {
                    return false
                }
                },

            }),
        ],
        editorProps:{
            attributes:{
                class:'focus:outline-none h-screen p-5'
            }
        }
    });

    useEffect(()=>{
        editor&&editor.commands.setContent(notes)
    }, [notes&&editor])


  return (
    <div>
       <EditorExtension editor={editor} />
        <div className='overflow-scroll h-[88vh]'>
            <EditorContent editor={editor} />
        </div>
    </div>
  )
}

export default TextEditor