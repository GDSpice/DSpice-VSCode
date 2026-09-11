/*
#--------------------------------------------------------------------------------------------------
Name:        spiceNetlistDialog.js
Author:      d.fathi
Created:     11/09/2026
Copyright:   (c) DSpice 2026
Licence:     free
#---------------------------------------------------------------------------------------------------
Description: Dialog for editing SPICE netlist files with syntax highlighting
#---------------------------------------------------------------------------------------------------
Changelog:
    - SPICE netlist syntax highlighting
    - VSCode Dark+ theme alignment
    - Line numbers with active line highlight
    - Fixed text alignment during typing
    - Support for SPICE directives, components, and models
#---------------------------------------------------------------------------------------------------
*/
//------------------Class for SPICE Netlist Editor Dialog--------------------------------//

function fSpiceNetlistDialog(self) {

    var selfDialog = this;

    selfDialog.drawing = self;
    selfDialog.isVisible = false;

    selfDialog.onSubmit = null;
    selfDialog.onCancel = null;

    // State
    selfDialog.netlistContent = '';
    selfDialog.isLoading = false;
    selfDialog.currentLine = 1;

    // Drag state
    var isDragging = false;
    var dragStartX = 0, dragStartY = 0;
    var dialogStartX = 0, dialogStartY = 0;

    // DOM refs
    var codeEditor, lineNumbers, highlightLayer, dialogEl;


    // ================================================================
    // Inject CSS - VSCode Dark+ Theme
    // ================================================================

    this.injectCSS = function() {

        var css = [

            '/* ===== SPICE Netlist Editor Dialog ===== */',

            '#spiceNetlistDialog {',
            '    position: fixed;',
            '    top: 50px;',
            '    left: 50%;',
            '    transform: translateX(-50%);',
            '    width: 750px;',
            '    max-width: 95vw;',
            '    height: 550px;',
            '    max-height: 85vh;',
            '    background: var(--vscode-editorWidget-background, #1e1e1e);',
            '    border: 1px solid var(--vscode-editorWidget-border, #454545);',
            '    border-radius: 6px;',
            '    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);',
            '    z-index: 3000;',
            '    display: none;',
            '    font-family: var(--vscode-font-family, "Segoe UI", Tahoma, Geneva, Verdana, sans-serif);',
            '    font-size: 13px;',
            '    color: var(--vscode-editor-foreground, #d4d4d4);',
            '    flex-direction: column;',
            '    overflow: hidden;',
            '}',

            '#spiceNetlistDialog.visible {',
            '    display: flex;',
            '}',

            '#spiceNetlistDialogOverlay {',
            '    position: fixed;',
            '    top: 0;',
            '    left: 0;',
            '    width: 100%;',
            '    height: 100%;',
            '    background: rgba(0, 0, 0, 0.5);',
            '    z-index: 2999;',
            '    display: none;',
            '}',

            '#spiceNetlistDialogOverlay.visible {',
            '    display: block;',
            '}',


            // ============================================================
            // Header
            // ============================================================

            '#spiceNetlistDialogHeader {',
            '    display: flex;',
            '    justify-content: space-between;',
            '    align-items: center;',
            '    padding: 8px 12px;',
            '    border-bottom: 1px solid var(--vscode-panel-border, #2b2b2b);',
            '    background: var(--vscode-titleBar-activeBackground, #3c3c3c);',
            '    cursor: move;',
            '    user-select: none;',
            '    flex-shrink: 0;',
            '}',

            '#spiceNetlistDialogTitle {',
            '    font-size: 13px;',
            '    font-weight: 400;',
            '    color: var(--vscode-titleBar-activeForeground, #cccccc);',
            '    display: flex;',
            '    align-items: center;',
            '    gap: 8px;',
            '}',

            '#spiceNetlistIcon {',
            '    font-size: 14px;',
            '    color: #569cd6;',
            '}',

            '#spiceNetlistDialogClose {',
            '    background: transparent;',
            '    border: none;',
            '    font-size: 18px;',
            '    cursor: pointer;',
            '    color: var(--vscode-titleBar-activeForeground, #cccccc);',
            '    padding: 2px 6px;',
            '    line-height: 1;',
            '    border-radius: 3px;',
            '    transition: background 0.1s;',
            '}',

            '#spiceNetlistDialogClose:hover {',
            '    background: var(--vscode-toolbar-hoverBackground, rgba(255, 255, 255, 0.1));',
            '    color: #ffffff;',
            '}',


            // ============================================================
            // Editor Container
            // ============================================================

            '.sned-editor-container {',
            '    flex: 1;',
            '    display: flex;',
            '    overflow: hidden;',
            '    position: relative;',
            '    background: var(--vscode-editor-background, #1e1e1e);',
            '}',


            // ============================================================
            // Line Numbers
            // ============================================================

            '.sned-line-numbers {',
            '    width: 50px;',
            '    background: var(--vscode-editor-background, #1e1e1e);',
            '    border-right: 1px solid var(--vscode-editorGroup-border, #444444);',
            '    padding: 10px 0;',
            '    text-align: right;',
            '    font-size: 13px;',
            '    line-height: 20px;',
            '    color: var(--vscode-editorLineNumber-foreground, #858585);',
            '    overflow: hidden;',
            '    flex-shrink: 0;',
            '    user-select: none;',
            '    font-family: "Consolas", "Courier New", monospace;',
            '    box-sizing: border-box;',
            '}',

            '.sned-line-numbers span {',
            '    display: block;',
            '    padding-right: 12px;',
            '    height: 20px;',
            '    font-size: 13px;',
            '    line-height: 20px;',
            '}',

            '.sned-line-numbers span.current {',
            '    color: var(--vscode-editorLineNumber-activeForeground, #c6c6c6);',
            '    font-weight: 600;',
            '}',


            // ============================================================
            // Editor Wrapper
            // ============================================================

            '.sned-editor-wrapper {',
            '    flex: 1;',
            '    position: relative;',
            '    overflow: hidden;',
            '    background: var(--vscode-editor-background, #1e1e1e);',
            '}',


            // ============================================================
            // Shared Textarea / Highlight Layer
            // ============================================================

            '.sned-editor-textarea,',
            '.sned-highlight-layer {',
            '    position: absolute;',
            '    top: 0;',
            '    left: 0;',
            '    width: 100%;',
            '    height: 100%;',
            '    padding: 10px 12px;',
            '    margin: 0;',
            '    border: 0;',
            '    box-sizing: border-box;',

            '    font-family: "Consolas", "Courier New", monospace;',
            '    font-size: 13px;',
            '    font-weight: 400;',
            '    font-style: normal;',
            '    font-variant: normal;',
            '    font-stretch: normal;',
            '    line-height: 20px;',
            '    letter-spacing: normal;',
            '    word-spacing: normal;',
            '    text-indent: 0;',
            '    text-rendering: auto;',
            '    text-align: start;',
            '    text-transform: none;',

            '    white-space: pre-wrap;',
            '    word-wrap: break-word;',
            '    overflow-wrap: break-word;',
            '    tab-size: 4;',
            '    -moz-tab-size: 4;',
            '    overflow: auto;',
            '}',


            // ============================================================
            // Highlight Layer
            // ============================================================

            '.sned-highlight-layer {',
            '    pointer-events: none;',
            '    z-index: 1;',
            '    color: var(--vscode-editor-foreground, #d4d4d4);',
            '    background: transparent;',
            '    scrollbar-width: none;',
            '    -ms-overflow-style: none;',
            '    overflow: auto;',
            '}',

            '.sned-highlight-layer::-webkit-scrollbar {',
            '    width: 0;',
            '    height: 0;',
            '    display: none;',
            '}',

            '.sned-highlight-layer * {',
            '    background: transparent !important;',
            '}',


            // ============================================================
            // Textarea
            // ============================================================

            '.sned-editor-textarea {',
            '    background: transparent;',
            '    color: transparent;',
            '    caret-color: var(--vscode-editorCursor-foreground, #ffffff);',
            '    z-index: 2;',
            '    resize: none;',
            '    outline: none;',
            '    -webkit-text-fill-color: transparent;',
            '    scrollbar-width: thin;',
            '    scrollbar-color: var(--vscode-scrollbarSlider-background, rgba(121, 121, 121, 0.4)) transparent;',
            '}',

            '.sned-editor-textarea::selection {',
            '    background: var(--vscode-editor-selectionBackground, rgba(38, 79, 120, 0.6));',
            '}',

            '.sned-editor-textarea::-webkit-scrollbar {',
            '    width: 10px;',
            '    height: 10px;',
            '}',

            '.sned-editor-textarea::-webkit-scrollbar-track {',
            '    background: transparent;',
            '}',

            '.sned-editor-textarea::-webkit-scrollbar-thumb {',
            '    background: var(--vscode-scrollbarSlider-background, rgba(121, 121, 121, 0.4));',
            '    border-radius: 5px;',
            '}',

            '.sned-editor-textarea::-webkit-scrollbar-thumb:hover {',
            '    background: var(--vscode-scrollbarSlider-hoverBackground, rgba(100, 100, 100, 0.7));',
            '}',


            // ============================================================
            // SPICE Syntax Highlighting
            //
            // ONLY:
            //   1. Components
            //   2. Directives
            //   3. Comments
            //
            // Numbers / nodes / values / units are NOT colored.
            // ============================================================

            '.tok-spice-component {',
            '    color: #569cd6;',
            '    font-weight: 600;',
            '}',

            '.tok-spice-directive {',
            '    color: #c586c0;',
            '    font-weight: 600;',
            '}',

            '.tok-spice-comment {',
            '    color: #6a9955;',
            '    font-style: italic;',
            '}',

            '.tok-spice-continuation {',
            '    color: #808080;',
            '}',


            // ============================================================
            // Status Bar
            // ============================================================

            '.sned-buttons-bar {',
            '    display: flex;',
            '    justify-content: space-between;',
            '    align-items: center;',
            '    padding: 6px 12px;',
            '    background: var(--vscode-statusBar-background, #007acc);',
            '    border-top: 1px solid var(--vscode-statusBar-border, #007acc);',
            '    flex-shrink: 0;',
            '    gap: 12px;',
            '    min-height: 22px;',
            '}',

            '.sned-status {',
            '    font-size: 12px;',
            '    color: var(--vscode-statusBar-foreground, #ffffff);',
            '    font-family: var(--vscode-font-family, "Segoe UI", sans-serif);',
            '    font-weight: 400;',
            '    letter-spacing: 0.3px;',
            '    white-space: nowrap;',
            '    overflow: hidden;',
            '    text-overflow: ellipsis;',
            '}',

            '.sned-status.modified {',
            '    color: var(--vscode-statusBar-foreground, #ffffff);',
            '    font-style: italic;',
            '}',

            '.sned-btn-group {',
            '    display: flex;',
            '    gap: 8px;',
            '    flex-shrink: 0;',
            '}',

            '.sned-btn {',
            '    padding: 4px 12px;',
            '    border: 1px solid var(--vscode-button-border, #3a3a3a);',
            '    border-radius: 2px;',
            '    font-size: 12px;',
            '    cursor: pointer;',
            '    background: var(--vscode-button-background, #3a3a3a);',
            '    color: var(--vscode-button-foreground, #dddddd);',
            '    font-weight: 400;',
            '    transition: background 0.15s;',
            '    font-family: var(--vscode-font-family, "Segoe UI", sans-serif);',
            '}',

            '.sned-btn:hover:not(:disabled) {',
            '    background: var(--vscode-button-hoverBackground, #4a4a4a);',
            '}',

            '.sned-btn-primary {',
            '    background: var(--vscode-button-background, #0e639c);',
            '    border-color: var(--vscode-button-border, #0e639c);',
            '    color: var(--vscode-button-foreground, #ffffff);',
            '}',

            '.sned-btn-primary:hover:not(:disabled) {',
            '    background: var(--vscode-button-hoverBackground, #1177bb);',
            '}',

            '.sned-btn:disabled {',
            '    opacity: 0.5;',
            '    cursor: not-allowed;',
            '}'

        ].join('\n');


        var head = document.head ||
                   document.getElementsByTagName('head')[0];

        var style = document.createElement('style');

        head.appendChild(style);

        style.type = 'text/css';

        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
    };


    // ================================================================
    // Inject HTML
    // ================================================================

    this.injectHTML = function() {

        var dialogHTML = [

            '<div id="spiceNetlistDialogOverlay"></div>',

            '<div id="spiceNetlistDialog">',

                '<div id="spiceNetlistDialogHeader">',

                    '<span id="spiceNetlistDialogTitle">',

                        '<span id="spiceNetlistIcon"></span>',

                        'SPICE Netlist Editor',

                    '</span>',

                    '<button id="spiceNetlistDialogClose" title="Close (Esc)">',
                        '&times;',
                    '</button>',

                '</div>',


                '<div class="sned-editor-container">',

                    '<div class="sned-line-numbers" id="snedLineNumbers">',
                    '</div>',

                    '<div class="sned-editor-wrapper">',

                        '<pre class="sned-highlight-layer" id="snedHighlight">',
                        '</pre>',

                        '<textarea class="sned-editor-textarea" ',
                        'id="snedCodeEditor" spellcheck="false" ',
                        'autocorrect="off" autocapitalize="off" ',
                        'placeholder="* Enter SPICE netlist here...">',
                        '</textarea>',

                    '</div>',

                '</div>',


                '<div class="sned-buttons-bar">',

                    '<span class="sned-status" id="snedStatus">',
                        'Ready',
                    '</span>',

                    '<div class="sned-btn-group">',

                        '<button class="sned-btn" id="snedBtnCancel">',
                            'Cancel',
                        '</button>',

                        '<button class="sned-btn sned-btn-primary" id="snedBtnOk">',
                            'Apply',
                        '</button>',

                    '</div>',

                '</div>',

            '</div>'

        ].join('\n');


        document.body.insertAdjacentHTML(
            'beforeend',
            dialogHTML
        );
    };


    // ================================================================
    // Cache DOM refs
    // ================================================================

    this.cacheDOM = function() {

        codeEditor =
            document.getElementById('snedCodeEditor');

        lineNumbers =
            document.getElementById('snedLineNumbers');

        highlightLayer =
            document.getElementById('snedHighlight');

        dialogEl =
            document.getElementById('spiceNetlistDialog');
    };


    // ================================================================
    // Toggle
    // ================================================================

    this.toggle = function() { selfDialog.isVisible ? selfDialog.hide() : selfDialog.show(); };


    // ================================================================
    // Show
    // ================================================================

    this.show = function() {

        var dialog =
            document.getElementById('spiceNetlistDialog');

        var overlay =
            document.getElementById('spiceNetlistDialogOverlay');


        if (dialog) {

            dialog.classList.add('visible');

            if (overlay) {
                overlay.classList.add('visible');
            }

            selfDialog.isVisible = true;

            selfDialog.bindKeyEvents();


            setTimeout(function() {

                if (codeEditor) {
                    codeEditor.focus();
                }

            }, 50);
        }
    };


    // ================================================================
    // Hide
    // ================================================================

    this.hide = function() {

        var dialog =
            document.getElementById('spiceNetlistDialog');

        var overlay =
            document.getElementById('spiceNetlistDialogOverlay');


        if (dialog) {

            dialog.classList.remove('visible');

            if (overlay) {
                overlay.classList.remove('visible');
            }

            selfDialog.isVisible = false;

            selfDialog.unbindKeyEvents();
        }
    };


    // ================================================================
    // Keyboard Events
    // ================================================================

    this.bindKeyEvents = function() {

        document.addEventListener(
            'keydown',
            selfDialog.keyHandler
        );
    };


    this.unbindKeyEvents = function() {

        document.removeEventListener(
            'keydown',
            selfDialog.keyHandler
        );
    };


    this.keyHandler = function(e) {

        // ESC
        if (e.key === 'Escape') {

            e.preventDefault();

            selfDialog.cancelDialog();

            return false;
        }


        // Ctrl + S / Cmd + S
        if (
            (e.ctrlKey || e.metaKey) &&
            (e.key === 's' || e.key === 'S')
        ) {

            e.preventDefault();

            selfDialog.submitResult();
        }
    };


    // ================================================================
    // Callbacks
    // ================================================================

    this.setCallbacks = function(onSubmit, onCancel) {

        selfDialog.onSubmit =
            onSubmit || null;

        selfDialog.onCancel =
            onCancel || null;
    };


    // ================================================================
    // Initialize with content
    // ================================================================

    this.initData = function(netlist) {

        selfDialog.netlistContent =
            (netlist || '').replace(
                /^[ \t]*\r?\n/gm,
                ''
            );


        if (codeEditor) {

            codeEditor.placeholder =
                '* Enter SPICE netlist here...\n' +
                '* Example:\n' +
                'R1 1 0 1k\n' +
                'V1 1 0 DC 5';

            codeEditor.value =
                selfDialog.netlistContent;
        }


        selfDialog.updateLineNumbers();

        selfDialog.updateHighlighting();

        selfDialog.updateStatus('Ready');
    };


    // ================================================================
    // SPICE Syntax Highlighting
    //
    // ONLY:
    //   - Component names
    //   - Directives
    //   - Comments
    //
    // Numbers, nodes, values and units remain normal text.
    // ================================================================

    this.highlightNetlist = function(code) {

        if (!code) {
            return '';
        }


        // ------------------------------------------------------------
        // Escape HTML
        // ------------------------------------------------------------

        var escaped = code
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');


        // ------------------------------------------------------------
        // Split into lines
        // ------------------------------------------------------------

        var lines =
            escaped.split('\n');

        var processedLines = [];


        // ------------------------------------------------------------
        // SPICE directives
        // ------------------------------------------------------------

        var directives = [

            'MODEL',
            'SUBCKT',
            'ENDS',
            'END',
            'PARAM',
            'INCLUDE',
            'LIB',
            'OPTIONS',
            'TEMP',
            'TNOM',
            'IC',
            'NODESET',
            'FUNC',
            'CONTROL',
            'ENDCONTROL',
            'PLOT',
            'PRINT',
            'PROBE',
            'WIDTH',
            'MEAS',
            'DISTO',
            'FOURIER',
            'NOISE',
            'OP',
            'SENS',
            'STEP',
            'TF',
            'TRAN',
            'AC',
            'DC',
            'PZ',
            'ZERO',
            'POLE',
            'FOUR',
            'SAVE',
            'LOAD',
            'GLOBAL'

        ];


        var directiveRegex =
            new RegExp(
                '\\.(' +
                directives.join('|') +
                ')(?=\\s|$|\\()',
                'gi'
            );


        // ------------------------------------------------------------
        // Component prefix
        //
        // R resistor
        // C capacitor
        // L inductor
        // V voltage source
        // I current source
        // D diode
        // Q BJT
        // M MOSFET
        // J JFET
        // B behavioral source
        // X subcircuit
        // etc.
        // ------------------------------------------------------------

        var componentRegex =
            /^\s*([RCVLIDQMJFGHEKOSTWXBU][a-zA-Z0-9_#]*)\s+/i;


        // ------------------------------------------------------------
        // Process every line
        // ------------------------------------------------------------

        for (var i = 0; i < lines.length; i++) {

            var line =
                lines[i];

            var processed =
                line;


            // ========================================================
            // Full-line comment
            // SPICE comments start with *
            // ========================================================

            if (/^\s*\*/.test(line)) {

                processed =
                    '<span class="tok-spice-comment">' +
                    line +
                    '</span>';

                processedLines.push(processed);

                continue;
            }


            // ========================================================
            // Inline comment
            // $ starts comment when preceded by whitespace
            // ========================================================

            var commentIndex = -1;

            var dollarPos =
                line.indexOf('$');


            while (dollarPos !== -1) {

                if (
                    dollarPos === 0 ||
                    /\s/.test(line[dollarPos - 1])
                ) {

                    commentIndex =
                        dollarPos;

                    break;
                }


                dollarPos =
                    line.indexOf(
                        '$',
                        dollarPos + 1
                    );
            }


            var codePart =
                line;

            var commentPart =
                '';


            if (commentIndex !== -1) {

                codePart =
                    line.substring(
                        0,
                        commentIndex
                    );

                commentPart =
                    line.substring(
                        commentIndex
                    );
            }


            // ========================================================
            // Continuation line
            // ========================================================

            if (/^\s*\+/.test(codePart)) {

                codePart =
                    '<span class="tok-spice-continuation">' +
                    codePart +
                    '</span>';
            }


            // ========================================================
            // Directive line
            // ========================================================

            else if (/^\s*\./.test(codePart)) {

                codePart =
                    codePart.replace(
                        directiveRegex,
                        '<span class="tok-spice-directive">.$1</span>'
                    );
            }


            // ========================================================
            // Component line
            // ========================================================

            else {

                var compMatch =
                    codePart.match(componentRegex);


                if (compMatch) {

                    var compName =
                        compMatch[1];

                    var prefixLength =
                        compMatch[0].length;


                    var leadingSpace =
                        compMatch[0].substring(
                            0,
                            compMatch[0].length -
                            compName.length -
                            1
                        );


                    var restOfLine =
                        codePart.substring(
                            prefixLength
                        );


                    // ------------------------------------------------
                    // Highlight ONLY component name
                    // ------------------------------------------------

                    var highlighted =
                        leadingSpace +
                        '<span class="tok-spice-component">' +
                        compName +
                        '</span> ';


                    // ------------------------------------------------
                    // Everything else stays normal text
                    //
                    // No node highlighting
                    // No number highlighting
                    // No unit highlighting
                    // No model highlighting
                    // ------------------------------------------------

                    highlighted +=
                        restOfLine;


                    codePart =
                        highlighted;
                }
            }


            // ========================================================
            // Add inline comment
            // ========================================================

            if (commentPart) {

                processed =
                    codePart +
                    '<span class="tok-spice-comment">' +
                    commentPart +
                    '</span>';

            } else {

                processed =
                    codePart;
            }


            processedLines.push(
                processed
            );
        }


        return processedLines.join('\n');
    };


    // ================================================================
    // Update highlighting
    // ================================================================

    this.updateHighlighting = function() {

        if (
            !highlightLayer ||
            !codeEditor
        ) {
            return;
        }


        var code =
            codeEditor.value;


        var highlighted =
            selfDialog.highlightNetlist(
                code
            );


        highlightLayer.innerHTML =
            highlighted + '\n';
    };


    // ================================================================
    // Update line numbers
    // ================================================================

    this.updateLineNumbers = function() {

        if (
            !codeEditor ||
            !lineNumbers
        ) {
            return;
        }


        var lines =
            codeEditor.value.split('\n');


        var cursorPos =
            codeEditor.selectionStart;


        var textBefore =
            codeEditor.value.substring(
                0,
                cursorPos
            );


        var currentLineNum =
            textBefore.split('\n').length;


        var html =
            '';


        for (
            var i = 0;
            i < lines.length;
            i++
        ) {

            var cls =
                (i + 1 === currentLineNum)
                    ? ' class="current"'
                    : '';


            html +=
                '<span' +
                cls +
                '>' +
                (i + 1) +
                '</span>';
        }


        lineNumbers.innerHTML =
            html;


        selfDialog.currentLine =
            currentLineNum;
    };


    // ================================================================
    // Status
    // ================================================================

    this.updateStatus = function(msg, type) {

        var status =
            document.getElementById(
                'snedStatus'
            );


        if (status) {

            status.textContent =
                msg;


            status.classList.remove(
                'modified'
            );


            if (type === 'modified') {

                status.classList.add(
                    'modified'
                );
            }
        }
    };


    // ================================================================
    // Submit result
    // ================================================================

    this.submitResult = function() {

        var result =
            codeEditor
                ? codeEditor.value
                : '';


        var submitCallback =
            selfDialog.onSubmit;


        selfDialog.hide();


        if (
            typeof submitCallback ===
            'function'
        ) {

            submitCallback(result);
        }


        return result;
    };


    // ================================================================
    // Cancel
    // ================================================================

    this.cancelDialog = function() {

        var cancelCallback =
            selfDialog.onCancel;


        selfDialog.hide();


        if (
            typeof cancelCallback ===
            'function'
        ) {

            cancelCallback();
        }


        return null;
    };


    // ================================================================
    // Synchronize scroll
    // ================================================================

    this.syncScroll = function() {

        if (!codeEditor) {
            return;
        }


        var scrollTop =
            codeEditor.scrollTop;

        var scrollLeft =
            codeEditor.scrollLeft;


        if (lineNumbers) {

            lineNumbers.scrollTop =
                scrollTop;
        }


        if (highlightLayer) {

            highlightLayer.scrollTop =
                scrollTop;

            highlightLayer.scrollLeft =
                scrollLeft;
        }
    };


    // ================================================================
    // Initialize events
    // ================================================================

    this.init = function() {

        selfDialog.cacheDOM();


        var dialog =
            document.getElementById(
                'spiceNetlistDialog'
            );


        var header =
            document.getElementById(
                'spiceNetlistDialogHeader'
            );


        var closeBtn =
            document.getElementById(
                'spiceNetlistDialogClose'
            );


        var overlay =
            document.getElementById(
                'spiceNetlistDialogOverlay'
            );


        var btnCancel =
            document.getElementById(
                'snedBtnCancel'
            );


        var btnOk =
            document.getElementById(
                'snedBtnOk'
            );


        // ------------------------------------------------------------
        // Close button
        // ------------------------------------------------------------

        if (closeBtn) {

            closeBtn.addEventListener(
                'click',
                function(e) {

                    e.stopPropagation();

                    selfDialog.cancelDialog();
                }
            );
        }


        // ------------------------------------------------------------
        // Overlay
        // ------------------------------------------------------------

        if (overlay) {

            overlay.addEventListener(
                'click',
                function(e) {

                    e.preventDefault();

                    e.stopPropagation();
                }
            );
        }


        // ------------------------------------------------------------
        // Cancel
        // ------------------------------------------------------------

        if (btnCancel) {

            btnCancel.addEventListener(
                'click',
                function() {

                    selfDialog.cancelDialog();
                }
            );
        }


        // ------------------------------------------------------------
        // Apply
        // ------------------------------------------------------------

        if (btnOk) {

            btnOk.addEventListener(
                'click',
                function() {

                    selfDialog.submitResult();
                }
            );
        }


        // ============================================================
        // Editor events
        // ============================================================

        if (codeEditor) {


            // --------------------------------------------------------
            // Input
            // --------------------------------------------------------

            codeEditor.addEventListener(
                'input',
                function() {

                    // Remove empty and whitespace-only lines.
                    var cursorPos =
                        this.selectionStart;

                    var contentBeforeCursor =
                        this.value.substring(
                            0,
                            cursorPos
                        );

                    var cleanedValue =
                        this.value.replace(
                            /^[ \t]*\r?\n/gm,
                            ''
                        );

                    if (cleanedValue !== this.value) {

                        this.value =
                            cleanedValue;

                        this.selectionStart =
                            this.selectionEnd =
                                contentBeforeCursor.replace(
                                    /^[ \t]*\r?\n/gm,
                                    ''
                                ).length;
                    }

                    selfDialog.updateLineNumbers();

                    selfDialog.updateHighlighting();


                    var lineCount =
                        this.value.split('\n').length;


                    selfDialog.updateStatus(
                        'Lines: ' + lineCount,
                        'modified'
                    );
                }
            );


            // --------------------------------------------------------
            // Scroll
            // --------------------------------------------------------

            codeEditor.addEventListener(
                'scroll',
                selfDialog.syncScroll
            );


            // --------------------------------------------------------
            // Keyup
            // --------------------------------------------------------

            codeEditor.addEventListener(
                'keyup',
                selfDialog.updateLineNumbers
            );


            // --------------------------------------------------------
            // Click
            // --------------------------------------------------------

            codeEditor.addEventListener(
                'click',
                selfDialog.updateLineNumbers
            );


            // --------------------------------------------------------
            // Tab support
            // --------------------------------------------------------

            codeEditor.addEventListener(
                'keydown',
                function(e) {

                    if (e.key === 'Tab') {

                        e.preventDefault();


                        var start =
                            this.selectionStart;

                        var end =
                            this.selectionEnd;


                        var spaces =
                            '    ';


                        this.value =
                            this.value.substring(
                                0,
                                start
                            ) +
                            spaces +
                            this.value.substring(
                                end
                            );


                        this.selectionStart =
                            this.selectionEnd =
                                start +
                                spaces.length;


                        selfDialog.updateLineNumbers();

                        selfDialog.updateHighlighting();
                    }
                }
            );
        }


        // ============================================================
        // Drag functionality
        // ============================================================

        if (header) {

            header.addEventListener(
                'mousedown',
                function(e) {


                    if (
                        e.target === closeBtn ||
                        closeBtn.contains(e.target)
                    ) {
                        return;
                    }


                    if (!dialog) {
                        return;
                    }


                    isDragging =
                        true;


                    var rect =
                        dialog.getBoundingClientRect();


                    dialogStartX =
                        rect.left;

                    dialogStartY =
                        rect.top;


                    dragStartX =
                        e.clientX;

                    dragStartY =
                        e.clientY;


                    dialog.style.transform =
                        'none';


                    dialog.style.left =
                        dialogStartX + 'px';

                    dialog.style.top =
                        dialogStartY + 'px';


                    document.body.style.userSelect =
                        'none';


                    e.preventDefault();
                }
            );
        }


        // ============================================================
        // Mouse move
        // ============================================================

        document.addEventListener(
            'mousemove',
            function(e) {

                if (
                    !isDragging ||
                    !dialog
                ) {
                    return;
                }


                var newX =
                    dialogStartX +
                    (e.clientX - dragStartX);


                var newY =
                    dialogStartY +
                    (e.clientY - dragStartY);


                var viewportWidth =
                    window.innerWidth;

                var viewportHeight =
                    window.innerHeight;


                // Keep inside horizontal viewport

                if (newX < 0) {
                    newX = 0;
                }


                if (
                    newX +
                    dialog.offsetWidth >
                    viewportWidth
                ) {

                    newX =
                        viewportWidth -
                        dialog.offsetWidth;
                }


                // Keep inside vertical viewport

                if (newY < 0) {
                    newY = 0;
                }


                if (
                    newY +
                    dialog.offsetHeight >
                    viewportHeight
                ) {

                    newY =
                        viewportHeight -
                        dialog.offsetHeight;
                }


                dialog.style.left =
                    newX + 'px';

                dialog.style.top =
                    newY + 'px';
            }
        );


        // ============================================================
        // Mouse up
        // ============================================================

        document.addEventListener(
            'mouseup',
            function() {

                if (isDragging) {

                    isDragging =
                        false;

                    document.body.style.userSelect =
                        '';
                }
            }
        );
    };


    // ================================================================
    // Initialize
    // ================================================================

    this.injectCSS();

    this.injectHTML();

    this.init();
}


// ================================================================
// Global instance
// ================================================================

var spiceNetlistDialog;