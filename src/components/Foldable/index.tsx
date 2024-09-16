/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { type CSSProperties, type ReactNode } from 'react';

import styles from './styles.module.css';

interface Props {
    children: ReactNode;
    title: string;
    defaultOpen: boolean;
    style?: CSSProperties;
    titleStyle?: CSSProperties;
    bodyStyle?: CSSProperties;
}

export default function Foldable({
    children,
    title = '',
    defaultOpen = false,
    style,
    titleStyle,
    bodyStyle,
}: Props): JSX.Element {
    return (
        <details className={styles.foldable} style={style} open={defaultOpen}>
            <summary className={styles.foldableTitle} style={titleStyle} >{title}</summary>
            <div className={styles.foldableBody} style={bodyStyle}>
                {children}
            </div>
        </details>
    );
}