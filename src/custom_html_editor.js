import { AtomicBlockUtils,
  ContentBlock,
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  CharacterMetadata,
} from 'draft-js';


var Immutable = require('immutable');
var List = Immutable.List,
    Repeat = Immutable.Repeat;

import {stateToHTML} from 'draft-js-export-html'
import React, { Component } from 'react';

class CustomHTMLEditor extends Component {
    constructor(){
      super()
      this.state = {
        editorState: EditorState.createEmpty()
      }
      this.renderBlock = this.renderBlock.bind(this)
      this.onAddHTML = this.onAddHTML.bind(this)
      this.printHTML = this.printHTML.bind(this)
      this.logState = this.logState.bind(this)
      this.onChange = (editorState) => this.setState({editorState});
      this.focus = () => this.refs.editor.focus();


      const blockRenderMap = Immutable.Map({
          'rawHTML': {
            // element is used during paste or html conversion to auto match your component;
            // it is also retained as part of this.props.children and not stripped out
            element: 'div',
            wrapper: RawHTMLComponent,
          }
        });

    }

    onAddHTML(){
      console.log("add html: ",this.refs.textarea.value)
      let editorState = this.state.editorState
      const contentState = editorState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity(
        'CUSTOM_HTML',
        'IMMUTABLE',
        {rawHTML: this.refs.textarea.value}
      );

      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      const newEditorState = EditorState.set(
        editorState,
        {currentContent: contentStateWithEntity}
      );


      // let ph = this.refs.textarea.value
      // var charData = CharacterMetadata.create({ entity: entityKey });
      //
      // let newContent = new ContentBlock({
      //   key: '2werere',
      //   type: 'custom_html',
      //   text: ph,
      //   characterList: null
      // })
      //
      // let newContent = ContentState.crateFromText("")
      //
      //
      // this.setState({
      //   editorState: EditorState.push(editorState, newContent, 'insert-fragment')
      // }, () => {
      //   //setTimeout(() => this.focus(), 0);
      // });

      this.setState({
        editorState: AtomicBlockUtils.insertAtomicBlock(
          newEditorState,
          entityKey,
          this.refs.textarea.value
        )
      }, () => {
        setTimeout(() => this.focus(), 0);
      });

    }

    printHTML(){
      console.log(stateToHTML(this.state.editorState.getCurrentContent()))
    }

    logState(){
      const content = this.state.editorState.getCurrentContent();
      console.log(convertToRaw(content));
    }

    /*
    Called by the editor to render a block
    */
    renderBlock(block) {
      if (block.getType() === 'atomic') {
        console.log("Atomic Block ", block)
        return {
          component: RawHTMLComponent,
          editable: false
        };
      }
      console.log("BlockType: ", block.getType())
      return null;
    }

    render(){
      return(
        <div style={{border:"1px solid #ccc", margin:"20px", padding:"20px"}}>
          <textarea ref="textarea" style={{width:"100%", height:"200px"}} defaultValue='<strong>Hello World</strong>'>

          </textarea>
          <button onClick={this.onAddHTML}>Add HTML</button>
          <Editor
            blockRendererFn={this.renderBlock}
            editorState={this.state.editorState}
            onChange={this.onChange}
            placeholder="Enter some text..."
            ref="editor" />

            <button onClick={this.printHTML}>Print HTML</button>
            <button onClick={this.logState}>Log State</button>
        </div>
        )
    }
}


class RawHTMLComponent extends Component{
  componentDidMount(){
    //console.log("=> ",this.props.block)
    window.block = this.props.block
    ///this.refs.container.dangerouslySetInnerHTML(this.props)
  }
  render(){
    return(
      <div class="rawHTML" style={{padding:"0"}} ref='container' dangerouslySetInnerHTML={{__html:this.props.block.text}}></div>
    )
  }
}

export default CustomHTMLEditor;
