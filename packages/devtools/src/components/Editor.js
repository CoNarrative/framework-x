import * as monaco from 'monaco-editor'
import React from 'react'
import PropTypes from 'prop-types'
import MonacoEditor from 'react-monaco-editor'

const theme = {
  'base': 'vs-dark',
  'inherit': true,
  'rules': [
    {
      'foreground': '999999',
      'token': 'comment'
    },
    {
      'foreground': 'cccccc',
      'token': 'keyword.operator.class'
    },
    {
      'foreground': 'cccccc',
      'token': 'constant.other'
    },
    {
      'foreground': 'cccccc',
      'token': 'source.php.embedded.line'
    },
    {
      'foreground': 'f2777a',
      'token': 'variable'
    },
    {
      'foreground': 'f2777a',
      'token': 'support.other.variable'
    },
    {
      'foreground': 'f2777a',
      'token': 'string.other.link'
    },
    {
      'foreground': 'f2777a',
      'token': 'entity.name.tag'
    },
    {
      'foreground': 'f2777a',
      'token': 'entity.other.attribute-name'
    },
    {
      'foreground': 'f2777a',
      'token': 'meta.tag'
    },
    {
      'foreground': 'f2777a',
      'token': 'declaration.tag'
    },
    {
      'foreground': 'f2777a',
      'token': 'markup.deleted.git_gutter'
    },
    {
      'foreground': 'f99157',
      'token': 'constant.numeric'
    },
    {
      'foreground': 'f99157',
      'token': 'constant.language'
    },
    {
      'foreground': 'f99157',
      'token': 'support.constant'
    },
    {
      'foreground': 'f99157',
      'token': 'constant.character'
    },
    {
      'foreground': 'f99157',
      'token': 'variable.parameter'
    },
    {
      'foreground': 'f99157',
      'token': 'punctuation.section.embedded'
    },
    {
      'foreground': 'f99157',
      'token': 'keyword.other.unit'
    },
    {
      'foreground': 'ffcc66',
      'token': 'entity.name.class'
    },
    {
      'foreground': 'ffcc66',
      'token': 'entity.name.type.class'
    },
    {
      'foreground': 'ffcc66',
      'token': 'support.type'
    },
    {
      'foreground': 'ffcc66',
      'token': 'support.class'
    },
    {
      'foreground': '99cc99',
      'token': 'string'
    },
    {
      'foreground': '99cc99',
      'token': 'constant.other.symbol'
    },
    {
      'foreground': '99cc99',
      'token': 'entity.other.inherited-class'
    },
    {
      'foreground': '99cc99',
      'token': 'markup.heading'
    },
    {
      'foreground': '99cc99',
      'token': 'markup.inserted.git_gutter'
    },
    {
      'foreground': '66cccc',
      'token': 'keyword.operator'
    },
    {
      'foreground': '66cccc',
      'token': 'constant.other.color'
    },
    {
      'foreground': '6699cc',
      'token': 'entity.name.function'
    },
    {
      'foreground': '6699cc',
      'token': 'meta.function-call'
    },
    {
      'foreground': '6699cc',
      'token': 'support.function'
    },
    {
      'foreground': '6699cc',
      'token': 'keyword.other.special-method'
    },
    {
      'foreground': '6699cc',
      'token': 'meta.block-level'
    },
    {
      'foreground': '6699cc',
      'token': 'markup.changed.git_gutter'
    },
    {
      'foreground': 'cc99cc',
      'token': 'keyword'
    },
    {
      'foreground': 'cc99cc',
      'token': 'storage'
    },
    {
      'foreground': 'cc99cc',
      'token': 'storage.type'
    },
    {
      'foreground': 'cc99cc',
      'token': 'entity.name.tag.css'
    },
    {
      'foreground': 'cdcdcd',
      'background': 'f2777a',
      'token': 'invalid'
    },
    {
      'foreground': 'cdcdcd',
      'background': '99cccc',
      'token': 'meta.separator'
    },
    {
      'foreground': 'cdcdcd',
      'background': 'cc99cc',
      'token': 'invalid.deprecated'
    },
    {
      'foreground': 'ffffff',
      'token': 'markup.inserted.diff'
    },
    {
      'foreground': 'ffffff',
      'token': 'markup.deleted.diff'
    },
    {
      'foreground': 'ffffff',
      'token': 'meta.diff.header.to-file'
    },
    {
      'foreground': 'ffffff',
      'token': 'meta.diff.header.from-file'
    },
    {
      'foreground': '718c00',
      'token': 'markup.inserted.diff'
    },
    {
      'foreground': '718c00',
      'token': 'meta.diff.header.to-file'
    },
    {
      'foreground': 'c82829',
      'token': 'markup.deleted.diff'
    },
    {
      'foreground': 'c82829',
      'token': 'meta.diff.header.from-file'
    },
    {
      'foreground': 'ffffff',
      'background': '4271ae',
      'token': 'meta.diff.header.from-file'
    },
    {
      'foreground': 'ffffff',
      'background': '4271ae',
      'token': 'meta.diff.header.to-file'
    },
    {
      'foreground': '3e999f',
      'fontStyle': 'italic',
      'token': 'meta.diff.range'
    }
  ],
  'colors': {
    'editor.foreground': '#CCCCCC',
    'editor.background': '#2D2D2D',
    'editor.selectionBackground': '#515151',
    'editor.lineHighlightBackground': '#393939',
    'editorCursor.foreground': '#CCCCCC',
    'editorWhitespace.foreground': '#6A6A6A'
  }
}

const altEnter = e => e.keyCode === monaco.KeyCode.Enter && e.altKey

const loadEnv = (env, monaco) =>
  monaco.languages.typescript.javascriptDefaults.addExtraLib(`
    const env = {state: ${JSON.stringify(env.state)} }
    `, 'framework-x/env.d.ts')

const loadAcc = (acc, monaco) =>
  monaco.languages.typescript.javascriptDefaults.addExtraLib(`
    const acc = ${JSON.stringify(acc)} 
    `, 'framework-x/acc.d.ts')

class EditorBase extends React.Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    width: PropTypes.any,
    height: PropTypes.any
  }

  editorWillMount(monaco) {
    monaco.editor.defineTheme('tomorrow-night-eighties', theme)
    monaco.editor.setTheme('tomorrow-night-eighties')
  }

  editorDidMount(editor, monaco) {
    const { refCb, env, acc, onRun } = this.props

    refCb && refCb(editor, monaco)
    env && loadEnv(env, monaco)
    acc && loadAcc(acc, monaco)
    onRun && editor.onKeyDown((e) => {
      if (altEnter(e)) {
        onRun(this.props.value)
      }
    })
  }

  onChange(value) {
    this.props.onChange(value)
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.value !== this.props.value
  }

  render() {
    return (
      <MonacoEditor
        ref={this.props.innerRef}
        value={this.props.value}
        options={{
          lineNumbers: 'off',
          fontSize: 16,
          minimap: { enabled: false }
        }}
        theme={'tomorrow-night-eighties'}
        // language={this.props.language || 'javascript'}
        language={'javascript'}
        width={this.props.width || '100%'}
        height={this.props.height || 350}
        editorWillMount={this.editorWillMount.bind(this)}
        editorDidMount={this.editorDidMount.bind(this)}
        onChange={this.onChange.bind(this)}
      />
    )
  }
}

/**
 * General purpose interactive editor
 * Reacts to `value` change only.
 * Returns editor instance via `refCb`
 * If provided:
 * - `onRun` function is executed when `alt + enter` keypress and editor focused
 * - `env` and `acc` are loaded into the editor if provided
 * @type {React.ForwardRefExoticComponent<React.PropsWithoutRef<{}> & React.RefAttributes<unknown>>}
 */
export const Editor = React.forwardRef((props, ref) => <EditorBase
  innerRef={ref}  {...props} />)

