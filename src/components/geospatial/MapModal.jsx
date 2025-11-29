import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from 'lucide-react';
import GeospatialMap from './GeospatialMap';

export default function MapModal({ isOpen, onClose, title, icon: Icon, iconColor, useCase, mapType }) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {Icon && (
                            <div 
                                className="w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{ backgroundColor: `${iconColor}20` }}
                            >
                                <Icon className="w-5 h-5" style={{ color: iconColor }} />
                            </div>
                        )}
                        <div>
                            <h2 className="font-semibold text-gray-900">{title}</h2>
                            <p className="text-xs text-gray-500 capitalize">{mapType} view</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => onClose(false)}
                        className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-4">
                    <GeospatialMap 
                        useCase={useCase}
                        mapType={mapType}
                        height="500px"
                        color={iconColor}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}