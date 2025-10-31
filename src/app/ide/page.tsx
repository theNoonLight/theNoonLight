"use client";

import { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

interface File {
  id: string;
  name: string;
  content: string;
  language: string;
  path: string;
}

const STORAGE_KEY = "ide-files";
const DEFAULT_FILE: File = {
  id: "file-1",
  name: "index.js",
  content: "// Start coding here...\n",
  language: "javascript",
  path: "/index.js",
};

export default function IDEPage() {
  const [files, setFiles] = useState<File[]>([DEFAULT_FILE]);
  const [activeFileId, setActiveFileId] = useState<string>("file-1");
  const [isEditorLoading, setIsEditorLoading] = useState(true);
  const [showTerminal, setShowTerminal] = useState(true);
  const [sidebarView, setSidebarView] = useState<"explorer" | "problem">("explorer");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const monacoRef = useRef<any>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminalInstanceRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  // Load files from localStorage on mount
  useEffect(() => {
    const savedFiles = localStorage.getItem(STORAGE_KEY);
    if (savedFiles) {
      try {
        const parsed = JSON.parse(savedFiles);
        if (parsed.length > 0) {
          setFiles(parsed);
          setActiveFileId(parsed[0].id);
        }
      } catch (e) {
        console.error("Error loading files:", e);
      }
    }
    setIsEditorLoading(false);
  }, []);

  // Save files to localStorage whenever they change
  useEffect(() => {
    if (!isEditorLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
    }
  }, [files, isEditorLoading]);

  // Initialize terminal
  useEffect(() => {
    if (terminalRef.current && !terminalInstanceRef.current) {
      const terminal = new Terminal({
        theme: {
          background: "#1e1e1e",
          foreground: "#cccccc",
          cursor: "#aeafad",
        },
        fontSize: 14,
        fontFamily: "Consolas, 'Courier New', monospace",
      });

      const fitAddon = new FitAddon();
      terminal.loadAddon(fitAddon);
      terminal.open(terminalRef.current);
      
      // Fit terminal to container
      setTimeout(() => fitAddon.fit(), 100);
      
      terminal.write("Welcome to the IDE Terminal!\r\n");
      terminal.write("Type 'help' for available commands.\r\n");
      terminal.write("$ ");

      terminal.onData((data) => {
        if (data === "\r") {
          terminal.write("\r\n$ ");
        } else if (data === "\u007f") {
          // Backspace
          terminal.write("\b \b");
        } else {
          terminal.write(data);
        }
      });

      terminalInstanceRef.current = terminal;
      fitAddonRef.current = fitAddon;

      const resizeObserver = new ResizeObserver(() => {
        fitAddon.fit();
      });
      resizeObserver.observe(terminalRef.current);

      return () => {
        terminal.dispose();
        resizeObserver.disconnect();
      };
    }
  }, []);

  // Resize terminal when visibility changes
  useEffect(() => {
    if (showTerminal && fitAddonRef.current) {
      setTimeout(() => fitAddonRef.current?.fit(), 100);
    }
  }, [showTerminal]);

  const activeFile = files.find((f) => f.id === activeFileId) || files[0];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Create models for all files
    files.forEach((file) => {
      const model = monaco.editor.getModel(monaco.Uri.parse(`file://${file.path}`));
      if (!model) {
        monaco.editor.createModel(file.content, file.language, monaco.Uri.parse(`file://${file.path}`));
      } else {
        model.setValue(file.content);
      }
    });

    // Set the active model
    const activeModel = monaco.editor.getModel(monaco.Uri.parse(`file://${activeFile.path}`));
    if (activeModel) {
      editor.setModel(activeModel);
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setFiles((prevFiles) =>
        prevFiles.map((file) =>
          file.id === activeFileId ? { ...file, content: value } : file
        )
      );
    }
  };

  const handleTabClick = (fileId: string) => {
    const monaco = monacoRef.current;
    if (editorRef.current && monaco) {
      const prevFile = files.find((f) => f.id === activeFileId);
      if (prevFile) {
        // Save view state
        const viewState = editorRef.current.saveViewState();
        if (viewState) {
          // Store view state if needed
        }
      }

      setActiveFileId(fileId);
      const newFile = files.find((f) => f.id === fileId);
      if (newFile) {
        let model = monaco.editor.getModel(monaco.Uri.parse(`file://${newFile.path}`));
        if (!model) {
          model = monaco.editor.createModel(
            newFile.content,
            newFile.language,
            monaco.Uri.parse(`file://${newFile.path}`)
          );
        }
        editorRef.current.setModel(model);
      }
    } else {
      setActiveFileId(fileId);
    }
  };

  const handleCloseTab = (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation();
    if (files.length === 1) {
      return; // Don't close the last file
    }

    const monaco = monacoRef.current;
    const fileIndex = files.findIndex((f) => f.id === fileId);
    const newFiles = files.filter((f) => f.id !== fileId);

    if (monaco && editorRef.current) {
      const file = files.find((f) => f.id === fileId);
      if (file) {
        const model = monaco.editor.getModel(monaco.Uri.parse(`file://${file.path}`));
        if (model) {
          model.dispose();
        }
      }
    }

    setFiles(newFiles);

    // Switch to another tab
    if (fileId === activeFileId) {
      if (fileIndex > 0) {
        setActiveFileId(newFiles[fileIndex - 1].id);
      } else {
        setActiveFileId(newFiles[0].id);
      }
    }
  };

  const handleNewFile = () => {
    const monaco = monacoRef.current;
    const newId = `file-${Date.now()}`;
    const newFile: File = {
      id: newId,
      name: `file-${files.length + 1}.js`,
      content: "",
      language: "javascript",
      path: `/file-${files.length + 1}.js`,
    };

    if (monaco && editorRef.current) {
      const model = monaco.editor.createModel(
        newFile.content,
        newFile.language,
        monaco.Uri.parse(`file://${newFile.path}`)
      );
      editorRef.current.setModel(model);
    }

    setFiles([...files, newFile]);
    setActiveFileId(newId);
  };


  return (
    <div className="h-[calc(100vh-3rem)] w-full flex flex-col bg-[#1e1e1e] mt-12">
      {/* Tab Bar */}
      <div className="flex items-center bg-[#252526] border-b border-[#3e3e42] overflow-x-auto">
        <div className="flex items-center min-w-0 flex-1">
          {files.map((file) => (
            <div
              key={file.id}
              onClick={() => handleTabClick(file.id)}
              className={`flex items-center gap-2 px-4 py-2 cursor-pointer border-r border-[#3e3e42] min-w-[150px] group ${
                activeFileId === file.id
                  ? "bg-[#1e1e1e] text-white"
                  : "bg-[#2d2d30] text-gray-400 hover:bg-[#37373d]"
              }`}
            >
              <span className="text-sm truncate flex-1">{file.name}</span>
              {files.length > 1 && (
                <button
                  onClick={(e) =>
                    handleCloseTab(e, file.id)
                  }
                  className="opacity-0 group-hover:opacity-100 hover:bg-[#3e3e42] rounded px-1"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
          ))}
          <button
            onClick={handleNewFile}
            className="px-3 py-2 text-gray-400 hover:bg-[#37373d] hover:text-white border-r border-[#3e3e42]"
            title="New File"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar with Toggle */}
        <div className="w-64 bg-[#252526] border-r border-[#3e3e42] flex flex-col">
          {/* Toggle Header */}
          <div className="border-b border-[#3e3e42]">
            <div className="flex">
              <button
                onClick={() => setSidebarView("explorer")}
                className={`flex-1 px-4 py-2 text-xs font-medium uppercase transition-colors ${
                  sidebarView === "explorer"
                    ? "bg-[#1e1e1e] text-white border-b-2 border-blue-500"
                    : "text-gray-400 hover:text-gray-300 hover:bg-[#2d2d30]"
                }`}
              >
                Explorer
              </button>
              <button
                onClick={() => setSidebarView("problem")}
                className={`flex-1 px-4 py-2 text-xs font-medium uppercase transition-colors ${
                  sidebarView === "problem"
                    ? "bg-[#1e1e1e] text-white border-b-2 border-blue-500"
                    : "text-gray-400 hover:text-gray-300 hover:bg-[#2d2d30]"
                }`}
              >
                Problem
              </button>
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto">
            {sidebarView === "explorer" ? (
              <div className="p-2">
                <div className="text-xs text-gray-500 mb-2 px-2">FILES</div>
                {files.map((file) => (
                  <div
                    key={file.id}
                    onClick={() => handleTabClick(file.id)}
                    className={`flex items-center gap-2 px-2 py-1.5 cursor-pointer text-sm rounded ${
                      activeFileId === file.id
                        ? "bg-[#37373d] text-white"
                        : "text-gray-400 hover:bg-[#2d2d30]"
                    }`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    <span className="truncate">{file.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4">
                <h2 className="text-white text-lg font-semibold mb-4">Problem Statement</h2>
                <div className="space-y-4 text-gray-300 text-sm">
                  <div>
                    <h3 className="text-white font-medium mb-2">Description</h3>
                    <p className="leading-relaxed">
                      Write a function that solves the given problem. Use the code editor to implement your solution.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-2">Requirements</h3>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Your solution should be efficient</li>
                      <li>Handle edge cases appropriately</li>
                      <li>Add comments where necessary</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-2">Example</h3>
                    <div className="bg-[#1e1e1e] p-3 rounded border border-[#3e3e42] font-mono text-xs">
                      <div className="text-green-400">Input:</div>
                      <div className="text-gray-400">nums = [1, 2, 3]</div>
                      <div className="text-green-400 mt-2">Output:</div>
                      <div className="text-gray-400">6</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-2">Constraints</h3>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>1 ≤ n ≤ 100</li>
                      <li>-1000 ≤ nums[i] ≤ 1000</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            {isEditorLoading ? (
              <div className="h-full w-full flex items-center justify-center bg-[#1e1e1e]">
                <div className="text-gray-400">Loading editor...</div>
              </div>
            ) : (
              <Editor
                height="100%"
                language={activeFile.language}
                theme="vs-dark"
                value={activeFile.content}
                onChange={handleEditorChange}
                onMount={handleEditorDidMount}
                options={{
                  minimap: { enabled: true },
                  fontSize: 14,
                  wordWrap: "on",
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  tabSize: 2,
                  insertSpaces: true,
                  formatOnPaste: true,
                  formatOnType: true,
                }}
                loading={
                  <div className="h-full w-full flex items-center justify-center bg-[#1e1e1e]">
                    <div className="text-gray-400">Loading editor...</div>
                  </div>
                }
              />
            )}
          </div>
        </div>
      </div>

      {/* Terminal Panel */}
      <div className="flex flex-col border-t border-[#3e3e42] bg-[#1e1e1e]">
        <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-[#3e3e42]">
          <span className="text-xs font-medium text-gray-400 uppercase">Terminal</span>
          <button
            onClick={() => setShowTerminal(!showTerminal)}
            className="text-gray-400 hover:text-white"
          >
            {showTerminal ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            )}
          </button>
        </div>
        {showTerminal && (
          <div
            ref={terminalRef}
            className="w-full"
            style={{ height: "200px" }}
          />
        )}
      </div>
    </div>
  );
}