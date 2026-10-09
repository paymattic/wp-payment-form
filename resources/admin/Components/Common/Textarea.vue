<template>  
    <div class="textarea-wrapper">  
        <textarea  
            :id="textareaId"  
            class="tiny-mce-textfield"  
            :value="localValue"  
            @input="handleInput"  
        ></textarea>  
    </div>  
</template>  

<script>  
export default {  
    name: 'Textarea',  
    props: {  
        value: {  
            type: String,  
            default: ''  
        },  
        placeholder: {  
            type: String,  
            default: ''  
        },  
        rows: {  
            type: Number,  
            default: 5  
        },  
        editorOptions: {  
            type: Object,  
            default: () => ({})  
        }  
    },  
    data() {  
        return {  
            textareaId: `textarea_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,  
            editorInstance: null,  
            localValue: this.value,  
            isInitialized: false,  
            hasWpEditor: typeof window !== 'undefined' && !!window.wp?.editor,  
            initRetryCount: 0,  
            maxRetries: 3,  
            updateTimeout: null  
        };  
    },  
    mounted() {  
        this.$nextTick(this.initEditorWithRetry);  
    },  
    methods: {  
        async initEditorWithRetry() {  
            if (this.initRetryCount >= this.maxRetries) {  
                console.error('Failed to initialize editor after multiple attempts');  
                return;  
            }  

            if (!window.tinymce) {  
                this.initRetryCount++;  
                setTimeout(() => this.initEditorWithRetry(), 100);  
                return;  
            }  

            this.initializeEditor();  
        },  
        initializeEditor() {  
            if (this.hasWpEditor) {  
                window.wp.editor.remove(this.textareaId);  
            }  

            const defaultConfig = {  
                selector: `#${this.textareaId}`,  
                menubar: false,  
                statusbar: false,  
                toolbar: false,  
                plugins: 'lists link',  
                height: this.rows * 25,  
                placeholder: this.placeholder,  
                forced_root_block: false, // Prevent automatic <p> tags  
                remove_linebreaks: true, // Preserve line breaks  
                convert_newlines_to_brs: false, // Convert newlines to <br> instead of <p>  
                remove_trailing_brs: true, // Keep trailing line breaks  
                content_style: `  
                    .mce-content-body {  
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;  
                        font-size: 14px;  
                        line-height: 1.5;  
                        color: #606266;  
                    }
                    .mce-content-body p {
                        color: #999;
                        font-style: normal;
                        font-size: 14px;
                        opacity: 1; 
                    }
                `, 
                init_instance_callback: (editor) => {  
                    this.isInitialized = true;  
                    this.setInitialContent(this.localValue || '');  
                },  
                setup: (editor) => {  
                    this.editorInstance = editor;  

                    editor.on('init', () => {  
                        if (!this.localValue) {
                            editor.setContent(`<p>${this.placeholder}</p>`);  
                        }   
                    });  

                    editor.on('focus', () => {  
                        const content = this.editorInstance.getContent({ format: 'raw' }).trim();
                        if (content === `<p>${this.placeholder}</p>`) {  
                            this.editorInstance.setContent('');  
                        }  
                    });
                    editor.on('change keyup paste', this.debouncedUpdate);  
                    editor.on('blur', this.updateContent);  
                }  
            };  

            const finalConfig = {  
                ...defaultConfig,  
                ...this.editorOptions  
            };  

            try {  
                tinymce.init(finalConfig).then(() => {  
                    if (this.editorInstance) {  
                        this.setInitialContent(this.localValue || '');  
                    }  
                });  
            } catch (error) {  
                console.error('TinyMCE initialization error:', error);  
                this.initRetryCount++;  
                setTimeout(() => this.initEditorWithRetry(), 100);  
            }  
        },  
        setInitialContent(content) {  
            if (!this.editorInstance) return;  
            
            // Remove any existing <p> tags from the content  
            const cleanContent = this.cleanContent(content) || `<p>${this.placeholder}</p>`;  
            this.editorInstance.setContent(cleanContent, { format: 'raw' });  
        },  
        cleanContent(content) {  
            if (!content) return '';  
            
            // Remove <p> tags but preserve content and line breaks  
            return content  
            .replace(/<[^>]*>/g, '')  // Remove all HTML tags  
            .replace(/&[^;]+;/g, '')  // Remove HTML entities  
            .replace(/(\r\n|\n|\r)/gm, '')  // Remove line breaks  
            .replace(/\s+/g, ' ')  // Normalize multiple spaces  
            .replace(/;/g, '')  // Remove semicolons  
            .replace(/\u00A0/g, '')  // Remove non-breaking spaces  
            .trim();  
        },  
        debouncedUpdate() {  
            clearTimeout(this.updateTimeout);  
            this.updateTimeout = setTimeout(() => {  
                this.updateContent();  
            }, 150);  
        },  
        handleInput(event) {  
            const newValue = event.target.value.replace(/(\r\n|\n|\r)/gm, ''); 
            this.localValue = newValue;  
            this.$emit('input', newValue);  
        },  
        updateContent() {  
            if (!this.editorInstance) return;  

            // Get content and clean it  
            let content = this.editorInstance.getContent({ format: 'raw' }).trim();  
            content = this.cleanContent(content);  

            // if (!content) {  
            //     this.editorInstance.setContent(`<p>${this.placeholder}</p>`);
            // }  
            if (!content) {  
                this.editorInstance.setContent('');
            }  

            if (content !== this.localValue) {  
                this.localValue = content;  
                this.$emit('input', content);  
                this.$emit('change', content);  
            }  
        },  
        insertContent(content) {  
            if (!this.editorInstance || !content) return;  
            
            const cleanContent = this.cleanContent(content);  
            this.editorInstance.insertContent(cleanContent);  
            this.updateContent();  
        }  
    },  
    watch: {  
        value: {  
            handler(newValue) {  
                if (this.localValue !== newValue) {  
                    this.localValue = newValue;  

                    if (this.editorInstance && this.isInitialized) {  
                        const currentContent = this.cleanContent(  
                            this.editorInstance.getContent({ format: 'raw' })  
                        ).trim();  
                        if (newValue !== currentContent) {  
                            this.setInitialContent(newValue || '');  
                        }  
                    }  
                }  
            },  
            immediate: true  
        }  
    },  
    beforeDestroy() {  
        clearTimeout(this.updateTimeout);  
        
        if (this.editorInstance) {  
            try {  
                this.editorInstance.off('change keyup paste', this.debouncedUpdate);  
                this.editorInstance.off('blur', this.updateContent);  
                tinymce.remove(`#${this.textareaId}`);  
                this.editorInstance = null;  
            } catch (error) {  
                console.error('Error cleaning up editor:', error);  
            }  
        }  
    }  
};  
</script>  

<style scoped>  
.textarea-wrapper {  
    border: 1px solid #D6DAE1;  
    border-radius: 8px;  
    padding: 0 8px;  
    background-color: #fff;  
}  

.tiny-mce-textfield {  
    width: 100%;  
    min-height: 150px;  
    border: none;  
    outline: none;  
    resize: vertical;  
    padding: 10px;  
    font-size: 14px;  
    line-height: 1.5;  
    background-color: transparent;  
}  

.textarea-wrapper:focus-within {  
    border-color: #409EFF;  
    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);  
}

/* Remove border from TinyMCE editor container */
::v-deep .mce-tinymce,
::v-deep .tox-tinymce {
    border: none !important;
    box-shadow: none !important;
}
</style>