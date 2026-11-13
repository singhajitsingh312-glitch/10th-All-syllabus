import React, { useState } from 'react';
import JSZip from 'jszip';
import { Download, FileCode2, Copy, Check } from 'lucide-react';
import { ANDROID_PROJECT_FILES } from '../data/androidProjectManifest';

export const AndroidProjectExplorer: React.FC = () => {
  const [selectedPath, setSelectedPath] = useState(ANDROID_PROJECT_FILES[0].path);
  const [copied, setCopied] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);

  const activeFile =
    ANDROID_PROJECT_FILES.find((f) => f.path === selectedPath) || ANDROID_PROJECT_FILES[0];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleDownloadZip = async () => {
    setDownloadingZip(true);
    try {
      const zip = new JSZip();
      const root = zip.folder('SmartClass10-AndroidStudio');
      ANDROID_PROJECT_FILES.forEach((f) => {
        root?.file(f.path, f.content);
      });
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'SmartClass10-AndroidStudio-Project.zip';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setDownloadingZip(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-blue-700">
            Kotlin · Jetpack Compose · Material 3 · Firebase Auth, Firestore, Storage & FCM · Media3 ExoPlayer
          </p>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">
            Android Studio Project Source & Export
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Inspect every Gradle, Manifest, Repository, ViewModel, and Compose screen file or export the complete Android Studio project as a ZIP.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadZip}
          disabled={downloadingZip}
          className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>{downloadingZip ? 'Packaging ZIP...' : 'Download Android Project (.zip)'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 space-y-1 max-h-[640px] overflow-y-auto">
          <p className="text-xs font-semibold text-slate-500 px-2 pb-2">
            Project Files ({ANDROID_PROJECT_FILES.length})
          </p>
          {ANDROID_PROJECT_FILES.map((file) => {
            const active = file.path === activeFile.path;
            return (
              <button
                key={file.path}
                type="button"
                onClick={() => setSelectedPath(file.path)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono-tabular flex items-center gap-2 transition-colors cursor-pointer ${
                  active ? 'bg-blue-50 text-blue-800 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <FileCode2 className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{file.path}</span>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-8 bg-slate-950 text-slate-100 rounded-2xl overflow-hidden border border-slate-800 flex flex-col max-h-[640px]">
          <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-4">
            <span className="text-xs font-mono-tabular text-blue-300 truncate">{activeFile.path}</span>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 cursor-pointer whitespace-nowrap shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="p-4 text-xs font-mono-tabular overflow-auto leading-relaxed text-slate-200">
            <code>{activeFile.content}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
