import React from "react";
import { Building2, Hash, MapPin, Mail } from "lucide-react";

const CompanyCard = ({ imageUrl, name, registrationNo, address, email }) => {
  return (
    <div className="apple-glass apple-glass-hover w-80 rounded-xl transition-all duration-300 overflow-hidden">
      <div className="relative w-full h-48 group">
        <img
          src={imageUrl || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"}
          alt={`${name} office`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">{name}</h3>
        </div>
        
        <div className="space-y-3 text-sm">
          <div className="flex items-center opacity-75 hover:opacity-100 transition-colors">
            <Hash className="w-4 h-4 mr-3 text-primary" />
            <span>{registrationNo}</span>
          </div>
          
          <div className="flex items-start opacity-75 hover:opacity-100 transition-colors">
            <MapPin className="w-4 h-4 mr-3 mt-1 text-primary shrink-0" />
            <span className="line-clamp-2">{address}</span>
          </div>
          
          <div className="flex items-center">
            <Mail className="w-4 h-4 mr-3 text-primary" />
            <a 
              href={`mailto:${email}`} 
              className="text-primary hover:opacity-80 transition-colors hover:underline"
            >
              {email}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
