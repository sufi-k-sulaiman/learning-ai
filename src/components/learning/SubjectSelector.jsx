import React, { useState, useRef, useEffect } from 'react';
import { Search, X, ChevronDown, Check } from 'lucide-react';
import { SUBJECTS, CATEGORIES } from '@/components/learning/SubjectData';

export default function SubjectSelector({ selectedSubjects, onSelectionChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredSubjects = SUBJECTS.filter(subject => {
        const matchesSearch = subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             subject.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !activeCategory || subject.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const toggleSubject = (subject) => {
        const isSelected = selectedSubjects.some(s => s.id === subject.id);
        if (isSelected) {
            onSelectionChange(selectedSubjects.filter(s => s.id !== subject.id));
        } else {
            onSelectionChange([...selectedSubjects, subject]);
        }
    };

    const removeSubject = (e, subjectId) => {
        e.stopPropagation();
        onSelectionChange(selectedSubjects.filter(s => s.id !== subjectId));
    };

    const groupedSubjects = filteredSubjects.reduce((acc, subject) => {
        if (!acc[subject.category]) acc[subject.category] = [];
        acc[subject.category].push(subject);
        return acc;
    }, {});

    return (
        <div ref={containerRef} className="relative w-full max-w-xl">
            {/* Selected subjects display */}
            <div 
                className="min-h-[52px] bg-white border border-gray-200 rounded-xl px-3 py-2 cursor-pointer flex items-center flex-wrap gap-2 hover:border-purple-300 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedSubjects.length === 0 ? (
                    <span className="text-gray-400 flex items-center gap-2">
                        <Search className="w-4 h-4" />
                        Select subjects to explore...
                    </span>
                ) : (
                    <>
                        {selectedSubjects.slice(0, 3).map(subject => (
                            <span 
                                key={subject.id}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-sm text-white"
                                style={{ backgroundColor: subject.color }}
                            >
                                {subject.name}
                                <button 
                                    onClick={(e) => removeSubject(e, subject.id)}
                                    className="hover:bg-white/20 rounded p-0.5"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                        {selectedSubjects.length > 3 && (
                            <span className="text-sm text-gray-500">
                                +{selectedSubjects.length - 3} more
                            </span>
                        )}
                    </>
                )}
                <ChevronDown className={`w-5 h-5 text-gray-400 ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
                    {/* Search input */}
                    <div className="p-3 border-b border-gray-100">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search subjects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Category tabs */}
                    <div className="flex gap-1 p-2 overflow-x-auto border-b border-gray-100">
                        <button
                            onClick={() => setActiveCategory(null)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                                !activeCategory ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            All
                        </button>
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                                    activeCategory === cat ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Subjects list */}
                    <div className="max-h-[400px] overflow-y-auto p-2">
                        {Object.entries(groupedSubjects).map(([category, subjects]) => (
                            <div key={category} className="mb-4">
                                <div className="text-xs font-semibold text-gray-500 px-2 mb-2">{category}</div>
                                <div className="space-y-1">
                                    {subjects.map(subject => {
                                        const isSelected = selectedSubjects.some(s => s.id === subject.id);
                                        return (
                                            <button
                                                key={subject.id}
                                                onClick={() => toggleSubject(subject)}
                                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                                                    isSelected ? 'bg-purple-50' : 'hover:bg-gray-50'
                                                }`}
                                            >
                                                <div 
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                                                    style={{ backgroundColor: `${subject.color}20` }}
                                                >
                                                    <div 
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: subject.color }}
                                                    />
                                                </div>
                                                <span className="flex-1 text-left text-sm font-medium text-gray-700">
                                                    {subject.name}
                                                </span>
                                                {isSelected && (
                                                    <Check className="w-4 h-4 text-purple-600" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                        {filteredSubjects.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                No subjects found matching "{searchQuery}"
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}