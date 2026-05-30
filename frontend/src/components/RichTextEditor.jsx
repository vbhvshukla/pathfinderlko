import React, { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'

export default function RichTextEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-h-80 mx-auto my-4',
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  // Synchronize internal editor content with outer state (e.g. form resets)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '')
    }
  }, [value, editor])

  if (!editor) return null

  return (
    <div className="border rounded-xl overflow-hidden bg-background focus-within:ring-1 focus-within:ring-primary/40 focus-within:border-primary/40 transition-all">
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center gap-1.5 bg-muted/40 p-2 border-b text-xs select-none">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2.5 py-1.5 rounded-md font-bold transition-colors ${
            editor.isActive('bold') ? 'bg-primary text-primary-foreground' : 'hover:bg-muted font-bold'
          }`}
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2.5 py-1.5 rounded-md italic transition-colors ${
            editor.isActive('italic') ? 'bg-primary text-primary-foreground' : 'hover:bg-muted italic'
          }`}
        >
          Italic
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2.5 py-1.5 rounded-md font-semibold transition-colors ${
            editor.isActive('heading', { level: 2 }) ? 'bg-primary text-primary-foreground' : 'hover:bg-muted font-semibold'
          }`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-2.5 py-1.5 rounded-md font-semibold transition-colors ${
            editor.isActive('heading', { level: 3 }) ? 'bg-primary text-primary-foreground' : 'hover:bg-muted font-semibold'
          }`}
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2.5 py-1.5 rounded-md transition-colors ${
            editor.isActive('bulletList') ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
          }`}
        >
          Bullet List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2.5 py-1.5 rounded-md transition-colors ${
            editor.isActive('orderedList') ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
          }`}
        >
          Numbered List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-2.5 py-1.5 rounded-md transition-colors ${
            editor.isActive('blockquote') ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
          }`}
        >
          Quote
        </button>
        <button
          type="button"
          onClick={() => {
            const url = window.prompt('Enter link URL:')
            if (url) {
              editor.chain().focus().setLink({ href: url }).run()
            } else if (url === '') {
              editor.chain().focus().unsetLink().run()
            }
          }}
          className={`px-2.5 py-1.5 rounded-md transition-colors ${
            editor.isActive('link') ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
          }`}
        >
          Link
        </button>
      </div>

      {/* Editor Content Area */}
      <EditorContent
        editor={editor}
        className="p-3 min-h-[220px] max-h-[380px] overflow-y-auto focus:outline-none prose dark:prose-invert max-w-none text-sm leading-relaxed"
      />
    </div>
  )
}
