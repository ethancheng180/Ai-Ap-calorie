import { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

export default function ImageUploader({ onImageSelected }) {
    const [dragActive, setDragActive] = useState(false);
    const [preview, setPreview] = useState(null);
    const inputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files[0]);
        }
    };

    const handleFiles = (file) => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreview(e.target.result);
                onImageSelected(file, e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearImage = (e) => {
        e.stopPropagation();
        setPreview(null);
        onImageSelected(null, null);
        if (inputRef.current) inputRef.current.value = '';
    };

    return (
        <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            style={{
                width: '100%',
                minHeight: '300px',
                border: `2px dashed ${dragActive ? 'var(--color-accent)' : 'var(--color-bg-tertiary)'}`,
                borderRadius: 'var(--radius-lg)',
                backgroundColor: dragActive ? 'rgba(0,122,255,0.05)' : 'var(--color-bg-secondary)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 200ms ease',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <input
                ref={inputRef}
                type="file"
                style={{ display: 'none' }}
                onChange={handleChange}
                accept="image/*"
            />

            {preview ? (
                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                    <img
                        src={preview}
                        alt="Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <button
                        onClick={clearImage}
                        style={{
                            position: 'absolute',
                            top: 'var(--space-4)',
                            right: 'var(--space-4)',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            borderRadius: '50%',
                            padding: '8px',
                            display: 'flex',
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>
            ) : (
                <div className="flex-center flex-col gap-4" style={{ textAlign: 'center', pointerEvents: 'none' }}>
                    <div style={{
                        padding: '20px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-bg-primary)',
                        color: 'var(--color-text-secondary)'
                    }}>
                        <Upload size={32} />
                    </div>
                    <div>
                        <p className="text-body" style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>Click or drag food image here</p>
                        <p className="text-caption">Supports JPG, PNG, WEBP</p>
                    </div>
                </div>
            )}
        </div>
    );
}
