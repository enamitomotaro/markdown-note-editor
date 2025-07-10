import { ChangeEvent, KeyboardEvent, MouseEvent, FormEvent } from 'react';

// Input要素のイベント型
export type InputChangeEvent = ChangeEvent<HTMLInputElement>;
export type TextareaChangeEvent = ChangeEvent<HTMLTextAreaElement>;
export type SelectChangeEvent = ChangeEvent<HTMLSelectElement>;

// キーボードイベント型
export type InputKeyboardEvent = KeyboardEvent<HTMLInputElement>;
export type TextareaKeyboardEvent = KeyboardEvent<HTMLTextAreaElement>;

// マウスイベント型
export type ButtonClickEvent = MouseEvent<HTMLButtonElement>;
export type DivClickEvent = MouseEvent<HTMLDivElement>;
export type LinkClickEvent = MouseEvent<HTMLAnchorElement>;

// フォームイベント型
export type FormSubmitEvent = FormEvent<HTMLFormElement>;

// 汎用ハンドラー型
export type VoidHandler = () => void;
export type ValueHandler<T> = (value: T) => void;
export type EventHandler<T> = (event: T) => void;