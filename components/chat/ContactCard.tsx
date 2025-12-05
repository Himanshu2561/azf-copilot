'use client';

import type { Attachment } from '@/lib/api/chat';

interface ContactCardProps {
  attachments: Attachment[];
}

interface ContactInfo {
  phone?: string;
  email?: string;
  location?: string;
  website?: string;
}

export default function ContactCard({ attachments }: ContactCardProps) {
  console.log('[ContactCard] Rendering with attachments:', attachments);
  
  // Extract contact information from adaptive cards
  const extractContactInfo = (): ContactInfo => {
    const info: ContactInfo = {};
    console.log('[ContactCard] Extracting contact info from', attachments.length, 'attachments');

    attachments.forEach((attachment, index) => {
      console.log(`[ContactCard] Processing attachment ${index}:`, {
        contentType: attachment.contentType,
        hasContent: !!attachment.content,
        hasBody: !!attachment.content?.body
      });

      if (
        attachment.contentType === 'application/vnd.microsoft.card.adaptive' &&
        attachment.content?.body
      ) {
        const body = attachment.content.body;
        console.log(`[ContactCard] Attachment ${index} body:`, JSON.stringify(body, null, 2));
        
        // Find the label (TextBlock with weight "Bolder" or "bolder")
        const labelBlock = body.find((item: any) => 
          item.type === 'TextBlock' && 
          (item.weight === 'Bolder' || item.weight === 'bolder')
        );
        
        console.log(`[ContactCard] Label block found:`, labelBlock);
        
        // Find the value (TextBlock without weight "Bolder")
        const valueBlock = body.find((item: any) => 
          item.type === 'TextBlock' && 
          item.weight !== 'Bolder' && 
          item.weight !== 'bolder' &&
          item.text !== labelBlock?.text
        );

        console.log(`[ContactCard] Value block found:`, valueBlock);

        if (labelBlock && valueBlock) {
          const title = labelBlock.text?.toLowerCase() || '';
          const value = valueBlock.text || '';
          
          console.log(`[ContactCard] Processing - title: "${title}", value: "${value}"`);

          if (title.includes('contact number') || title.includes('phone')) {
            info.phone = value;
            console.log(`[ContactCard] Found phone: ${value}`);
          } else if (title.includes('email')) {
            info.email = value;
            console.log(`[ContactCard] Found email: ${value}`);
          } else if (title.includes('location')) {
            info.location = value;
            console.log(`[ContactCard] Found location: ${value}`);
          } else if (title.includes('website')) {
            info.website = value;
            console.log(`[ContactCard] Found website: ${value}`);
          }
        } else {
          console.log(`[ContactCard] Could not find both label and value blocks`);
        }
      }
    });

    console.log('[ContactCard] Extracted contact info:', info);
    return info;
  };

  const contactInfo = extractContactInfo();
  console.log('[ContactCard] Final contact info:', contactInfo);

  // Icon components
  const PhoneIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );

  const EmailIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );

  const LocationIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  const WebsiteIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  );

  const ContactItem = ({ 
    icon, 
    label, 
    value, 
    href 
  }: { 
    icon: React.ReactNode; 
    label: string; 
    value?: string; 
    href?: string 
  }) => {
    if (!value) return null;

    const content = (
      <div 
        className="flex items-start gap-3 p-3"
        style={{
          borderRadius: '10px',
          background: 'linear-gradient(135deg, rgba(174, 7, 117, 0.05) 0%, rgba(2, 61, 130, 0.05) 100%)'
        }}
      >
        {/* Icon with rounded background */}
        <div 
          className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white"
          style={{ background: '#AE0775' }}
        >
          {icon}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium mb-1" style={{ color: '#4A5565' }}>
            {label}
          </p>
          <p className="text-sm font-medium wrap-break-word" style={{ color: '#023D82' }}>
            {value}
          </p>
        </div>
      </div>
    );

    if (href) {
      return (
        <a 
          href={href} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block hover:opacity-80 transition-opacity"
        >
          {content}
        </a>
      );
    }

    return content;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm max-w-full sm:max-w-sm my-2">
      {/* Header */}
      <div 
        className="px-4 py-4 sm:px-5 sm:py-5"
        style={{ background: '#AE0775' }}
      >
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">
          Contact Aspire Zone
        </h3>
      </div>

      {/* Contact Information */}
      <div className="p-4 sm:p-5 space-y-3">
        {contactInfo.website && (
          <ContactItem
            icon={<WebsiteIcon />}
            label="Website"
            value={contactInfo.website}
            href={contactInfo.website.startsWith('http://') || contactInfo.website.startsWith('https://') 
              ? contactInfo.website 
              : `https://${contactInfo.website}`}
          />
        )}
        
        {contactInfo.phone && (
          <ContactItem
            icon={<PhoneIcon />}
            label="Phone"
            value={contactInfo.phone}
            href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
          />
        )}
        
        {contactInfo.email && (
          <ContactItem
            icon={<EmailIcon />}
            label="Email"
            value={contactInfo.email}
            href={`mailto:${contactInfo.email}`}
          />
        )}
        
        {contactInfo.location && (
          <ContactItem
            icon={<LocationIcon />}
            label="Location"
            value={contactInfo.location}
          />
        )}
      </div>
    </div>
  );
}

