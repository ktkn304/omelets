import React from 'react';
import * as Monaco from 'monaco-editor';

interface Props {
    onDidChangeModelContent?(e: Monaco.editor.IModelContentChangedEvent): void;
}

export class TypescriptEditorComponent extends React.Component<Props> {
    private disposables = new Array<Monaco.IDisposable>();
    element: HTMLElement | null = null;
    editor: Monaco.editor.IStandaloneCodeEditor | null = null;

    getContent(): string {
        if (this.editor == null) {
            return '';
        }
        return this.editor.getValue();
    }

    async getJSCode(): Promise<Monaco.languages.typescript.EmitOutput | null> {
        if (this.editor == null) {
            return null;
        }
        const model = this.editor.getModel();
        if (model == null) {
            return null;
        }
        const worker = await Monaco.languages.typescript.getTypeScriptWorker();
        return await (await worker(model.uri)).getEmitOutput(model.uri.toString());
    }

    componentDidMount() {
        if (this.element != null) {
            this.editor = Monaco.editor.create(this.element, {
                language: 'typescript'
            });
            this.disposables.push(this.editor.onDidChangeModelContent(this.onDidChangeModelContent));
        }
    }

    componentWillUnmount() {
        if (this.editor != null) {
            this.editor.dispose();
            for (const disposable of this.disposables) {
                disposable.dispose();
            }
        }
    }

    onDidChangeModelContent = (e: Monaco.editor.IModelContentChangedEvent): void => {
        if (this.props.onDidChangeModelContent != null) {
            this.props.onDidChangeModelContent(e);
        }
    }

    render(): React.ReactNode {
        return <div style={{width: '100%', height: '100%' }} ref={el => this.element = el} />;
    }
}
