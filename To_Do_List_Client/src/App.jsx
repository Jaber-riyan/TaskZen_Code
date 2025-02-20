
import { useEffect, useRef } from 'react';
import { createSwapy } from 'swapy';

function App() {
  const swapy = useRef(null);
  const container = useRef(null);

  useEffect(() => {
    if (container.current) {
      swapy.current = createSwapy(container.current);

      swapy.current.onSwap((e) => {
        console.log('swap', e);
      });
    }

    return () => {
      swapy.current?.destroy(); // Cleanup function
    };
  }, []);

  return (
    <div className="swapy-slot-2 flex" ref={container}>
      {/* Slot A */}
      <div className="swapy-slot" data-swapy-slot="a">
        {/* Item A */}
        <div data-swapy-item="a">
          <div className='swapy'>A</div>
        </div>
      </div>

      {/* Slot B */}
      <div className="swapy-slot" data-swapy-slot="b">
        {/* Item B */}
        <div data-swapy-item="b">
          <div className='swapy'>B</div>
        </div>
      </div>

      {/* Slot C */}
      <div className="swapy-slot" data-swapy-slot="c">
        {/* Item C */}
        <div data-swapy-item="c">
          <div className='swapy'>C</div>
        </div>
      </div>
    </div>
  );
}

export default App;
