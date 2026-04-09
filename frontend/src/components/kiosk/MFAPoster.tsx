import { FaGoogleDrive, FaImage } from 'react-icons/fa';

export default function MFAPoster({ 
  posterUrl, 
  driveLink 
}: { 
  posterUrl?: string; 
  driveLink?: string; 
}) {
  return (
    <section id="mfa-poster" className="px-4 sm:px-6 fade-in">
      <div className="glass-card rounded-2xl overflow-hidden relative group">
        {/* Banner header */}
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-amber-400 m-0 flex items-center gap-2">
            MFA Poster
          </h2>
          
          {driveLink && (
            <a
              href={driveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-amber-500/20 text-amber-300 px-4 py-2 rounded-lg text-sm transition-colors"
            >
              <FaGoogleDrive />
              Open in Google Drive
            </a>
          )}
        </div>

        {/* Poster Content */}
        <div className="p-6 md:p-8 flex justify-center">
          {posterUrl ? (
            <img 
              src={posterUrl} 
              alt="MFA Poster" 
              className="max-h-[70vh] object-contain rounded-xl shadow-lg border border-white/10"
            />
          ) : (
            <div className="w-full max-w-2xl aspect-[3/4] sm:aspect-video rounded-xl bg-white/5 border border-dashed border-white/20 flex flex-col items-center justify-center text-gray-500">
              <FaImage className="text-4xl mb-3 opacity-50" />
              <p>No poster uploaded yet.</p>
              <p className="text-xs mt-1">Admin will provide this via Google Drive.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
