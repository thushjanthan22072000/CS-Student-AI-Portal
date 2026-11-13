import { useState, useRef, useCallback } from 'react';
import { Play, Loader2, Terminal, Trash2 } from 'lucide-react';

type RunState = 'idle' | 'loading' | 'running' | 'done' | 'error';

let pyodidePromise: Promise<any> | null = null;

async function loadPyodide(): Promise<any> {
  if (pyodidePromise) return pyodidePromise;

  pyodidePromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js';
    script.onload = async () => {
      try {
        // @ts-ignore - loadPyodide is injected by the script
        const pyodide = await window.loadPyodide();
        resolve(pyodide);
      } catch (err) {
        reject(err);
      }
    };
    script.onerror = () => reject(new Error('Failed to load Python runtime'));
    document.head.appendChild(script);
  });

  return pyodidePromise;
}

export default function CodeRunner({ initialCode }: { initialCode: string }) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [state, setState] = useState<RunState>('idle');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const run = useCallback(async () => {
    setOutput('');
    setState('loading');

    try {
      const pyodide = await loadPyodide();
      setState('running');

      let captured = '';
      pyodide.setStdout({ batched: (s: string) => { captured += s + '\n'; } });
      pyodide.setStderr({ batched: (s: string) => { captured += s + '\n'; } });

      try {
        await pyodide.runPythonAsync(code);
        setOutput(captured || '(no output)');
        setState('done');
      } catch (err: any) {
        setOutput(captured + (captured ? '\n' : '') + String(err));
        setState('error');
      }
    } catch (err: any) {
      setOutput('Failed to load Python runtime. Please check your internet connection and try again.');
      setState('error');
    }
  }, [code]);

  const clearOutput = () => {
    setOutput('');
    setState('idle');
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
          <Terminal className="w-4 h-4" /> Try it yourself — run Python in your browser
        </label>
      </div>

      <div className="rounded-xl border border-gray-200 overflow-hidden bg-gray-900">
        <div className="flex items-center justify-between px-4 py-2.5 bg-gray-800 border-b border-gray-700">
          <span className="text-xs font-mono text-gray-400">main.py</span>
          <div className="flex items-center gap-2">
            <button
              onClick={clearOutput}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
            <button
              onClick={run}
              disabled={state === 'loading' || state === 'running'}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-success-600 hover:bg-success-700 transition-all disabled:opacity-60"
            >
              {state === 'loading' || state === 'running' ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> {state === 'loading' ? 'Loading...' : 'Running...'}</>
              ) : (
                <><Play className="w-3.5 h-3.5" /> Run Code</>
              )}
            </button>
          </div>
        </div>

        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="w-full bg-gray-900 text-gray-300 font-mono text-sm p-4 outline-none resize-y min-h-[180px] leading-relaxed"
        />

        {(output || state !== 'idle') && (
          <div className="border-t border-gray-700 bg-gray-950 p-4">
            <div className="text-xs text-gray-500 mb-2 font-mono">Output:</div>
            <pre className={`text-sm font-mono leading-relaxed whitespace-pre-wrap break-words ${
              state === 'error' ? 'text-error-400' : 'text-success-400'
            }`}>
              {output}
            </pre>
          </div>
        )}
      </div>

      <p className="mt-2 text-xs text-gray-400">
        Python runs directly in your browser using Pyodide — no installation needed.
        The first run may take a few seconds to load.
      </p>
    </div>
  );
}
