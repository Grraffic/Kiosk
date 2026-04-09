import { FaMapMarkerAlt, FaUser, FaPhone, FaExternalLinkAlt } from 'react-icons/fa';
import { type LocaleInfo as LocaleInfoType } from '../../types';

export default function LocaleInfo({ data }: { data: LocaleInfoType }) {
  return (
    <section id="locale-info" className="px-4 sm:px-6 fade-in">
      <div className="glass-card rounded-2xl p-6 md:p-8 relative overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <h2 className="section-title">
          <FaMapMarkerAlt className="text-amber-400 animate-float" />
          Locale Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-5">
            <InfoItem
              icon={<span className="text-amber-400 font-bold text-xs">LOCALE</span>}
              label="Locale"
              value={data.locale}
              large
            />
            <InfoItem
              icon={<FaMapMarkerAlt className="text-amber-400" />}
              label="Address"
              value={data.address}
            />
          </div>

          <div className="space-y-5">
            <InfoItem
              icon={<FaUser className="text-amber-400" />}
              label="Contact Person"
              value={data.contactPerson}
            />
            <InfoItem
              icon={<FaPhone className="text-amber-400" />}
              label="Contact Details"
              value={data.contactDetails}
            />
          </div>
        </div>

        {/* Interactive Embedded Map */}
        <div className="w-full h-56 md:h-72 mt-8 rounded-xl overflow-hidden border border-white/5 relative shadow-lg">
           {(() => {
             let mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(data.address)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
             
             // If the admin pasted the exact Google Maps "Embed a Map" HTML directly
             if (data.googleMapLink?.includes('<iframe') && data.googleMapLink?.includes('src="')) {
               const match = data.googleMapLink.match(/src="([^"]+)"/);
               if (match && match[1]) {
                 mapSrc = match[1];
               }
             } 
             // Or if they just pasted the pb= embed link itself
             else if (data.googleMapLink?.includes('google.com/maps/embed')) {
               mapSrc = data.googleMapLink;
             }

             return (
               <iframe
                 width="100%"
                 height="100%"
                 frameBorder="0"
                 style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                 src={mapSrc}
                 allowFullScreen
                 title="Locale Map"
               ></iframe>
             );
           })()}
           
           {/* Fallback External Link overlay for touch reliability */}
           {data.googleMapLink && (
             <a
               href={data.googleMapLink}
               target="_blank"
               rel="noopener noreferrer"
               className="absolute bottom-4 right-4 inline-flex items-center gap-2 bg-navy-900/90 hover:bg-navy-800 backdrop-blur-md text-amber-400 border border-white/10 font-bold px-4 py-2 rounded-lg transition-all duration-200 text-xs shadow-xl"
             >
               <FaExternalLinkAlt />
               Open App
             </a>
           )}
        </div>
      </div>
    </section>
  );
}

function InfoItem({
  label,
  value,
  large,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  large?: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-white font-medium leading-snug ${large ? 'text-xl font-bold gold-text' : 'text-sm'}`}>
        {value}
      </p>
    </div>
  );
}
