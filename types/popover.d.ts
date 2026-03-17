import { VNode, VNodeDirective } from 'vue'
import { ElementUIComponent } from './component'

export type PopoverTrigger = 'click' | 'focus' | 'hover' | 'manual'
export type PopoverPlacement = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end'

export interface PopoverSlots {
  /** Content of popover */
  default: VNode[],

  /** HTML element that triggers popover */
  reference: VNode[]

  [key: string]: VNode[]
}

/** Popover directive definition */
export interface ElPopoverDirective extends VNodeDirective {
  name: 'popover',
  arg: string
}

/** Popover Component */
export declare class ElPopover extends ElementUIComponent {
  /** How the popover is triggered */
  trigger: PopoverTrigger

  /** Popover title */
  title: string

  /** Popover content, can be replaced with a default slot */
  content: string

  /** Popover width */
  width: string | number

  /** Popover placement */
  placement: PopoverPlacement

  /** Whether Popover is disabled */
  disabled: boolean

  /** Whether popover is visible */
  value: boolean

  /** Popover offset */
  offset: number

  /** Popover transition animation */
  transition: string

  /** Whether a tooltip arrow is displayed or not. For more info, please refer to Vue-popper */
  visibleArrow: boolean

  /** Parameters for popper.js */
  popperOptions: object

  /** Custom class name for popover */
  popperClass: string

  /** Delay before appearing when trigger is hover, in milliseconds */
  openDelay: number

  /** Delay before disappearing when trigger is hover, in milliseconds */
  closeDelay: number

  /** Popover tabindex */
  tabindex: number

  /** Arrow offset in pixels */
  arrowOffset: number

  /** Whether to append popover element to document.body */
  appendToBody: boolean

  $slots: PopoverSlots

  /** Programmatic open. When used as singleton, you can pass reference/content etc. */
  open(options?: {
    reference?: HTMLElement
    content?: string
    title?: string
    placement?: PopoverPlacement
    width?: string | number
    popperClass?: string
  }): void

  /** Programmatic close */
  close(): void

  /** Programmatic toggle */
  toggle(options?: {
    reference?: HTMLElement
    content?: string
    title?: string
    placement?: PopoverPlacement
    width?: string | number
    popperClass?: string
  }): void

  /** Update the reference element for positioning (singleton mode) */
  setReference(el: HTMLElement): void
}
