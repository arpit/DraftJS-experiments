import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Editor, EditorState, RichUtils, AtomicBlockUtils } from 'draft-js';

class App extends React.Component {
        constructor(props) {
          super(props);
          this.state = {editorState: EditorState.createEmpty()};

          this.focus = () => this.refs.editor.focus();
          this.onChange = (editorState) => this.setState({editorState});

          this.handleKeyCommand = (command) => this._handleKeyCommand(command);
          this.onTab = (e) => this._onTab(e);
          this.toggleBlockType = (type) => this._toggleBlockType(type);
          this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
          this.loadImage = this._loadImage.bind(this)
        }

        _loadImage(){
          const {editorState, urlValue, urlType} = this.state;
          const contentState = editorState.getCurrentContent();
          alert(urlType)
          const contentStateWithEntity = contentState.createEntity(
            "image",
            'IMMUTABLE',
            {src: "http://static.tvgcdn.net/rovi/showcards/tvshow/100521/thumbs/16922131_1200x1600.jpg"}
          );
          const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
          const newEditorState = EditorState.set(
            editorState,
            {currentContent: contentStateWithEntity}
          );

          this.setState({
            editorState: AtomicBlockUtils.insertAtomicBlock(
              newEditorState,
              entityKey,
              ' '
            ),
            showURLInput: false,
            urlValue: '',
          }, () => {
            setTimeout(() => this.focus(), 0);
          });
        }

        _handleKeyCommand(command) {
          const {editorState} = this.state;
          const newState = RichUtils.handleKeyCommand(editorState, command);
          if (newState) {
            this.onChange(newState);
            return true;
          }
          return false;
        }

        _onTab(e) {
          const maxDepth = 4;
          this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
        }

        _toggleBlockType(blockType) {
          this.onChange(
            RichUtils.toggleBlockType(
              this.state.editorState,
              blockType
            )
          );
        }

        _toggleInlineStyle(inlineStyle) {
          this.onChange(
            RichUtils.toggleInlineStyle(
              this.state.editorState,
              inlineStyle
            )
          );
        }

        render() {
          const {editorState} = this.state;

          // If the user changes block type before entering any text, we can
          // either style the placeholder or hide it. Let's just hide it now.
          let className = 'RichEditor-editor';
          var contentState = editorState.getCurrentContent();
          if (!contentState.hasText()) {
            if (contentState.getBlockMap().first().getType() !== 'unstyled') {
              className += ' RichEditor-hidePlaceholder';
            }
          }

          return (
            <div className="RichEditor-root">
              <BlockStyleControls
                editorState={editorState}
                onToggle={this.toggleBlockType}
              />
              <InlineStyleControls
                editorState={editorState}
                onToggle={this.toggleInlineStyle}
              />
              <div onClick={this.loadImage}>Image</div>
              <div className={className} onClick={this.focus}>
                <Editor
                  blockRendererFn={mediaBlockRenderer}
                  blockStyleFn={getBlockStyle}
                  customStyleMap={styleMap}
                  editorState={editorState}
                  handleKeyCommand={this.handleKeyCommand}
                  onChange={this.onChange}
                  onTab={this.onTab}
                  placeholder="Tell a story..."
                  ref="editor"
                  spellCheck={true}
                />
              </div>
            </div>
          );
        }
      }

      const styleMap = {
       CODE: {
         backgroundColor: 'rgba(0, 0, 0, 0.05)',
         fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
         fontSize: 16,
         padding: 2,
       },
     };

     function mediaBlockRenderer(block) {
       if (block.getType() === 'atomic') {
         return {
           component: Media,
           editable: false,
         };
       }

       return null
     }

     function getBlockStyle(block) {
       switch (block.getType()) {
         case 'blockquote': return 'RichEditor-blockquote';
         default: return null;
       }
     }

     class StyleButton extends React.Component {
       constructor() {
         super();
         this.onToggle = (e) => {
           e.preventDefault();
           this.props.onToggle(this.props.style);
         };
       }

       render() {
         let className = 'RichEditor-styleButton';
         if (this.props.active) {
           className += ' RichEditor-activeButton';
         }

         return (
           <span className={className} onMouseDown={this.onToggle}>
             {this.props.label}
           </span>
         );
       }
     }

     const Audio = (props) => {
       return <audio controls src={props.src} style={styles.media} />;
     };

     const Image = (props) => {
       return <img src={props.src} style={styles.media} />;
     };

     const Video = (props) => {
       return <video controls src={props.src} style={styles.media} />;
     };

     const Media = (props) => {
       const entity = props.contentState.getEntity(
         props.block.getEntityAt(0)
       );
       const {src} = entity.getData();
       const type = entity.getType();

       let media;
       if (type === 'audio') {
         media = <Audio src={src} />;
       } else if (type === 'image') {
         media = <Image src={src} />;
       } else if (type === 'video') {
         media = <Video src={src} />;
       }

       return media;
     };

     const styles = {
             root: {
               fontFamily: '\'Georgia\', serif',
               padding: 20,
               width: 600,
             },
             buttons: {
               marginBottom: 10,
             },
             urlInputContainer: {
               marginBottom: 10,
             },
             urlInput: {
               fontFamily: '\'Georgia\', serif',
               marginRight: 10,
               padding: 3,
             },
             editor: {
               border: '1px solid #ccc',
               cursor: 'text',
               minHeight: 80,
               padding: 10,
             },
             button: {
               marginTop: 10,
               textAlign: 'center',
             },
             media: {
               width: '100%',
             },
           };

     const BLOCK_TYPES = [
       {label: 'H1', style: 'header-one'},
       {label: 'H2', style: 'header-two'},
       {label: 'H3', style: 'header-three'},
       {label: 'H4', style: 'header-four'},
       {label: 'H5', style: 'header-five'},
       {label: 'H6', style: 'header-six'},
       {label: 'Blockquote', style: 'blockquote'},
       {label: 'UL', style: 'unordered-list-item'},
       {label: 'OL', style: 'ordered-list-item'},
       {label: 'Code Block', style: 'code-block'},
     ];

     const BlockStyleControls = (props) => {
       const {editorState} = props;
       const selection = editorState.getSelection();
       const blockType = editorState
         .getCurrentContent()
         .getBlockForKey(selection.getStartKey())
         .getType();

       return (
         <div className="RichEditor-controls">
           {BLOCK_TYPES.map((type) =>
             <StyleButton
               key={type.label}
               active={type.style === blockType}
               label={type.label}
               onToggle={props.onToggle}
               style={type.style}
             />
           )}
         </div>
       );
     };

     var INLINE_STYLES = [
       {label: 'Bold', style: 'BOLD'},
       {label: 'Italic', style: 'ITALIC'},
       {label: 'Underline', style: 'UNDERLINE'},
       {label: 'Monospace', style: 'CODE'},
     ];

     const InlineStyleControls = (props) => {
       var currentStyle = props.editorState.getCurrentInlineStyle();
       return (
         <div className="RichEditor-controls">
           {INLINE_STYLES.map(type =>
             <StyleButton
               key={type.label}
               active={currentStyle.has(type.style)}
               label={type.label}
               onToggle={props.onToggle}
               style={type.style}
             />
           )}
         </div>
       );
     };

export default App;
