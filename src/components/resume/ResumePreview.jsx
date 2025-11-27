import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';
import { RESUME_TEMPLATES } from '@/components/resume/ResumeTemplates';

export default function ResumePreview({ data, templateId, className = '' }) {
    const template = RESUME_TEMPLATES.find(t => t.id === templateId) || RESUME_TEMPLATES[0];
    const { color, headerStyle, accentPosition } = template;

    if (!data) return null;

    const contactItems = [
        { icon: Mail, value: data.email },
        { icon: Phone, value: data.phone },
        { icon: MapPin, value: data.location },
        { icon: Linkedin, value: data.linkedin },
        { icon: Globe, value: data.portfolio },
    ].filter(item => item.value);

    return (
        <div className={`bg-white shadow-lg ${className}`} style={{ fontFamily: 'Georgia, serif' }}>
            {/* Header with accent */}
            {accentPosition === 'full' && (
                <div className="h-3" style={{ backgroundColor: color }} />
            )}
            {accentPosition === 'top' && (
                <div className="h-1" style={{ backgroundColor: color }} />
            )}

            <div className="p-8">
                {/* Name & Title */}
                <div className={`mb-6 ${headerStyle === 'centered' ? 'text-center' : ''}`}>
                    <h1 className="text-3xl font-bold mb-1" style={{ color: template.category === 'Classic' ? color : '#1F2937' }}>
                        {data.fullName || 'Your Name'}
                    </h1>
                    {data.title && (
                        <p className="text-lg text-gray-600">{data.title}</p>
                    )}
                    
                    {/* Contact Info */}
                    <div className={`flex flex-wrap gap-4 mt-3 text-sm text-gray-600 ${headerStyle === 'centered' ? 'justify-center' : ''}`}>
                        {contactItems.map((item, i) => (
                            <span key={i} className="flex items-center gap-1">
                                <item.icon className="w-4 h-4" />
                                {item.value}
                            </span>
                        ))}
                    </div>
                </div>

                {accentPosition === 'underline' && (
                    <div className="h-0.5 mb-6" style={{ backgroundColor: color }} />
                )}

                {/* Professional Summary */}
                {data.summary && (
                    <section className="mb-6">
                        <h2 className="text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color }}>
                            {accentPosition === 'left' && <span className="w-1 h-4" style={{ backgroundColor: color }} />}
                            Professional Summary
                        </h2>
                        <p className="text-gray-700 leading-relaxed">{data.summary}</p>
                    </section>
                )}

                {/* Experience */}
                {data.experience?.length > 0 && (
                    <section className="mb-6">
                        <h2 className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color }}>
                            {accentPosition === 'left' && <span className="w-1 h-4" style={{ backgroundColor: color }} />}
                            Experience
                        </h2>
                        {data.experience.map((exp, i) => (
                            <div key={i} className="mb-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-gray-900">{exp.title}</h3>
                                        <p className="text-gray-600">{exp.company}</p>
                                    </div>
                                    <span className="text-sm text-gray-500" style={{ color }}>{exp.duration}</span>
                                </div>
                                {exp.achievements?.length > 0 && (
                                    <ul className="mt-2 space-y-1">
                                        {exp.achievements.map((achievement, j) => (
                                            <li key={j} className="text-sm text-gray-700 flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: color }} />
                                                {achievement}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </section>
                )}

                {/* Skills */}
                {data.skills?.length > 0 && (
                    <section className="mb-6">
                        <h2 className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color }}>
                            {accentPosition === 'left' && <span className="w-1 h-4" style={{ backgroundColor: color }} />}
                            Skills
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {data.skills.map((skill, i) => (
                                <span 
                                    key={i} 
                                    className="px-3 py-1 text-sm rounded border"
                                    style={{ 
                                        backgroundColor: `${color}10`,
                                        borderColor: `${color}40`,
                                        color: color
                                    }}
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {data.education?.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color }}>
                            {accentPosition === 'left' && <span className="w-1 h-4" style={{ backgroundColor: color }} />}
                            Education
                        </h2>
                        {data.education.map((edu, i) => (
                            <div key={i} className="mb-2 flex justify-between">
                                <div>
                                    <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                                    <p className="text-gray-600">{edu.school}</p>
                                </div>
                                <span className="text-sm" style={{ color }}>{edu.year}</span>
                            </div>
                        ))}
                    </section>
                )}
            </div>
        </div>
    );
}