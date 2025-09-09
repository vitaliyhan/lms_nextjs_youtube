"use client"
import { useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import MenuBar from "./MenuBar"

export default function RichTextEditor() {

    const editor = useEditor({
        extensions: [StarterKit], immediatelyRender: false, content: '<p>Start typing here...</p>',
    })
    return (
        <div>
            <MenuBar editor={editor} />
        </div>
    )
}
