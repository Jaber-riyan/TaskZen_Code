import React, { useState } from 'react'

function DropArea({ onDrop }) {
    const [showDrop, setShowDrop] = useState(false)
    return (
        <section
            onDragEnter={() => setShowDrop(true)}
            onDragLeave={() => setShowDrop(false)}
            onDrop={() => {
                onDrop();
                setShowDrop(false);
            }}
            onDragOver={e => e.preventDefault()}
            className={showDrop ? 'h-36 w-full text-[#dcdcdc] border border-dashed border-[#dcdcdc] rounded-xl p-4 opacity-100 transition-all ease-in-out duration-300 text-xl font-semibold' : 'opacity-0'}>
            Drop Here
        </section>
    )
}

export default DropArea