"use client"

import { type Editor } from "@tiptap/react"
import { cn } from "@/lib/utils"
import { Toggle } from "../ui/toggle"
import { useState, useEffect } from "react" // Import useEffect and useState
import { Bold } from "lucide-react"

interface iAppProps {
    editor: Editor | null
}

export default function MenuBar({ editor }: iAppProps) {
    const [isBold, setIsBold] = useState(false)
    
    // Update state when editor changes
    useEffect(() => {
        if (!editor) return
        
        const handler = () => {
            setIsBold(editor.isActive("bold"))
        }
        
        // Set initial state
        handler()
        
        // Listen for changes
        editor.on('transaction', handler)
        
        // Cleanup
        return () => {
            editor.off('transaction', handler)
        }
    }, [editor])

    if (!editor) {
        return null
    }
    
    return (
        <div>
            <Toggle
                size={"sm"}
                pressed={isBold}
                onPressedChange={
                    () => {
                        editor.chain().focus().toggleBold().run()
                    }
                }
                className={cn(
                    isBold && "bg-muted text-muted-foreground"
                )}>
                <Bold />
            </Toggle>
        </div >
    )
}