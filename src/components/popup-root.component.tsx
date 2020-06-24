import React from 'react';
import { TypescriptEditorComponent } from './editor/typescript-editor.component';
import * as Babel from '@babel/core';
import babel_preset_minify from 'babel-preset-minify';
/// <reference types="chrome" />

export function PopupRootComponent(props: {}) {
    let editor: TypescriptEditorComponent | null = null;
    const styles: React.CSSProperties = {
        paddingTop: '2rem',
        height: '600px',
        display: 'flex',
        flexDirection: 'column'
    };
    const getBookmarkletUri = async (): Promise<string> => {
        if (editor == null) {
            return '';
        }
        const output = await editor.getJSCode();
        if (output == null) {
            return '';
        }
        const code = output.outputFiles[0].text;
        const result = Babel.transform(code, { presets: [babel_preset_minify] });
        if (result == null || result.code == null) {
            return '';
        }
        return `javascript:${result.code}`;
    }

    const onClickLaunch = async () => {
        const uri = await getBookmarkletUri();
        if (uri.length === 0) {
            return;
        }

        const b64 = btoa(uri);
        chrome.tabs.executeScript({ code: `(() => { const uri = atob('${b64}'); window.location.href = uri; })()` }, () => {
            console.log('done.');
        });
    };

    const onClickBuildCopy = async () => {
        const uri = await getBookmarkletUri();
        if (uri.length === 0) {
            return;
        }
        // TODO: 編集画面を出したい
        chrome.bookmarks.create({
            title: 'bookmarklet',
            url: uri
        });
    };

    return <div style={styles} className="container">
            <h3>Omelets Bookmarklets Editor</h3>
            <div style={{ width: '500px', flexGrow: 1, border: '1px solid #606c76' }}>
                <TypescriptEditorComponent ref={ el => editor = el}></TypescriptEditorComponent>
            </div>
            <div style={{ padding: '2rem 0rem' }}>
                <button style={ { marginBottom: 0 } } onClick={onClickLaunch}>launch</button>
                <button style={ { marginBottom: 0, marginLeft: '1rem' } } onClick={onClickBuildCopy}>bookmark</button>
            </div>
        </div>;
}
