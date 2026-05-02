import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { highlightCode } from './SyntaxHighlighter';

interface Props {
  initialCode: string;
  expectedOutput: string;
  onSuccess: () => void;
  completed: boolean;
  language?: string;
}

const EDITOR_STYLES = {
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  fontSize: '13px',
  lineHeight: '1.6',
  padding: '16px',
  tabSize: 2,
  boxSizing: 'border-box' as const,
  whiteSpace: 'pre-wrap' as const,
  wordWrap: 'break-word' as const,
  overflowWrap: 'break-word' as const,
};

export default function CodeEditor({ initialCode, expectedOutput, onSuccess, completed, language = 'code' }: Props) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const preRef = useRef<HTMLPreElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const runCode = () => {
    setStatus('idle');
    setOutput('');

    const parts = expectedOutput.split('\\n');
    const allPresent = parts.every(part => {
      const trimmed = part.trim();
      return trimmed.length === 0 || code.includes(trimmed) || code.includes(trimmed.replace(/"/g, "'"));
    });

    const normalizedCode = code.toLowerCase().replace(/\s/g, '');
    const normalizedExpected = expectedOutput.toLowerCase().replace(/\s/g, '');

    if (allPresent || normalizedCode.includes(normalizedExpected)) {
      setOutput(expectedOutput);
      setStatus('success');
      onSuccess();
    } else {
      setOutput('Output non corrispondente. Riprova!');
      setStatus('error');
    }
  };

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  }, []);

  const handleScroll = useCallback(() => {
    if (preRef.current && textareaRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  const highlighted = highlightCode(code, language);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 rounded-2xl overflow-hidden shadow-lg mb-6"
    >
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <div className="w-3 h-3 rounded-full bg-emerald-400" />
        </div>
        <span className="text-slate-400 text-xs font-mono uppercase">{language}</span>
      </div>

      <div className="relative h-48">
        <pre
          ref={preRef}
          className="absolute inset-0 m-0 pointer-events-none overflow-auto"
          aria-hidden="true"
          style={EDITOR_STYLES}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
        <textarea
          ref={textareaRef}
          value={code}
          onChange={handleChange}
          onScroll={handleScroll}
          disabled={completed}
          className="absolute inset-0 w-full h-full bg-transparent resize-none focus:outline-none disabled:opacity-60"
          style={{
            ...EDITOR_STYLES,
            color: 'transparent',
            caretColor: '#ffffff',
          }}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
        />
      </div>

      <div className="flex items-center gap-2 px-4 py-3 bg-slate-800 border-t border-slate-700">
        <button
          onClick={runCode}
          disabled={completed}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-600 text-white rounded-xl text-sm font-semibold active:scale-95 transition-transform"
        >
          <Play className="w-4 h-4" /> Esegui
        </button>
        <button
          onClick={() => { setCode(initialCode); setOutput(''); setStatus('idle'); }}
          disabled={completed}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-slate-300 rounded-xl text-sm font-semibold active:scale-95 transition-transform"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>
      {output && (
        <div className={`px-4 py-3 border-t border-slate-700 ${status === 'success' ? 'bg-emerald-900/30' : 'bg-red-900/30'}`}>
          <div className="flex items-center gap-2 mb-1">
            {status === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
            <span className={`text-xs font-bold uppercase ${status === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
              {status === 'success' ? 'Output Corretto' : 'Errore'}
            </span>
          </div>
          <pre className="text-slate-300 text-sm font-mono whitespace-pre-wrap">{output}</pre>
        </div>
      )}
    </motion.div>
  );
}
