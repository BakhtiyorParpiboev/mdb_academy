import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { useTheme } from '../context/ThemeContext';
import { Play, Loader2, Upload, Sparkles, Menu } from 'lucide-react';
import './Compiler.css';

const LANGUAGE_VERSIONS = {
    javascript: '1.32.3',
    python: '3.10.0',
    java: '15.0.2',
    cpp: '10.2.0',
    go: '1.16.2',
    c: '10.2.0',
};

const DEFAULT_CODE = {
    javascript: 'console.log("Hello, World!");',
    python: 'print("Hello, World!")',
    java: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}',
    cpp: '#include <iostream>\n\nint main() {\n  std::cout << "Hello, World!" << std::endl;\n  return 0;\n}',
    go: 'package main\n\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Hello, World!")\n}',
    c: '#include <stdio.h>\n\nint main() {\n  printf("Hello, World!\\n");\n  return 0;\n}',
};

const Compiler = () => {
    const { isDarkMode } = useTheme();
    const [language, setLanguage] = useState('javascript');
    const [code, setCode] = useState(DEFAULT_CODE['javascript']);
    const [stdin, setStdin] = useState('');
    const [output, setOutput] = useState('');
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Hidden file input ref
    const fileInputRef = useRef(null);
    const isDragging = useRef(false);
    const [leftPaneWidth, setLeftPaneWidth] = useState(50); // percentage

    const handleMouseDown = (e) => {
        isDragging.current = true;
        document.body.style.cursor = 'col-resize';
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) => {
        if (!isDragging.current) return;
        const newWidth = (e.clientX / window.innerWidth) * 100;
        if (newWidth > 15 && newWidth < 85) { // Constraints to prevent fully collapsing a pane
            setLeftPaneWidth(newWidth);
        }
    };

    const handleMouseUp = () => {
        isDragging.current = false;
        document.body.style.cursor = 'default';
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    const handleNewFile = () => {
        setCode('// Yangi fayl\n');
        setOutput('');
        setStdin('');
    };

    const handleLanguageChange = (e) => {
        const newLang = e.target.value;
        setLanguage(newLang);
        setCode(DEFAULT_CODE[newLang]);
        setOutput('');
        setStdin('');
    };

    const handleRun = async () => {
        if (!code.trim()) return;

        setIsLoading(true);
        setOutput('Executing...');
        setIsError(false);

        try {
            const res = await fetch('http://localhost:5000/api/compiler/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ language, code, stdin }),
            });

            const data = await res.json();

            if (data.error) {
                setOutput(data.error);
                setIsError(true);
            } else {
                setOutput(data.output);
                setIsError(data.isError);
            }
        } catch (error) {
            setOutput('Server connection error occurred.');
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            setCode(event.target.result);
        };
        reader.readAsText(file);

        // Reset input so same file can be uploaded again if needed
        e.target.value = '';
    };

    return (
        <div className="compiler-page">
            <div className="compiler-toolbar">
                <div className="toolbar-left">
                    <div className="file-tab">
                        <Menu size={16} />
                        main.{language === 'python' ? 'py' : language === 'javascript' ? 'js' : language}
                    </div>
                    <div className="file-tab-add" title="Yangi fayl" onClick={handleNewFile}>
                        +
                    </div>
                </div>

                <div className="toolbar-center font-bold">
                    Men Dasturchi Bo'laman IDE
                </div>

                <div className="toolbar-right">
                    {/* Hidden File Input */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        style={{ display: 'none' }}
                        accept=".js,.py,.java,.cpp,.c,.go,.txt"
                    />

                    <button
                        onClick={handleFileUploadClick}
                        className="upload-btn all-btn-hover"
                        title="Fayl yuklash"
                    >
                        <Upload size={16} />
                        Upload
                    </button>

                    <Link
                        to="/ai"
                        className="upload-btn all-btn-hover text-green-500 font-bold"
                        title="AI Assistant"
                        style={{ textDecoration: 'none' }}
                    >
                        <Sparkles size={16} className="text-green-500" />
                        AI
                    </Link>

                    <select
                        value={language}
                        onChange={handleLanguageChange}
                        className="lang-select all-btn-hover uppercase"
                    >
                        {Object.keys(LANGUAGE_VERSIONS).map((lang) => (
                            <option key={lang} value={lang}>
                                {lang}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={handleRun}
                        disabled={isLoading}
                        className="run-btn all-btn-hover"
                    >
                        RUN {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} fill="white" />}
                    </button>

                </div>
            </div>

            <div className="compiler-body">
                {/* Left Pane: Code Editor */}
                <div className="editor-pane" style={{ width: `${leftPaneWidth}%`, flex: 'none' }}>
                    <Editor
                        height="100%"
                        language={language === 'c' || language === 'cpp' ? 'cpp' : language}
                        theme={isDarkMode ? 'vs-dark' : 'light'}
                        value={code}
                        onChange={(value) => setCode(value)}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                            wordWrap: 'on',
                            lineNumbers: 'on',
                            padding: { top: 16 }
                        }}
                    />
                </div>

                {/* Resizer Handle */}
                <div className="resize-handle" onMouseDown={handleMouseDown} />

                {/* Right Pane: STDIN & STDOUT */}
                <div className="output-pane" style={{ width: `${100 - leftPaneWidth}%`, flex: 'none' }}>
                    {/* STDIN Input Form */}
                    <div className="pane-section">
                        <div className="pane-header flex justify-between">
                            <span>STDIN</span>
                            <span className="text-gray-400 capitalize normal-case">Input for the program (Optional)</span>
                        </div>
                        <div className="pane-content bg-white dark:bg-[#1e1e1e]">
                            <textarea
                                value={stdin}
                                onChange={(e) => setStdin(e.target.value)}
                                placeholder="Dastur uchun kiritish (input/scanf) ma'lumotlari..."
                                className="stdin-textarea"
                                spellCheck="false"
                            />
                        </div>
                    </div>

                    {/* Output Console */}
                    <div className="pane-section">
                        <div className="pane-header">
                            Output:
                        </div>
                        <div className={`pane-content bg-white dark:bg-[#1e1e1e] whitespace-pre-wrap ${isError ? 'output-error' : output ? 'output-success' : 'text-[var(--text-secondary)]'}`}>
                            {output || "Men Dasturchi Bo'laman IDE-ga xush kelibsiz.\nNatijani ko'rish uchun RUN tugmasini bosing."}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Compiler;
